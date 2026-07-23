// public/app.js
const $ = (s) => document.querySelector(s);
const state = { scenarios: [], realScenarios: [], cat: 'real', running: false, timer: null };

document.addEventListener('DOMContentLoaded', init);

async function init() {
  // 模式徽标
  try {
    const h = await fetch('/api/health').then(r => r.json());
    const badge = $('#modeBadge');
    badge.textContent = h.mock ? '演示模式' : '已接入 InfiniSynapse';
    badge.className = 'badge ' + (h.mock ? 'mock' : 'live');
  } catch { $('#modeBadge').textContent = '未知'; }

  // 场景
  try {
    const data = await fetch('/api/scenarios').then(r => r.json());
    state.scenarios = data.scenarios || [];
    renderScenarios();
  } catch (e) { console.error(e); }

  // 已有数据场景
  try {
    const data = await fetch('/api/real-scenarios').then(r => r.json());
    state.realScenarios = data.scenarios || [];
    renderScenarios(); // 已有数据已加载，重新渲染（默认即展示此分类）
  } catch (e) { console.error(e); }

  // 分类切换（模拟数据 / 已有数据）
  document.querySelectorAll('.seg-btn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.seg-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    state.cat = b.dataset.cat;
    renderScenarios();
  }));

  // Tab
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('tab-quick').classList.toggle('hidden', t.dataset.tab !== 'quick');
    document.getElementById('tab-custom').classList.toggle('hidden', t.dataset.tab !== 'custom');
  }));

  $('#customRun').addEventListener('click', () => {
    // 自定义分析需使用访客自己的账号额度：未登录先跳转登录/注册页
    if (!(state.me && state.me.loggedIn)) {
      window.location.href = '/auth/infini/login';
      return;
    }
    runAnalyze(readForm());
  });

  // 城市下拉选「其他」时显示手动输入框
  $('#f_city').addEventListener('change', (e) => {
    $('#f_city_other').classList.toggle('hidden', e.target.value !== '__other');
  });

  // 上传数据二维码弹窗：点击遮罩或关闭按钮关闭
  document.querySelectorAll('#qrModal [data-close]').forEach(el =>
    el.addEventListener('click', closeQrModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeQrModal(); });

  // 登录态
  refreshAuth();
}

async function refreshAuth() {
  try {
    const me = await fetch('/api/me').then(r => r.json());
    state.me = me;
    renderAuth(me);
  } catch { /* ignore */ }
}

function renderAuth(me) {
  const area = $('#authArea');
  const banner = $('#authBanner');
  if (me && me.loggedIn) {
    const u = me.user || {};
    const av = u.avatar
      ? `<img class="avatar" src="${esc(u.avatar)}" alt="" />`
      : `<span class="avatar avatar-text">${(u.nickname || 'U').slice(0, 1)}</span>`;
    area.innerHTML = `<span class="user-chip">${av}<span class="uname">${esc(u.nickname || u.email || '用户')}</span></span>` +
      `<a class="ghost-btn small" href="/auth/infini/logout">退出</a>`;
    if (banner) banner.classList.add('hidden');
  } else {
    area.innerHTML = `<a class="login-btn" href="/auth/infini/login">🔑 登录</a>`;
    if (banner && me && me.ssoEnabled) banner.classList.remove('hidden');
    else if (banner) banner.classList.add('hidden');
  }
}

