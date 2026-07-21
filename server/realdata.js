// server/realdata.js
// 「已有数据」模式：基于固定的开源数据集 vending_machine_sales.csv（已聚合到
// server/data/real_scenarios.json）派生的真实场景。数据固定 → 结果可预生成并缓存，
// 用户点击后只需约 10 秒 loading 即可展示，无需等待长链路分析。
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runAnalysis } from './infini.js';
import { buildPrompt } from './prompts.js';
import { mockAnalysis } from './mock.js';
import { extractStructured, extractDecision } from './parse.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data', 'real_scenarios.json');
const CACHE_DIR = path.join(__dirname, 'cache');

let scenarios = [];
try {
  scenarios = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')).scenarios || [];
} catch (e) {
  console.error('[realdata] 读取 real_scenarios.json 失败：', e.message);
}

export function getRealScenarios() {
  return scenarios;
}
export function getRealScenario(id) {
  return scenarios.find(s => s.id === id) || null;
}

function cachePath(id) {
  return path.join(CACHE_DIR, 'real-' + id + '.json');
}

export function getRealResult(id) {
  try {
    const p = cachePath(id);
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

// 对单个场景跑一次分析并写缓存：优先真实 InfiniSynapse API（带超时上限），
// 任何失败（网络/超时/限流）自动回退 mock，保证一定有结果且服务不卡死。
async function generateOne(sc) {
  const apiKey = process.env.INFINI_API_KEY || '';
  const server = process.env.INFINI_SERVER || 'https://app.infinisynapse.cn';
  const inputs = {
    id: sc.id.replace(/-real$/, ''),
    deviceId: sc.deviceId,
    scenarioName: sc.name,
    location: sc.location,
    city: sc.city,
    weather: sc.weather,
    event: sc.event,
    holiday: sc.holiday,
    demographics: sc.demographics,
    inventoryNotes: sc.inventoryNotes,
    salesData: sc.salesData
  };
  let out, mock = false;
  if (apiKey) {
    try {
      const prompt = buildPrompt(inputs);
      out = await runAnalysis({
        apiKey, server, prompt,
        timeoutMs: 150000,            // 单场景上限 2.5 分钟，超时即回退 mock
        onProgress: () => {}, onTaskId: () => {}
      });
      mock = false;
    } catch (e) {
      console.warn('[realdata] 真实分析失败，回退 mock：', sc.id, e.message);
      out = mockAnalysis(inputs, { realData: true });
      mock = true;
    }
  } else {
    out = mockAnalysis(inputs, { realData: true });
    mock = true;
  }
  const parsed = extractStructured(out.reportText) || {};
  if (!parsed.decision && !parsed.scores) parsed.decision = extractDecision(out.reportText);
  const result = {
    taskId: out.taskId,
    reportText: out.reportText,
    parsed,
    workspaceFiles: out.workspaceFiles || [],
    mock,
    ranAsUser: false,
    real: true,
    meta: sc.meta || null
  };
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cachePath(sc.id), JSON.stringify({ result, generatedAt: Date.now() }, null, 2), 'utf8');
  return result;
}

// 确保全部已生成缓存（缺失才补）。返回已生成数量。
export async function ensureRealCache() {
  let done = 0;
  for (const sc of scenarios) {
    if (getRealResult(sc.id)) { done++; continue; }
    try {
      await generateOne(sc);
      done++;
      console.log('[realdata] 已生成缓存：', sc.id);
    } catch (e) {
      console.error('[realdata] 生成失败：', sc.id, e.message);
    }
  }
  return done;
}

// 强制重生成全部缓存（真实 API 优先 + 超时回退 mock）。用于「已有数据」结果刷新/上线前校准。
export async function regenerateAll() {
  let ok = 0;
  for (const sc of scenarios) {
    try {
      await generateOne(sc);
      ok++;
      console.log('[realdata] 已重生成：', sc.id);
    } catch (e) {
      console.error('[realdata] 重生成失败：', sc.id, e.message);
    }
  }
  return ok;
}

// 按需生成单个（供接口在缓存缺失时兜底）
export async function ensureOne(id) {
  const sc = getRealScenario(id);
  if (!sc) return null;
  if (getRealResult(id)) return getRealResult(id);
  return generateOne(sc);
}
