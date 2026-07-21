// 强制重生成「已有数据」全部缓存：真实 API 优先，超时/失败自动回退确定性模型
import { regenerateAll } from './server/realdata.js';
import { getRealScenarios } from './server/realdata.js';

const ids = getRealScenarios().map(s => s.id);
console.log('[regen] 场景数:', ids.length, ids.join(', '));
const ok = await regenerateAll();
console.log('[regen] 完成，成功:', ok, '/', ids.length);