function renderScenarios() {
  const grid = $('#scenarioGrid');
  grid.innerHTML = '';
  const list = state.cat === 'real' ? state.realScenarios : state.scenarios;
  const isReal = state.cat === 'real';
  const loggedIn = state.me && state.me.loggedIn;

  // 分类说明随选项变化
  const hint = $('#catHint');
  if (hint) hint.textContent = isReal
    ? '基于真实销售数据预生成的选品结论，约 10 秒加载即可查看，无需登录即可体验。'
    : '模拟数据由 AI 实时分析生成——需登录你自己的 InfiniSynapse 账号（用你自己的额度），点击卡片即前往登录。';

  if (isReal && (!list || !list.length)) {
    grid.innerHTML = '<div class="hint">已有数据场景加载中或暂不可用，请稍后重试或切换到「模拟数据」。</div>';
    return;
  }
  list.forEach(s => {
    const card = document.createElement('div');
    card.className = 'scenario-card' + (isReal ? ' real' : '');
    const badge = isReal ? `<div class="dtype">📁 已有数据</div>` : '';
    const lockNote = (!isReal && !loggedIn)
      ? `<div class="lock">🔒 需登录你的账号（用自己的额度实时分析）</div>` : '';
    const runText = isReal
      ? '加载固定数据，秒出结果 →'
      : (loggedIn ? '一键生成选品建议 →' : '登录后开始 AI 分析 →');
    card.innerHTML = `
      ${badge}
      <div class="icon">${s.icon || '📦'}</div>
      <div class="name">${esc(s.name)}</div>
      <div class="tag">${esc(s.tagline || '')}</div>
      <div class="loc">📍 ${esc(s.location || '')}</div>
      ${lockNote}
      <div class="run">⚡ ${runText}</div>`;
    card.addEventListener('click', () => {
      if (isReal) { runRealAnalysis(s); return; }
      // 模拟数据需使用访客自己的账号：未登录直接跳转登录/注册页
      if (loggedIn) startScenarioAnalysis(s);
      else window.location.href = '/auth/infini/login';
    });
    grid.appendChild(card);
  });

  // 「快速体验」两个分类下都提供「预览报告」与「上传你的数据」两个模块
  {
    // 预览报告：直接跳转到基于真实数据的年度运营优化建议书网页
    const rep = document.createElement('div');
    rep.className = 'scenario-card report-card';
    rep.innerHTML = `
      <div class="report-ic">📄</div>
      <div class="name">预览报告</div>
      <div class="tag">基于真实数据的 2023 年度自动售货机运营优化建议书</div>
      <div class="run">📊 打开完整报告 →</div>`;
    rep.addEventListener('click', () => window.open('/report-2023.html', '_blank'));
    grid.appendChild(rep);

    // 上传你的数据：说明所需字段 + 提供模板下载 + 点击弹联系二维码
    const up = document.createElement('div');
    up.className = 'scenario-card upload-card';
    up.innerHTML = `
      <div class="upload-plus">+</div>
      <div class="name">上传你的数据</div>
      <div class="tag">连接真实售货柜数据，让 AI 生成专属运营方案</div>
      <div class="need-title">📋 我们分析需要的数据字段：</div>
      <ul class="need-list">
        <li>点位 / 设备名称、设备编号</li>
        <li>商品名称、商品分类</li>
        <li>交易日期、支付方式（现金 / 刷卡）</li>
        <li>销量（件）、单价、金额合计</li>
        <li>货道 / 库存信息（选填，可提升精度）</li>
      </ul>
      <a class="tpl-down" href="/assets/vending-data-template.xlsx" download>⬇ 下载数据模板（Excel）</a>
      <div class="run">⚡ 联系我们接入你的数据 →</div>`;
    up.addEventListener('click', openQrModal);
    const dl = up.querySelector('.tpl-down');
    if (dl) dl.addEventListener('click', e => e.stopPropagation()); // 下载不触发二维码弹窗
    grid.appendChild(up);
  }
}

// 两层体验的第一层（卡片）→ 第二层（AI 正在分析过程动画）→ 真实分析 → 结果
async function startScenarioAnalysis(s) {
  if (state.running) return;
  state.running = true;
  const ov = $('#analyzeOverlay');
  resetSteps();
  $('#aoTitle').innerHTML = 'AI 正在分析 <b>' + esc(s.name) + '</b>…';
  $('#aoStep1').textContent = '匹配 ' + (s.deviceCount || 0).toLocaleString() + ' 台' + (s.sceneWord || '场景') + '设备历史数据';
  $('#aoLog').textContent = '';
  ov.classList.remove('hidden');
  window.scrollTo({ top: ov.offsetTop - 30, behavior: 'smooth' });

  stepDone(1);
  await wait(450);
  stepDone(2);
  await wait(450);
  stepDone(3);
  stepRunning(4);

  let jobId;
  try {
    const r = await fetch('/api/analyze', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: scenarioInputs(s) })
    }).then(r => r.json());
    jobId = r.jobId;
  } catch (e) {
    stepErr(4);
    $('#aoLog').textContent += '\n❌ 提交失败：' + e.message;
    state.running = false; return;
  }
  pollJob(jobId);
}

function scenarioInputs(s) {
  return {
    scenarioName: s.name, location: s.location, city: s.city, deviceId: s.deviceId,
    weather: s.weather, event: s.event, holiday: s.holiday,
    demographics: s.demographics, inventoryNotes: s.inventoryNotes,
    businessHours: s.businessHours, salesData: s.salesData, focus: s.focus
  };
}

