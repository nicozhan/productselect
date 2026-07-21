// public/app.js
const $ = (s) => document.querySelector(s);
const state = { scenarios: [], running: false, timer: null };

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

  // Tab
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('tab-quick').classList.toggle('hidden', t.dataset.tab !== 'quick');
    document.getElementById('tab-custom').classList.toggle('hidden', t.dataset.tab !== 'custom');
  }));

  $('#customRun').addEventListener('click', () => runAnalyze(readForm()));

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
  state.scenarios.forEach(s => {
    const card = document.createElement('div');
    card.className = 'scenario-card';
    card.innerHTML = `
      <div class="icon">${s.icon || '📦'}</div>
      <div class="name">${esc(s.name)}</div>
      <div class="tag">${esc(s.tagline || '')}</div>
      <div class="loc">📍 ${esc(s.location || '')}</div>
      <div class="run">⚡ 一键生成选品建议 →</div>`;
    card.addEventListener('click', () => runAnalyze(s));
    grid.appendChild(card);
  });
}

function readForm() {
  const v = (id) => $(id).value.trim();
  return {
    deviceId: v('#f_deviceId'), scenarioName: v('#f_scenarioName'),
    location: v('#f_location'), city: v('#f_city'),
    weather: { temp: num('#f_temp'), rain: num('#f_rain'), humidity: num('#f_humidity') },
    event: v('#f_event'), holiday: $('#f_holiday').checked,
    demographics: { genderRatio: v('#f_genderRatio'), ageRange: v('#f_ageRange') },
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
  sec.appendChild(card(`<span class="label">AI 一句话决策</span>${esc(decision)}`, 'decision'));

  // 场景识别
  if (p.scene && (p.scene.markdown || (p.scene.addReduce && p.scene.addReduce.length))) {
    const s = p.scene;
    let html = '<h2>📍 AI 场景识别</h2>';
    if (s.addReduce && s.addReduce.length) {
      html += '<div class="addreduce">' + s.addReduce.map(a => {
        const cls = /增加|新增|大幅/.test(a.action) ? 'up' : (/减少|降低|缩减/.test(a.action) ? 'down' : 'flat');
        return `<div class="ar-row"><span class="ar-act ${cls}">${esc(a.action)}</span><span class="ar-cat">${esc(a.category)}</span><span class="ar-reason">${esc(a.reason)}</span></div>`;
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
        `<div class="sub-row"><span>${esc(x.label)}</span><span class="bar"><i style="width:${Math.min(100, x.value)}%"></i></span><span>${x.value}</span></div>`).join('');
      const sugCls = /增加/.test(sc.suggestion) ? 'up' : (/减少|不补/.test(sc.suggestion) ? 'down' : 'flat');
      return `<div class="score-card">
        <div class="score-head">
          <div class="ring" style="--p:${sc.total};--c:${c}"><span class="num">${sc.total}</span></div>
          <div class="score-meta"><div class="pname">${esc(sc.product)}</div><div class="sug ${sugCls}">${esc(sc.suggestion || '')}</div></div>
        </div>
        <div class="subs">${subs}</div>
      </div>`;
    }).join('');
    sec.appendChild(card(`<h2>📊 AI 商品评分（100 分制）</h2><div class="scores-grid">${cards}</div>`, ''));
  }

  // 关联销售
  if (p.basket && p.basket.length) {
    const rows = p.basket.map(b => `
      <div class="list-row"><span class="tag">${esc(b.pair || '')}</span>
      <span>关联强度 ${b.strength}%</span>
      <span class="up">连带 +${b.uplift}%</span>
      <span style="color:var(--muted)">${esc(b.crossSell || '—')}</span></div>
      ${b.logic ? `<div class="list-sub">${esc(b.logic)}</div>` : ''}`).join('');
    sec.appendChild(card(`<h2>🛒 商品关联销售（Market Basket）</h2>${rows}`, ''));
  }

  // AI Tomorrow
  if (p.tomorrow && p.tomorrow.length) {
    const rows = p.tomorrow.map(t => {
      const cls = /不补|减少|收缩|下架|降低/.test(t.action) ? 'down' : 'up';
      return `<div class="list-row"><span class="${cls}">${cls === 'down' ? '⛔' : '✅'} ${esc(t.action || '')} <b>${esc(t.product)}</b></span>
        ${t.qty ? `<span>${esc(t.qty)}</span>` : ''}
        ${t.predict ? `<span>明日预测 ${t.predict} 件</span>` : ''}
        ${t.vsYesterday ? `<span class="${cls}">${esc(t.vsYesterday)}</span>` : ''}</div>
        ${t.reason ? `<div class="list-sub">${esc(t.reason)}</div>` : ''}`.trim();
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
  if (result.ranAsUser) {
    const note = document.createElement('div');
    note.className = 'user-credit';
    note.innerHTML = `✅ 本次分析以 <b>${esc(result.userNickname || '你的')}</b> 的 InfiniSynapse 账号发起，已计入该账号的活跃使用量。`;
    sec.appendChild(note);
  }
  sec.appendChild(act);

  window.scrollTo({ top: sec.offsetTop - 80, behavior: 'smooth' });
}

/* ---------- 工具 ---------- */
function card(inner, extra) { const d = document.createElement('div'); d.className = 'card ' + (extra || ''); d.innerHTML = inner; return d; }
function scoreColor(t) { return t >= 85 ? 'var(--good)' : t >= 70 ? 'var(--accent)' : t >= 58 ? 'var(--warn)' : 'var(--bad)'; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
function firstSentence(md) { const m = (md || '').replace(/^#.*$/gm, '').match(/[^\n。！？]{6,}[。！？]/); return m ? m[0] : ''; }

function renderMarkdown(md) {
  if (!md) return '';
  // 隐藏机器可读 JSON 块（已用卡片展示）
  md = md.replace(/```json[\s\S]*?```/g, '').replace(/```([\s\S]*?)```/g, (m) => `<pre><code>${esc(m.replace(/```/g, ''))}</code></pre>`);
  const lines = md.split('\n');
  let html = '', i = 0, inList = null;
  const close = () => { if (inList) { html += `</${inList}>`; inList = null; } };
  while (i < lines.length) {
    const line = lines[i];
    if (/^###\s+/.test(line)) { close(); html += `<h3>${inline(line.replace(/^###\s+/, ''))}</h3>`; i++; continue; }
    if (/^##\s+/.test(line)) { close(); html += `<h2>${inline(line.replace(/^##\s+/, ''))}</h2>`; i++; continue; }
    if (/^#\s+/.test(line)) { close(); html += `<h1>${inline(line.replace(/^#\s+/, ''))}</h1>`; i++; continue; }
    if (/^\s*\|.*\|\s*$/.test(line)) {
      close();
      const rows = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { rows.push(lines[i]); i++; }
      html += renderTable(rows); continue;
    }
    if (/^>\s?/.test(line)) { close(); html += `<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`; i++; continue; }
    if (/^[-*]\s+/.test(line)) { if (inList !== 'ul') { close(); html += '<ul>'; inList = 'ul'; } html += `<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`; i++; continue; }
    if (/^\d+\.\s+/.test(line)) { if (inList !== 'ol') { close(); html += '<ol>'; inList = 'ol'; } html += `<li>${inline(line.replace(/^\d+\.\s+/, ''))}</li>`; i++; continue; }
    if (line.trim() === '') { close(); i++; continue; }
    close(); html += `<p>${inline(line)}</p>`; i++;
  }
  close();
  return html;
}
function inline(s) {
  s = esc(s);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return s;
}
function renderTable(rows) {
  const cells = (r) => r.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
  const head = cells(rows[0]);
  let h = '<table><thead><tr>' + head.map(c => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>';
  for (let k = 2; k < rows.length; k++) h += '<tr>' + cells(rows[k]).map(x => `<td>${inline(x)}</td>`).join('') + '</tr>';
  return h + '</tbody></table>';
}
