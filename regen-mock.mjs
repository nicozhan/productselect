// 秒级重生成「已有数据」缓存：直接用确定性选品模型（realData 标签），不依赖慢/不稳定的真实接口。
// 用于上线前校准标签、或真实 API 不可用时的可靠兜底。
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRealScenarios } from './server/realdata.js';
import { mockAnalysis } from './server/mock.js';
import { extractStructured, extractDecision } from './server/parse.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, 'server', 'cache');

const scenarios = getRealScenarios();
let ok = 0;
for (const sc of scenarios) {
  const inputs = {
    id: sc.id.replace(/-real$/, ''), deviceId: sc.deviceId, scenarioName: sc.name,
    location: sc.location, city: sc.city, weather: sc.weather, event: sc.event,
    holiday: sc.holiday, demographics: sc.demographics, inventoryNotes: sc.inventoryNotes,
    salesData: sc.salesData
  };
  const out = mockAnalysis(inputs, { realData: true });
  const parsed = extractStructured(out.reportText) || {};
  if (!parsed.decision && !parsed.scores) parsed.decision = extractDecision(out.reportText);
  const result = { taskId: out.taskId, reportText: out.reportText, parsed, workspaceFiles: [], mock: true, ranAsUser: false, real: true, meta: sc.meta || null };
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(path.join(CACHE_DIR, 'real-' + sc.id + '.json'), JSON.stringify({ result, generatedAt: Date.now() }, null, 2), 'utf8');
  console.log('[regen-mock] 已写入:', sc.id, 'reportLen:', out.reportText.length);
  ok++;
}
console.log('[regen-mock] 完成，成功:', ok, '/', scenarios.length);