function wait(ms) { return new Promise(res => setTimeout(res, ms)); }
function resetSteps() { document.querySelectorAll('#analyzeOverlay .ao-step').forEach(li => li.classList.remove('done', 'running', 'err')); }
function stepDone(n) { const li = document.querySelector('#analyzeOverlay .ao-step[data-step="' + n + '"]'); if (li) { li.classList.remove('running'); li.classList.add('done'); } }
function stepRunning(n) { const li = document.querySelector('#analyzeOverlay .ao-step[data-step="' + n + '"]'); if (li) li.classList.add('running'); }
function stepErr(n) { const li = document.querySelector('#analyzeOverlay .ao-step[data-step="' + n + '"]'); if (li) { li.classList.remove('running'); li.classList.add('err'); } }

function pollJob(jobId) {
  fetch('/api/job/' + jobId).then(r => r.json()).then(job => {
    if (job.progress && job.progress.length) {
      $('#aoLog').textContent = job.progress.join('\n');
      $('#aoLog').scrollTop = $('#aoLog').scrollHeight;
    }
    if (job.status === 'done') {
      stepDone(4);
      $('#aoLog').textContent += '\n✅ 方案已生成';
      setTimeout(() => {
        $('#analyzeOverlay').classList.add('hidden');
        renderResults(job.result);
        state.running = false;
      }, 800);
    } else if (job.status === 'error') {
      stepErr(4);
      $('#aoLog').textContent += '\n❌ ' + (job.error || '分析失败');
      state.running = false;
    } else {
      setTimeout(() => pollJob(jobId), 1500);
    }
  }).catch(() => setTimeout(() => pollJob(jobId), 2000));
}

function openQrModal() {
  const m = $('#qrModal');
  if (m) m.classList.remove('hidden');
}
function closeQrModal() {
  const m = $('#qrModal');
  if (m) m.classList.add('hidden');
}

function readForm() {
  const v = (id) => $(id).value.trim();
  const citySel = $('#f_city').value;
  const city = citySel === '__other' ? v('#f_city_other') : citySel;
  const businessHours = Array.from(document.querySelectorAll('.bh:checked')).map(c => c.value);
  return {
    deviceId: v('#f_deviceId'), scenarioName: v('#f_scenarioName'),
    location: v('#f_location'), city,
    businessHours,
    // 天气与人群画像不再由用户填写，交由 AI 分析（见 prompts.js）
    event: v('#f_event'), holiday: $('#f_holiday').checked,
    inventoryNotes: v('#f_inventoryNotes'), salesData: v('#f_salesData')
  };
}
const num = (id) => { const x = parseFloat($(id).value); return isNaN(x) ? undefined : x; };

async function runAnalyze(inputs) {
  if (state.running) return;
  state.running = true;
  $('#resultSection').classList.add('hidden');
  $('#progressSection').classList.remove('hidden');
  $('#progressLog').textContent = '正在提交分析任务…\n';
  window.scrollTo({ top: document.getElementById('progressSection').offsetTop - 80, behavior: 'smooth' });

  let jobId;
  try {
    const r = await fetch('/api/analyze', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs })
    }).then(r => r.json());
    jobId = r.jobId;
  } catch (e) {
    $('#progressLog').textContent += '\n❌ 提交失败：' + e.message;
    state.running = false; return;
  }
  poll(jobId);
}

function poll(jobId) {
  fetch('/api/job/' + jobId).then(r => r.json()).then(job => {
    if (job.progress && job.progress.length) {
      $('#progressLog').textContent = job.progress.join('\n');
      $('#progressLog').scrollTop = $('#progressLog').scrollHeight;
    }
    if (job.status === 'done') {
      $('#progressSection').classList.add('hidden');
      renderResults(job.result);
      state.running = false;
    } else if (job.status === 'error') {
      $('#progressLog').textContent += '\n❌ ' + (job.error || '分析失败');
      state.running = false;
    } else {
      state.timer = setTimeout(() => poll(jobId), 1500);
    }
  }).catch(e => {
    state.timer = setTimeout(() => poll(jobId), 2000);
  });
}

