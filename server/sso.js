// server/sso.js
// InfiniSynapse Partner SSO 客户端 + 零依赖会话管理。
// 参考：InfiniSynapse Partner SSO Integration Guide
// 关键：clientSecret 与用户 apiKey 都只在服务端，绝不进前端。
//
// 注意：本项目用零依赖方式在 index.js 里加载 .env，而 ES module 的 import 会在
// index.js 顶层语句之前执行，因此这里**不能在模块加载时**读取 process.env，
// 必须改为「惰性读取」（调用时才读），否则拿不到 .env 里的 INFINI_CLIENT_SECRET。
import crypto from 'crypto';

function env(name, dflt = '') { return process.env[name] || dflt; }

function getSsoApi() { return (env('INFINI_SSO_API') || 'https://api.infinisynapse.cn/api').replace(/\/$/, ''); }
function getClientId() { return env('INFINI_CLIENT_ID'); }
function getClientSecret() { return env('INFINI_CLIENT_SECRET'); }
function getPort() { return env('PORT') || '3000'; }
function getSelfOrigin() { return (env('SELF_ORIGIN') || `http://127.0.0.1:${getPort()}`).replace(/\/$/, ''); }
function ssoEnabled() { return !!(getClientId() && getClientSecret()); }

// 内存会话表：sid -> { user, apiKey, createdAt }
// 说明：零依赖最小实现；多实例部署请用 Redis 等共享存储。
const sessions = new Map();
const SESSION_TTL = 1000 * 60 * 60 * 24 * 7; // 7 天

function genId(n = 24) { return crypto.randomBytes(n).toString('hex'); }
function genState() { return crypto.randomBytes(16).toString('hex'); }

function ssoHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Client-Id': getClientId(),
    'X-Client-Secret': getClientSecret(),
  };
}

// ① 创建登录会话，返回 { sessionId, entryUrl, expiresIn }
async function createSession(returnUrl, state) {
  const resp = await fetch(`${getSsoApi()}/auth/partner/sessions`, {
    method: 'POST',
    headers: ssoHeaders(),
    body: JSON.stringify({ returnUrl, state }),
  });
  const json = await resp.json();
  if (!resp.ok || json.code !== 200) throw new Error(json.message || `createSession 失败 (${resp.status})`);
  return json.data;
}

// ④ 用一次性 code 换取用户资料；withApiKey:true 同时签发用户专属 API Key
async function exchangeToken(code) {
  const resp = await fetch(`${getSsoApi()}/auth/partner/token`, {
    method: 'POST',
    headers: ssoHeaders(),
    body: JSON.stringify({ code, grant_type: 'authorization_code', withApiKey: true }),
  });
  const json = await resp.json();
  if (!resp.ok || json.code !== 200) throw new Error(json.message || `exchangeToken 失败 (${resp.status})`);
  return json.data; // { user:{id,nickname,email,avatar,...}, apiKey, sessionId, ... }
}

// ——— Cookie / 会话辅助 ———
function parseCookies(req) {
  const h = req.headers.cookie;
  const out = {};
  if (!h) return out;
  for (const part of h.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function cookieBase() {
  const secure = getSelfOrigin().startsWith('https') ? '; Secure' : '';
  return `Path=/; HttpOnly; SameSite=Lax${secure}`;
}

// 读取当前请求绑定的会话（若有）
function getSession(req) {
  const sid = parseCookies(req).sid;
  if (!sid) return null;
  const s = sessions.get(sid);
  if (!s) return null;
  if (Date.now() - s.createdAt > SESSION_TTL) { sessions.delete(sid); return null; }
  return s;
}

function createSessionForUser(user, apiKey) {
  const sid = genId();
  sessions.set(sid, { user, apiKey, createdAt: Date.now() });
  return sid;
}

function destroySession(req) {
  const sid = parseCookies(req).sid;
  if (sid) sessions.delete(sid);
}

// 把会话 id 写入响应 Cookie
function setSessionCookie(res, sid) {
  res.setHeader('Set-Cookie', [`sid=${sid}; Max-Age=604800; ${cookieBase()}`]);
}
function clearCookie(res, name) {
  res.setHeader('Set-Cookie', [`${name}=; Max-Age=0; Path=/; HttpOnly`]);
}

// CSRF state：登录时种下，回调时校验
function setStateCookie(res, state) {
  res.setHeader('Set-Cookie', [`oauth_state=${state}; Max-Age=600; Path=/; HttpOnly; SameSite=Lax`]);
}
function getStateCookie(req) {
  return parseCookies(req).oauth_state;
}

export const sso = {
  isEnabled: ssoEnabled,
  getClientId,
  getSelfOrigin,
  callbackUrl: () => `${getSelfOrigin()}/auth/infini/callback`,
  createSession, exchangeToken,
  getSession, createSessionForUser, destroySession,
  setSessionCookie, clearCookie, setStateCookie, getStateCookie,
  genState,
};
