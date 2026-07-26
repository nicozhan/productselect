// server/infini.js
// InfiniSynapse Server API 客户端：先连 SSE 再发 newTask，解析流式消息，
// 任务完成后读取工作区产物（优先取根目录分析报告 .md 的干净内容）。
// API Key 只在服务端使用。
import crypto from 'crypto';

const DEFAULT_SERVER = 'https://app.infinisynapse.cn';
const MAX_DURATION_MS = 300000; // 长任务上限 5 分钟

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/**
 * 根据环境变量构建「分析模型」的 apiConfiguration。
 * 默认使用 infinisynapse 托管的 deepseek-v4-flash（成本远低于默认大模型）。
 * 若想自带 DeepSeek key（最便宜），设 INFINI_MODEL_PROVIDER=openai 并填 INFINI_MODEL_API_KEY。
 * 文档：模型只能在 POST /api/ai/settings 中设置（newTask 无法指定）。
 */
export function buildModelApiConfig() {
  const provider = (process.env.INFINI_MODEL_PROVIDER || 'infinisynapse').toLowerCase();
  const modelId = process.env.INFINI_MODEL_ID || 'deepseek-v4-flash';
  if (provider === 'openai') {
    return {
      apiProvider: 'openai',
      openAiBaseUrl: process.env.INFINI_MODEL_BASE_URL || 'https://api.deepseek.com/v1',
      openAiApiKey: process.env.INFINI_MODEL_API_KEY || '',
      openAiModelId: modelId
    };
  }
  if (provider === 'anthropic') {
    return { apiProvider: 'anthropic', anthropicModelId: modelId };
  }
  return { apiProvider: 'infinisynapse', infinisynapseModelId: modelId };
}

// 把当前模型配置写入账号默认（POST /api/ai/settings）。返回提示文案或 null。
async function applyModelConfig(server, auth, apiConfiguration) {
  try {
    const r = await fetch(`${server}/api/ai/settings`, {
      method: 'POST',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiConfiguration })
    });
    if (!r.ok) return '⚠️ 模型切换设置失败（' + r.status + '），沿用账号默认';
    const name = apiConfiguration.infinitisynapseModelId
      || apiConfiguration.openAiModelId
      || apiConfiguration.anthropicModelId
      || JSON.stringify(apiConfiguration);
    return '⚙️ 已切换分析模型：' + name;
  } catch (e) {
    return '⚠️ 模型切换设置异常，沿用账号默认';
  }
}

// 解析单个 SSE 块（两个换行分隔）
function parseSSEBlock(block) {
  let event = null;
  let dataStr = '';
  for (const line of block.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) dataStr += line.slice(5).trim();
  }
  if (!dataStr) return null;
  let data;
  try { data = JSON.parse(dataStr); } catch { return { event, raw: dataStr }; }
  return { event, data };
}

// 从流式文本增量里抽取工具步骤摘要（best-effort）
function extractToolBrief(text) {
  const m = text.match(/"brief"\s*:\s*"([^"]{1,60})"/) || text.match(/"tool"\s*:\s*"([^"]{1,40})"/);
  return m ? m[1] : null;
}

/**
 * 发起一次 InfiniSynapse 分析任务并等待完成，返回结构化结果。
 * @returns {Promise<{taskId:string|null, reportText:string, workspaceFiles:Array, sayText:string}>}
 */
