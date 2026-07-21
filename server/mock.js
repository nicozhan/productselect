// server/mock.js
// 演示模式分析生成器：输出结构与真实 InfiniSynapse 返回完全一致
// （Markdown 报告 + 末尾 JSON 块），便于无 Key 时预览与离线评审。

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}
function pick(r, min, max) { return Math.floor(min + r() * (max - min + 1)); }

function parseProducts(salesData) {
  if (!salesData) return null;
  const lines = salesData.trim().split('\n');
  if (lines.length < 2) return null;
  const header = lines[0].split(',').map(x => x.trim());
  const idx = header.findIndex(h => /商品|产品|name/i.test(h));
  if (idx < 0) return null;
  return lines.slice(1).map(l => l.split(',')[idx] && l.split(',')[idx].trim()).filter(Boolean).slice(0, 10);
}

const DEFAULT_PRODUCTS = ['可口可乐', '农夫山泉', '薯片', '功能饮料', '酸奶', '巧克力', '矿泉水', '咖啡'];

// 根据场景类型给不同品类加权，让评分看起来“因地制宜”
const SCENE_BIAS = {
  office: ['美式咖啡', '拿铁', '三明治', '红牛'],
  campus: ['可乐', '薯片', '泡面', '功能饮料'],
  gym: ['蛋白棒', '运动饮料', '电解质水', '香蕉'],
  metro: ['矿泉水', '咖啡', '面包', '雨伞'],
  sanlitun: ['苏打水', '无糖饮料', '气泡水', '啤酒'],
};

function guessPois(location, id) {
  const text = (location || '') + ' ' + (id || '');
  const pois = [];
  if (/写字楼|CBD|国贸/.test(text)) pois.push('写字楼', '商场', '咖啡店');
  if (/大学|宿舍|校园|school/i.test(text)) pois.push('学校', '宿舍', '食堂');
  if (/健身|gym/i.test(text)) pois.push('健身房', '运动场馆');
  if (/地铁|metro|换乘/.test(text)) pois.push('地铁站', '公交站');
  if (/三里屯|酒吧|soho/i.test(text)) pois.push('酒吧街', '商场', '体育馆');
  if (pois.length === 0) pois.push('写字楼', '商场', '地铁站');
  return [...new Set(pois)];
}

