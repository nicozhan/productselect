// server/parse.js
// 从 InfiniSynapse 返回的 Markdown 报告中抽取机器可读的结构化结果（5 大块）。
// 容错优先：任何一块解析失败都返回空，前端自动回退到「完整报告」渲染。

function num(s) {
  if (!s) return 0;
  const m = String(s).replace(/\*\*/g, '').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
}
function stripMarks(s) {
  return String(s == null ? '' : s).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
}
function findHeader(headers, kws) {
  for (const kw of kws) {
    const h = headers.find(x => x && x.includes(kw));
    if (h) return h;
  }
  return null;
}

// 取某个 ## 分节的正文（到下一个 ## 之前）
function extractSection(md, kw) {
  const lines = (md || '').split('\n');
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i]) && lines[i].includes(kw)) { start = i; break; }
  }
  if (start < 0) return '';
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) { end = i; break; }
  }
  return lines.slice(start, end).join('\n');
}

function splitRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map(c => c.trim());
}
// 解析 markdown 表格 → { headers, rows:[{header:cell}] }
function parseMarkdownTable(text) {
  const lines = (text || '').split('\n');
  let i = 0;
  // 跳过空行 / 引用块(>...) / 非表格行，定位真正的表头
  while (i < lines.length && (!/\|/.test(lines[i]) || /^\s*>/.test(lines[i]))) i++;
  if (i >= lines.length) return null;
  const headers = splitRow(lines[i]);
  if (i + 1 < lines.length && !/^\s*>/.test(lines[i + 1]) && /-/.test(lines[i + 1]) && /\|/.test(lines[i + 1])) i++;
  const rows = [];
  i++;
  while (i < lines.length && /\|/.test(lines[i])) {
    if (/^\s*>/.test(lines[i])) { i++; continue; } // 跳过引用块
    const cells = splitRow(lines[i]);
    if (cells.length && cells.every(c => /^:?-+:?$/.test(c))) { i++; continue; }
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = cells[idx] !== undefined ? cells[idx] : ''; });
    rows.push(obj);
    i++;
  }
  return { headers, rows };
}

export function extractDecision(md) {
  const sec = extractSection(md, '一句话决策');
  if (!sec) return null;
  const bq = sec.split('\n').filter(l => l.trim().startsWith('>')).map(l => l.replace(/^>\s?/, ''));
  if (bq.length) return stripMarks(bq.join(' '));
  const first = sec.split('\n').map(l => l.trim()).find(l => l && !l.startsWith('#'));
  return first ? stripMarks(first) : null;
}

export function extractScores(md) {
  const sec = extractSection(md, '商品评分');
  const t = parseMarkdownTable(sec);
  if (!t || !t.rows.length) return [];
  const dimHeaders = t.headers.filter(h => !/(商品|综合|得分|补货|建议)/.test(h));
  return t.rows.map(r => {
    const productH = findHeader(t.headers, ['商品']) || t.headers[0];
    const totalH = findHeader(t.headers, ['综合', '得分']);
    const suggH = findHeader(t.headers, ['补货', '建议']);
    return {
      product: stripMarks(r[productH]),
      subs: dimHeaders.map(h => ({ label: h, value: num(r[h]) })),
      total: num(r[totalH]),
      suggestion: stripMarks(r[suggH])
    };
  });
}

export function extractBasket(md) {
  const sec = extractSection(md, '关联销售');
  const t = parseMarkdownTable(sec);
  if (!t || !t.rows.length) return [];
  const pairH = findHeader(t.headers, ['搭配']);
  const strH = findHeader(t.headers, ['关联强度', '强度']);
  const logicH = findHeader(t.headers, ['场景逻辑', '逻辑']);
  const crossH = findHeader(t.headers, ['交叉', '建议']);
  const upH = findHeader(t.headers, ['提升', '销量提升']);
  return t.rows.map(r => ({
    pair: stripMarks(r[pairH]),
    strength: num(r[strH]),
    logic: r[logicH] || '',
    crossSell: r[crossH] || '',
    uplift: num(r[upH])
  }));
}

export function extractTomorrow(md) {
  const sec = extractSection(md, 'AI Tomorrow') || extractSection(md, '明日');
  const t = parseMarkdownTable(sec);
  if (!t || !t.rows.length) return [];
  const prodH = findHeader(t.headers, ['商品']) || t.headers[0];
  const actH = findHeader(t.headers, ['行动']);
  const qtyH = findHeader(t.headers, ['补货量', '建议补货']);
  const predH = findHeader(t.headers, ['预测销量', '明日预测']);
  const vsH = findHeader(t.headers, ['vs', '昨日']);
  const reasonH = findHeader(t.headers, ['理由', '原因']);
  return t.rows.map(r => ({
    product: stripMarks(r[prodH]),
    action: stripMarks(r[actH]),
    qty: stripMarks(r[qtyH]),
    predict: num(r[predH]),
    vsYesterday: stripMarks(r[vsH]),
    reason: r[reasonH] || ''
  }));
}

export function extractScene(md) {
  const sec = extractSection(md, '场景识别');
  if (!sec) return null;
  const body = sec.split('\n').slice(1).join('\n').trim(); // 去掉标题行
  // 尝试抽取「品类加减建议」子表
  const sub = extractSection(sec, '品类加减') || extractSection(sec, '加减建议');
  const t = sub ? parseMarkdownTable(sub) : null;
  let addReduce = [];
  if (t && t.rows.length) {
    const actH = findHeader(t.headers, ['建议', '动作', '操作']);
    const catH = findHeader(t.headers, ['品类', '商品']);
    const reasonH = findHeader(t.headers, ['理由', '原因']);
    addReduce = t.rows.map(r => ({
      action: stripMarks(r[actH]),
      category: stripMarks(r[catH]),
      reason: r[reasonH] || ''
    }));
  }
  return { markdown: body, addReduce };
}

export function extractStructured(md) {
  if (!md) return null;
  const decision = extractDecision(md);
  const scores = extractScores(md);
  const basket = extractBasket(md);
  const tomorrow = extractTomorrow(md);
  const scene = extractScene(md);
  if (!decision && !scores.length && !basket.length && !tomorrow.length && !scene) return null;
  return { decision, scores, basket, tomorrow, scene };
}