export async function runAnalysis({ apiKey, server = DEFAULT_SERVER, prompt, onProgress, onTaskId, apiConfiguration = null, timeoutMs = MAX_DURATION_MS }) {
  const connId = crypto.randomUUID();
  const auth = { Authorization: `Bearer ${apiKey}` };
  let taskId = null;
  let sayText = '';        // 累计的最终助手消息（覆盖式）
  let finished = false;
  let finishResolve;
  const donePromise = new Promise(r => { finishResolve = r; });
  const finish = () => { if (!finished) { finished = true; finishResolve(); } };

  // 1) 先建立 SSE 长连接（顺序不能反）
  const sseUrl = `${server}/api/ai/events?connId=${connId}`;
  const sseResp = await fetch(sseUrl, { headers: { ...auth, Accept: 'text/event-stream' } });
  if (!sseResp.ok) {
    const txt = await sseResp.text().catch(() => '');
    throw new Error(`SSE 连接失败 (${sseResp.status}): ${txt.slice(0, 200)}`);
  }
  const reader = sseResp.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';

  // 后台读取 SSE 流
  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf('\n\n')) >= 0) {
          const block = buf.slice(0, idx);
          buf = buf.slice(idx + 2);
          const ev = parseSSEBlock(block);
          if (!ev || !ev.data) continue;
          const data = ev.data;
          if (data.taskId && !taskId) { taskId = data.taskId; onTaskId && onTaskId(taskId); }
          const msg = data.message;
          const msgText = msg && typeof msg.text === 'string' ? msg.text : '';

          // message.partial 是「累计全文」（覆盖式）；message.add 是最终整段
          if (ev.event === 'message.partial') {
            if (msgText) {
              if (msgText.length > sayText.length && msgText.startsWith(sayText)) {
                const delta = msgText.slice(sayText.length); // 仅取新增尾部
                sayText = msgText;
                const brief = extractToolBrief(delta);
                if (brief) onProgress && onProgress('🔧 ' + brief);
              } else {
                sayText = msgText; // 非累计（罕见），直接覆盖
              }
            }
          } else if (ev.event === 'message.add') {
            if (msgText) sayText = msgText;
          }

          // 完成信号：message.say / message.ask 取值为 completion_result
          if (msg && (msg.say === 'completion_result' || msg.ask === 'completion_result')) finish();
          // 错误通知
          if (data.type === 'notification' && data.notification && data.notification.type === 'error') {
            const em = data.notification.message || '任务执行出错';
            sayText += `\n\n[任务错误] ${em}`;
            finish();
          }
        }
      }
    } catch (e) { /* 流异常也尝试收尾 */ }
    finish(); // SSE 关闭即视为任务结束
  })();

  // 2) 再发 newTask（如有指定模型，先在账号默认里切换，确保本次任务用该模型）
  if (apiConfiguration) {
    const tip = await applyModelConfig(server, auth, apiConfiguration);
    if (tip) onProgress && onProgress(tip);
  }
  onProgress && onProgress('🧠 已提交分析任务，Agent 启动中…');
  const hb = setInterval(() => { onProgress && onProgress('⏳ Agent 正在执行多步分析（联网检索 / 数据计算 / 报告生成）…'); }, 18000);
  const msgResp = await fetch(`${server}/api/ai/message`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'newTask',
      text: prompt,
      connId,
      chatSettings: { mode: 'act' },
      autoApprovalSettings: { enabled: true, autoAccept: true }
    })
  });
  if (!msgResp.ok) {
    const txt = await msgResp.text().catch(() => '');
    throw new Error(`新建任务失败 (${msgResp.status}): ${txt.slice(0, 200)}`);
  }

  // 3) 等待完成或超时
  await Promise.race([donePromise, sleep(timeoutMs)]);
  clearInterval(hb);

  // 4) 读取工作区产物：优先取根目录分析报告 .md 的干净内容
  let reportText = sayText; // 兜底：用 say 最终文本
  let workspaceFiles = [];
  if (taskId) {
    try {
      const wsResp = await fetch(`${server}/api/ai_task/getTaskWorkspace/${taskId}`, { headers: auth });
      if (wsResp.ok) {
        const ws = await wsResp.json();
        const files = (ws && (ws.files || (ws.data && ws.data.files))) || [];
        workspaceFiles = files;
        // 候选：根目录（不含 /）的 .md / .json 报告文件
        const candidates = files.filter(f => typeof f === 'string' && !f.includes('/') && /\.(md|json|txt)$/i.test(f));
        let best = null, bestLen = 0;
        for (const f of candidates) {
          const content = await fetchFileContent(server, auth, taskId, f);
          if (content && content.length > bestLen) { best = content; bestLen = content.length; }
        }
        if (best) reportText = best;
      }
    } catch (e) { /* 忽略工作区读取失败，使用 say 兜底 */ }
  }

  return { taskId, reportText: reportText.trim(), workspaceFiles, sayText: sayText.trim() };
}

// 下载工作区文件内容（downloadTaskFile 接口，文本模式）
async function fetchFileContent(server, auth, taskId, fileName) {
  try {
    const enc = encodeURIComponent(fileName);
    const r = await fetch(`${server}/api/tools/storage/downloadTaskFile/${taskId}?path=${enc}`, { headers: auth });
    if (!r.ok) return null;
    return await r.text();
  } catch { return null; }
}