export function mockAnalysis(inputs = {}) {
  const { scenarioName, location, demographics = {}, weather = {}, event, holiday, salesData, id } = inputs;
  const products = parseProducts(salesData) || DEFAULT_PRODUCTS;
  let biasKey = id;
  if (!biasKey && scenarioName) biasKey = Object.keys(SCENE_BIAS).find(k => scenarioName.includes(k));
  const bias = biasKey ? SCENE_BIAS[biasKey] : [];

  const subsKeys = ['历史销量', '天气指数', '利润指数', '活动指数', '库存指数', '位置指数'];
  const weights = { '历史销量': 0.25, '天气指数': 0.15, '利润指数': 0.15, '活动指数': 0.15, '库存指数': 0.15, '位置指数': 0.15 };

  const scores = products.map(name => {
    const r = rng(hashStr(name + (id || '')));
    const subs = {};
    let total = 0;
    for (const k of subsKeys) {
      let base = pick(r, 55, 92);
      if (bias.includes(name) && (k === '位置指数' || k === '历史销量')) base = Math.min(99, base + pick(r, 3, 8));
      if (/无糖|苏打水|气泡水|水/.test(name) && k === '天气指数') base = Math.min(99, base + 4);
      subs[k] = base;
      total += base * (weights[k] || 0.15);
    }
    total = Math.round(total);
    let suggestion;
    if (total >= 85) suggestion = '增加' + pick(r, 15, 35) + (/水|饮料|咖啡|茶/.test(name) ? '瓶' : '件');
    else if (total >= 70) suggestion = '增加' + pick(r, 5, 15) + '件';
    else if (total >= 58) suggestion = '维持现有铺货';
    else suggestion = '减少' + pick(r, 8, 20) + '件';
    return { product: name, total, subs, suggestion };
  });
  scores.sort((a, b) => b.total - a.total);

  const pois = guessPois(location, id);
  const scene = {
    pois,
    weekdayFootfall: 18000 + (hashStr(location || 'x') % 12000),
    weekendFootfall: 40000 + (hashStr(location || 'y') % 20000),
    genderRatio: demographics.genderRatio || '女性 60%',
    ageRange: demographics.ageRange || '20-35 岁',
    suggestAdd: scores.slice(0, 3).map(s => s.product),
    suggestRemove: scores.slice(-2).map(s => s.product)
  };

  const pairs = [];
  for (let i = 0; i + 1 < products.length && pairs.length < 3; i += 2) {
    const r = rng(hashStr(products[i] + products[i + 1]));
    pairs.push({
      a: products[i], b: products[i + 1],
      rate: +(0.5 + r() * 0.27).toFixed(2),
      uplift: +(0.1 + r() * 0.18).toFixed(2),
      suggestAdd: products.slice(-2)
    });
  }

  const hot = (weather && weather.temp >= 28);
  const tomorrow = [];
  scores.slice(0, 2).forEach(s => {
    const r = rng(hashStr(s.product));
    tomorrow.push({ product: s.product, action: '增加', qty: pick(r, 15, 40), predictUplift: +(1.2 + r() * 0.8).toFixed(2) });
  });
  scores.slice(-1).forEach(s => tomorrow.push({ product: s.product, action: '不补', qty: 0, predictUplift: 0.8 }));
  if (hot) tomorrow.unshift({ product: '矿泉水', action: '增加', qty: 50, predictUplift: 1.8 });

  const top = scores[0];
  const pair0 = pairs[0];
  const pairLabel = pair0 ? (pair0.a + '+' + pair0.b) : '高频组合';
  const upliftPct = pair0 ? Math.round(pair0.uplift * 100) : 15;
  const hotNote = hot ? '高温天气下饮用水类需额外加补。' : '';
  const decision = '明天优先在「' + scene.pois.join('、') + '」场景主推「' + top.product +
    '」（综合评分 ' + top.total + '），建议' + top.suggestion + '；搭配「' + pairLabel +
    '」做关联陈列，预计连带提升 ' + upliftPct + '% 销量。' + hotNote;

  const result = { decision, scene, scores, basket: pairs, tomorrow };

  // 构造与真实接口同构的 Markdown 报告
  const subOf = (s) => subsKeys.map(k => s.subs[k]).join(' / ');
  const scoreRows = scores.map(s => '| ' + s.product + ' | ' + s.total + ' | ' + subOf(s) + ' | ' + s.suggestion + ' |').join('\n');
  const basketLines = pairs.map(p => '- **' + p.a + ' + ' + p.b + '**：用户一起买占比 ' + (p.rate * 100).toFixed(0) +
    '%，交叉销售建议增加 ' + p.suggestAdd.join('、') + '，预计销量提升 ' + (p.uplift * 100).toFixed(0) + '%').join('\n');
  const tomorrowLines = tomorrow.map(t => {
    const tag = t.action === '不补' ? '⛔ 暂不补' : '✅ 增加';
    const qty = t.qty ? ' ' + t.qty + ' 件' : '';
    const up = t.predictUplift ? '，预计销量 ×' + t.predictUplift : '';
    return '- ' + tag + ' **' + t.product + '**' + qty + up;
  }).join('\n');

  const reportText = '# AI 选品大脑 · 分析报告（演示模式）\n\n' +
    '> ⚠️ 当前为**演示模式**（未配置 INFINI_API_KEY）。下方为结构完全一致的模拟数据，配置真实 Key 后将由 InfiniSynapse 实时生成。\n\n' +
    '## 一句话决策\n' + decision + '\n\n' +
    '## AI 场景识别\n' +
    '- 500m POI：' + scene.pois.join('、') + '\n' +
    '- 工作日人流：约 ' + scene.weekdayFootfall.toLocaleString() + ' 人 / 周末：约 ' + scene.weekendFootfall.toLocaleString() + ' 人\n' +
    '- 用户画像：' + scene.genderRatio + '，年龄段 ' + scene.ageRange + '\n' +
    '- 建议增加：' + scene.suggestAdd.join('、') + ' ｜ 建议减少：' + scene.suggestRemove.join('、') + '\n\n' +
    '## AI 商品评分\n' +
    '| 商品 | 综合评分 | 子维度(历史/天气/利润/活动/库存/位置) | 建议 |\n| --- | --- | --- | --- |\n' +
    scoreRows + '\n\n' +
    '## 商品关联销售\n' + basketLines + '\n\n' +
    '## AI Tomorrow\n' + tomorrowLines + '\n\n' +
    '## 完整分析报告\n' +
    '本报告由演示数据生成。真实模式下，InfiniSynapse 会覆盖历史销售、时间、天气、地理位置、周边活动、节假日、用户画像、库存与保质期、商品关联销售、竞争环境、社交热点、AI 销量预测共 12 个维度，输出可执行的补货与陈列决策。\n\n' +
    '```json\n' + JSON.stringify(result, null, 2) + '\n```\n';

  return { taskId: 'mock-' + Math.random().toString(36).slice(2, 10), reportText, workspaceFiles: [] };
}