function renderResults(result) {
  const p = result.parsed || {};
  const sec = $('#resultSection');
  sec.innerHTML = '';
  sec.classList.remove('hidden');

  // 一句话决策
  const decision = p.decision || firstSentence(result.reportText) || '分析完成。';
  sec.appendChild(card(`<span class="label">AI 一句话决策</span>${md1(decision)}`, 'decision'));

  // 场景识别
  if (p.scene && (p.scene.markdown || (p.scene.addReduce && p.scene.addReduce.length))) {
    const s = p.scene;
    let html = '<h2>📍 AI 场景识别</h2>';
    if (s.addReduce && s.addReduce.length) {
      html += '<div class="addreduce">' + s.addReduce.map(a => {
        const cls = /增加|新增|大幅/.test(a.action) ? 'up' : (/减少|降低|缩减/.test(a.action) ? 'down' : 'flat');
        return `<div class="ar-row"><span class="ar-act ${cls}">${md1(a.action)}</span><span class="ar-cat">${md1(a.category)}</span><span class="ar-reason">${md1(a.reason)}</span></div>`;
      }).join('') + '</div>';
    }
    if (s.markdown) html += `<div class="report scene-md">${renderMarkdown(s.markdown)}</div>`;
    sec.appendChild(card(html, ''));
  }

  // 商品评分
  if (p.scores && p.scores.length) {
    const cards = p.scores.map(sc => {
      const c = scoreColor(sc.total);
      const subs = (sc.subs || []).map(x =>
        `<div class="sub-row"><span>${md1(x.label)}</span><span class="bar"><i style="width:${Math.min(100, x.value)}%"></i></span><span>${x.value}</span></div>`).join('');
      const sugCls = /增加/.test(sc.suggestion) ? 'up' : (/减少|不补/.test(sc.suggestion) ? 'down' : 'flat');
      return `<div class="score-card">
        <div class="score-head">
          <div class="ring" style="--p:${sc.total};--c:${c}"><span class="num">${sc.total}</span></div>
          <div class="score-meta"><div class="pname">${esc(sc.product)}</div><div class="sug ${sugCls}">${md1(sc.suggestion || '')}</div></div>
        </div>
        <div class="subs">${subs}</div>
      </div>`;
    }).join('');
    sec.appendChild(card(`<h2>📊 AI 商品评分（100 分制）</h2><div class="scores-grid">${cards}</div>`, ''));
  }

  // 关联销售
  if (p.basket && p.basket.length) {
    const rows = p.basket.map(b => `
      <div class="list-row"><span class="tag">${md1(b.pair || '')}</span>
      <span>关联强度 ${b.strength}%</span>
      <span class="up">连带 +${b.uplift}%</span>
      <span style="color:var(--muted)">${md1(b.crossSell || '—')}</span></div>
      ${b.logic ? `<div class="list-sub">${md1(b.logic)}</div>` : ''}`).join('');
    sec.appendChild(card(`<h2>🛒 商品关联销售（Market Basket）</h2>${rows}`, ''));
  }

  // AI Tomorrow
  if (p.tomorrow && p.tomorrow.length) {
    const rows = p.tomorrow.map(t => {
      const cls = /不补|减少|收缩|下架|降低/.test(t.action) ? 'down' : 'up';
      return `<div class="list-row"><span class="${cls}">${cls === 'down' ? '⛔' : '✅'} ${md1(t.action || '')} <b>${md1(t.product)}</b></span>
        ${t.qty ? `<span>${md1(t.qty)}</span>` : ''}
        ${t.predict ? `<span>明日预测 ${t.predict} 件</span>` : ''}
        ${t.vsYesterday ? `<span class="${cls}">${md1(t.vsYesterday)}</span>` : ''}</div>
        ${t.reason ? `<div class="list-sub">${md1(t.reason)}</div>` : ''}`.trim();
    }).join('');
    sec.appendChild(card(`<h2>🤖 AI Tomorrow · 明日选品建议</h2>${rows}`, ''));
  }

  // 完整报告
  if (result.reportText) {
    sec.appendChild(card(`<h2>📄 完整分析报告</h2><div class="report">${renderMarkdown(result.reportText)}</div>`, ''));
  }

  // 操作
  const act = document.createElement('div');
  act.className = 'actions';
  act.innerHTML = `
    <button class="primary" onclick="window.print()">🖨 导出 PDF</button>
    <button onclick="navigator.clipboard.writeText(location.href).then(()=>this.textContent='✅ 链接已复制')">🔗 复制分享链接</button>
    <button onclick="document.getElementById('analyzer').scrollIntoView({behavior:'smooth'})">↺ 重新分析</button>
    <span class="src">数据来源：InfiniSynapse · 任务 ${esc(result.taskId || '—')} · ${result.mock ? '演示模式' : '真实分析'}</span>`;
  if (result.real) {
    const meta = result.meta || {};
    const src = meta.source ? `${meta.source}${meta.transactions ? '（' + meta.transactions + ' 条真实交易）' : ''}` : '固定开源数据集';
    const how = result.mock
      ? '基于固定开源数据集的确定性分析（演示）'
      : '由 InfiniSynapse 预生成';
    const note = document.createElement('div');
    note.className = 'real-credit';
    note.innerHTML = `📁 本结果为<strong>已有数据模式</strong>：${how}并缓存，数据源 <code>${esc(src)}</code>。数据固定、结论可复现，约 10 秒即出。`;
    sec.appendChild(note);
  }
  if (result.ranAsUser) {
    const note = document.createElement('div');
    note.className = 'user-credit';
    note.innerHTML = `✅ 本次分析以 <b>${esc(result.userNickname || '你的')}</b> 的 InfiniSynapse 账号发起，已计入该账号的活跃使用量。`;
    sec.appendChild(note);
  }
  sec.appendChild(act);

  window.scrollTo({ top: sec.offsetTop - 80, behavior: 'smooth' });
}

