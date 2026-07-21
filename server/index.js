// server/index.js
// 零依赖后端：Node 内置 http 服务，托管前端 + 提供分析 API。
// API Key 只在服务端，前端只连本服务；未配置 Key 时自动走演示模式。
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runAnalysis } from './infini.js';
import { buildPrompt } from './prompts.js';
import { mockAnalysis } from './mock.js';
import { extractStructured, extractDecision } from './parse.js';
import { scenarios, getScenario } from './scenarios.js';
import { sso } from './sso.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');
const PORT = process.env.PORT || 3000;

// —— 零依赖加载 .env ——
function loadEnv() {
  const p = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (!(k in process.env)) process.env[k] = v;
  }
}
loadEnv();

const API_KEY = process.env.INFINI_API_KEY || '';
const INFINI_SERVER = process.env.INFINI_SERVER || 'https://app.infinisynapse.cn';

const jobs = new Map();
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.png': 'image/png', '.webp': 'image/webp'
};

function sendJSON(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let d = '';
    req.on('data', c => { d += c; if (d.length > 2e6) req.destroy(); });
    req.on('end', () => { try { resolve(d ? JSON.parse(d) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}
function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(PUBLIC, path.normalize(urlPath));
  if (!filePath.startsWith(PUBLIC)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not Found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

function handleAnalyze(req, res) {
  readBody(req).then(body => {
    const inputs = body.inputs || body;
    const session = sso.getSession(req);
    const userApiKey = session && session.apiKey;   // 登录用户：用其专属 key（计入其账号）
    const apiKey = userApiKey || API_KEY;            // 匿名访客：回落到应用主 key
    const ranAsUser = !!(userApiKey && API_KEY);     // 仅当用户用自己的 key 且应用已配置主 key 时才算「计入用户账号」
    const jobId = 'job_' + Math.random().toString(36).slice(2, 10);
    const job = { id: jobId, status: 'running', progress: [], result: null, error: null, createdAt: Date.now() };
    jobs.set(jobId, job);

    const prompt = buildPrompt(inputs);
    job.progress.push('已构建分析任务，准备提交 InfiniSynapse…');
    if (userApiKey) job.progress.push('🔑 以你的 InfiniSynapse 账号发起分析（计入你的活跃使用量）');

    (async () => {
      try {
        let out;
        if (apiKey) {
          out = await runAnalysis({
            apiKey, server: INFINI_SERVER, prompt,
            onProgress: (t) => { job.progress.push(t); if (job.progress.length > 300) job.progress.shift(); },
            onTaskId: (tid) => job.progress.push(`任务已创建：taskId=${tid}`)
          });
        } else {
          out = mockAnalysis(inputs);
          job.progress.push('[演示模式] 未配置 INFINI_API_KEY，使用结构一致的模拟分析。');
        }
        const parsed = extractStructured(out.reportText) || {};
        if (!parsed.decision && !parsed.scores) parsed.decision = extractDecision(out.reportText);
        job.result = {
          taskId: out.taskId, reportText: out.reportText, parsed,
          workspaceFiles: out.workspaceFiles || [],
          mock: !apiKey, ranAsUser, userNickname: session && session.user && session.user.nickname
        };
        job.status = 'done';
        job.progress.push('分析完成 ✓');
      } catch (e) {
        job.status = 'error';
        job.error = String(e && e.message ? e.message : e);
        job.progress.push('分析失败：' + job.error);
      }
    })();

    sendJSON(res, 200, { jobId });
  }).catch(() => sendJSON(res, 400, { error: '请求体解析失败' }));
}

function handleJob(req, res, id) {
  const job = jobs.get(id);
  if (!job) return sendJSON(res, 404, { error: '任务不存在' });
  sendJSON(res, 200, { id: job.id, status: job.status, progress: job.progress, result: job.result, error: job.error });
}

// —— InfiniSynapse Partner SSO 路由 ——
function handleSsoLogin(req, res) {
  if (!sso.isEnabled()) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<h2>SSO 未启用</h2><p>服务端未配置 INFINI_CLIENT_ID / INFINI_CLIENT_SECRET。请在 .env 中填入后在「设置 → 第三方接入」获取。</p><p><a href="/">返回</a></p>');
  }
  const state = sso.genState();
  const returnUrl = sso.callbackUrl();
  sso.setStateCookie(res, state);
  sso.createSession(returnUrl, state).then(data => {
    res.writeHead(302, { 'Location': data.entryUrl, 'Set-Cookie': [`oauth_state=${state}; Max-Age=600; Path=/; HttpOnly; SameSite=Lax`] });
    res.end();
  }).catch(e => {
    res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h2>创建登录会话失败</h2><p>${String(e.message || e)}</p><p>本次发起的 returnUrl：<br><code>${returnUrl}</code></p><p>请确认 InfiniSynapse「第三方接入」白名单里已加入该 returnUrl 的<strong>域名部分</strong>（不含 https:// 与路径）。</p><p><a href="/">返回</a></p>`);
  });
}

function handleSsoCallback(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = sso.getStateCookie(req);
  if (!code || !state || state !== savedState) {
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<h2>登录校验失败</h2><p>state 不匹配或缺少 code，可能是伪造回调或已过期。请<a href="/">返回重试</a>。</p>');
  }
  sso.exchangeToken(code).then(data => {
    const user = data.user || {};
    const sid = sso.createSessionForUser({ id: user.id, nickname: user.nickname, email: user.email, avatar: user.avatar }, data.apiKey || '');
    res.writeHead(302, {
      'Location': '/?login=1',
      'Set-Cookie': [
        `sid=${sid}; Max-Age=604800; ${'Path=/; HttpOnly; SameSite=Lax'}`,
        `oauth_state=; Max-Age=0; Path=/; HttpOnly`
      ]
    });
    res.end();
  }).catch(e => {
    res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h2>换取用户信息失败</h2><p>${String(e.message || e)}</p><p><a href="/">返回重试</a></p>`);
  });
}

function handleSsoLogout(req, res) {
  sso.destroySession(req);
  res.writeHead(302, {
    'Location': '/',
    'Set-Cookie': [`sid=; Max-Age=0; Path=/; HttpOnly`]
  });
  res.end();
}

function handleMe(req, res) {
  const session = sso.getSession(req);
  if (!session) return sendJSON(res, 200, { ssoEnabled: sso.isEnabled(), loggedIn: false });
  const u = session.user || {};
  sendJSON(res, 200, {
    ssoEnabled: sso.isEnabled(), loggedIn: true,
    user: { nickname: u.nickname, email: u.email, avatar: u.avatar },
    hasApiKey: !!session.apiKey
  });
}

const server = http.createServer((req, res) => {
  const u = req.url.split('?')[0];
  if (req.method === 'GET' && u === '/api/health') return sendJSON(res, 200, { ok: true, configured: !!API_KEY, mock: !API_KEY, server: INFINI_SERVER, sso: sso.isEnabled() });
  if (req.method === 'GET' && u === '/api/scenarios') return sendJSON(res, 200, { scenarios });
  if (req.method === 'GET' && u.startsWith('/api/scenario/')) {
    const s = getScenario(u.slice('/api/scenario/'.length));
    return s ? sendJSON(res, 200, s) : sendJSON(res, 404, { error: '场景不存在' });
  }
  if (req.method === 'GET' && u === '/api/me') return handleMe(req, res);
  if (req.method === 'POST' && u === '/api/analyze') return handleAnalyze(req, res);
  if (req.method === 'GET' && u.startsWith('/api/job/')) return handleJob(req, res, u.slice('/api/job/'.length));
  // SSO 路由
  if (req.method === 'GET' && u === '/auth/infini/login') return handleSsoLogin(req, res);
  if (req.method === 'GET' && u === '/auth/infini/callback') return handleSsoCallback(req, res);
  if (req.method === 'GET' && u === '/auth/infini/logout') return handleSsoLogout(req, res);
  if (req.method === 'GET') return serveStatic(req, res);
  res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Method Not Allowed');
});

server.listen(PORT, () => {
  console.log(`AI 选品大脑 已启动: http://localhost:${PORT}`);
  console.log(`  分析接口: ${API_KEY ? '真实 InfiniSynapse' : '演示模式'}`);
  console.log(`  Partner SSO: ${sso.isEnabled() ? '已启用 (' + sso.getClientId() + ')' : '未配置（匿名访客回落主 key）'}`);
  console.log(`  回调地址: ${sso.callbackUrl()}`);
});