// 「已有数据」模式：数据为固定开源数据集，结论已预生成并缓存。
// 点击后展示约 10 秒加载动画（数据固定、结论可复现），体验快且稳定。
async function runRealAnalysis(sc) {
  if (state.running) return;
  state.running = true;
  $('#resultSection').classList.add('hidden');
  showProgress('📁 已有数据 · 加载固定数据集…');
  const bar = $('#progressBar');
  const meta = sc.meta || {};
  const srcName = (meta.source || 'vending_machine_sales.csv');
  const tx = meta.transactions ? `（${meta.transactions} 条真实交易）` : '';
  const steps = [
    `📁 已锁定固定数据集：${srcName}${tx}`,
    `🔍 正在按「${sc.location}」场景匹配商品矩阵…`,
    '🤖 调取已生成的 AI 选品结论（数据固定，结论可复现）…',
    '✅ 即将呈现'
  ];
  // 同时拉取预生成结果（缓存命中时瞬时返回）
  const fetchP = fetch('/api/real-analysis/' + encodeURIComponent(sc.id))
    .then(r => r.json()).catch(() => null);
  await animateProgress(bar, steps, 10000);
  const data = await fetchP;
  $('#progressSection').classList.add('hidden');
  if (data && data.result) {
    renderResults(data.result);
  } else {
    $('#progressLog').textContent += '\n❌ 加载失败，请重试或切换到「模拟数据」。';
    state.running = false;
  }
  state.running = false;
}

function showProgress(title) {
  $('#progressTitle').textContent = title || 'AI 正在分析…';
  $('#progressLog').textContent = '';
  $('#progressBar').style.width = '0%';
  $('#progressSection').classList.remove('hidden');
  window.scrollTo({ top: document.getElementById('progressSection').offsetTop - 80, behavior: 'smooth' });
}

function animateProgress(bar, steps, duration) {
  return new Promise(resolve => {
    const start = Date.now();
    const log = $('#progressLog');
    let si = 0;
    log.textContent = steps[0] + '\n';
    const tick = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / duration);
      bar.style.width = (p * 100).toFixed(1) + '%';
      const idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
      if (idx !== si) { si = idx; log.textContent += steps[idx] + '\n'; log.scrollTop = log.scrollHeight; }
      if (p >= 1) { clearInterval(tick); resolve(); }
    }, 100);
  });
}

/* ---------- 工具 ---------- */
function card(inner, extra) { const d = document.createElement('div'); d.className = 'card ' + (extra || ''); d.innerHTML = inner; return d; }
function scoreColor(t) { return t >= 85 ? 'var(--good)' : t >= 70 ? 'var(--accent)' : t >= 58 ? 'var(--warn)' : 'var(--bad)'; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
function firstSentence(md) { const m = (md || '').replace(/^#.*$/gm, '').match(/[^\n。！？]{6,}[。！？]/); return m ? m[0] : ''; }

// 用 marked 渲染完整 Markdown（带 DOMPurify 安全过滤）；库未加载时降级为纯文本转义
function renderMarkdown(md) {
  if (!md) return '';
  // 隐藏机器可读 JSON 块（已用结构化卡片展示），避免大段原始 JSON 挤占版面
  const src = String(md).replace(/```json[\s\S]*?```/g, '');
  if (typeof marked !== 'undefined') {
    marked.setOptions({ gfm: true, breaks: true });
    let html = marked.parse(src);
    if (typeof DOMPurify !== 'undefined') html = DOMPurify.sanitize(html);
    return html;
  }
  return '<div class="md-fallback">' + esc(src) + '</div>';
}
// 行内 Markdown（用于一句话决策、建议、理由等短文本，避免 **加粗** 显示成字面星号）
function md1(md) {
  if (!md) return '';
  const src = String(md).replace(/```json[\s\S]*?```/g, '');
  if (typeof marked !== 'undefined') {
    let html = marked.parseInline(src);
    if (typeof DOMPurify !== 'undefined') html = DOMPurify.sanitize(html);
    return html;
  }
  return esc(src);
}
