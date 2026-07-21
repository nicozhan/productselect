# 🧠 AI 选品大脑 · AI Merchandising Agent

> 基于 **InfiniSynapse** 的无人零售智能选品运营 Agent —— Vibe Coding 泛数据分析应用开发大赛参赛作品。
> 输入「设备位置 + 历史销售 + 当下环境」，AI 覆盖 **12 个分析维度**，输出一句话决策：
> **「明天该卖什么、卖多少、放在哪里、为什么。」**

---

## ✨ 亮点

- **不是 BI，是 Agent**：把泛数据分析 + 长链路任务 + 决策建议封装成一个可对话的选品大脑。
- **12 维分析模型**：历史销售 / 时间 / 天气 / 地理位置(POI) / 周边活动 / 节假日 / 用户画像 / 库存保质期 / 商品关联销售(Market Basket) / 竞争环境 / 社交热点 / AI 销量预测。
- **AI 商品评分（100 分制）**：每个 SKU 给出综合分 + 6 项子维度 + 补货建议（增加/减少 X 件）。
- **AI 场景识别**：输入位置即识别 500m POI、工作日/周末人流、人群画像，建议增减品类。
- **商品关联销售**：发现搭配购买规律，给出交叉销售与预计连带提升。
- **AI Tomorrow**：基于明日天气/活动/节假日预测，给出「今晚就该备的货」。
- **零门槛体验**：内置 5 个预设无人零售场景，评委/用户无需自备数据即可一键体验。
- **可导出 / 可分享**：结果支持导出 PDF、复制分享链接。

---

## 🏗 技术架构

```
浏览器(前端)  ──HTTP──▶  你的后端(Node, 零依赖)  ──Server API──▶  InfiniSynapse
   public/                server/index.js                      /api/ai/message (newTask)
   (HTML/CSS/JS)         - 持有 API Key(仅服务端)              /api/ai/events  (SSE)
                         - 先连 SSE 再发任务                    /api/ai_task/*  (工作区产物)
                         - 解析流式消息 + 抽取结构化结果
```

- **前端**：原生 HTML/CSS/JS，自带轻量 Markdown 渲染，暗色 AI 仪表盘风格。
- **后端**：Node 内置 `http` 模块，**零运行时依赖**，托管前端 + 提供分析 API。
- **集成边界**：API Key **只在服务端**，前端只连自己的后端；所有分析经 InfiniSynapse Server API 发起，调用日志可在平台后台（`app.infinisynapse.cn/tasks`）查验。

---

## 🔌 InfiniSynapse API 集成说明（提交材料用）

后端在 `server/infini.js` 中按官方 Vibe Coding 指南的「核心模式」接入：

1. **鉴权**：所有请求带 `Authorization: Bearer <API Key>`。
2. **先连 SSE，再发任务**（顺序不能反）：
   - `GET {INFINI_SERVER}/api/ai/events?connId=<uuid>` 建立 `text/event-stream` 长连接；
   - `POST {INFINI_SERVER}/api/ai/message`，`body={ type:"newTask", text:<分析提示词>, connId, chatSettings:{mode:"act"}, autoApprovalSettings:{enabled:true} }`。
3. **消费流式结果**：解析 `message.partial`（覆盖式累积）作为实时进度；检测到 `completion_result` 或 SSE 连接关闭即视为任务完成。
4. **读取产物**：任务完成后 `GET {INFINI_SERVER}/api/ai_task/getTaskWorkspace/:taskId` 列出工作区文件，再用 `GET {INFINI_SERVER}/api/tools/storage/downloadTaskFile/:taskId?path=<报告.md>` 取回 Agent 写出的完整分析报告（干净 Markdown）。
5. **结构化抽取**：提示词要求 Agent 输出含六个标准标题的 Markdown 报告（一句话决策 / AI 场景识别 / AI 商品评分 / 商品关联销售 / AI Tomorrow / 完整分析报告），后端 `server/parse.js` 解析分节与表格，抽取为评分卡 / 关联销售 / 明日建议等结构化卡片。

> 分析提示词见 `server/prompts.js`，覆盖 12 维度并要求固定章节格式，确保结果既可读（Markdown 报告）又可机读（结构化卡片）。

**未配置 Key 时自动进入「演示模式」**：返回结构完全一致的模拟数据，保证离线/无 Key 也可完整体验与评审。

### 🔑 Partner SSO（使用 InfiniSynapse 登录 · 冲用户分 60%）

为最大化比赛「用户指标」（注册用户数 + 活跃使用量，占 60% 权重），应用集成了 **InfiniSynapse Partner SSO**：

- 用户在应用内点「使用 InfiniSynapse 登录」→ 跳转 InfiniSynapse 完成登录（或复用已有登录态，几乎无感）；
- 回调时后端用一次性 `code` + `withApiKey:true` 兑换，拿到**该用户专属的 `sk-` 密钥**（`server/sso.js`，仅存服务端）；
- 该用户后续发起的分析**以其本人账号调用**，调用/任务/活跃都计入**他自己的 InfiniSynapse 账号** → 直接贡献「注册用户数 + 活跃使用量」评分；
- 未登录的匿名访客自动回落到应用主 Key，保证可用性不掉。

配置（`.env`，仅在服务端）：

```env
INFINI_CLIENT_ID=partner_xxx        # 设置 → 第三方接入 创建接入应用获取
INFINI_CLIENT_SECRET=psk_xxx        # 仅展示一次，务必保存
SELF_ORIGIN=https://你的公网域名     # 必须与回调域名白名单一致
```

> 回调域名白名单在 InfiniSynapse「设置 → 第三方接入」编辑应用处配置；本地调试填 `127.0.0.1`，部署后改为公网域名。

---

## 🚀 本地运行

```bash
# 1. 进入项目
cd ai-merchandising-agent

# 2.（可选）配置真实 API Key —— 去 https://app.infinisynapse.cn 注册领 500 积分并创建 Key
cp .env.example .env
# 编辑 .env，填入 INFINI_API_KEY=sk-xxxx

# 3. 启动（零依赖，仅需 Node 18+）
node server/index.js
# 打开 http://localhost:3000
```

> 不填 Key 也能跑：自动演示模式，所有界面与真实接口同构。

---

## ☁️ 部署上线（获取公网 URL）

详见 **[deploy.md](./deploy.md)** —— 提供 Railway / Render 一键部署步骤（免费公网 URL），并通过环境变量注入 `INFINI_API_KEY`。

也可自行 Docker 部署：

```bash
docker build -t ai-merchandising-agent .
docker run -e INFINI_API_KEY=sk-xxxx -p 3000:3000 ai-merchandising-agent
```

---

## 📁 目录结构

```
ai-merchandising-agent/
├── server/
│   ├── index.js      # 零依赖后端：API 路由 + 静态托管
│   ├── infini.js     # InfiniSynapse 客户端（SSE + newTask + 工作区）
│   ├── prompts.js    # 12 维度分析提示词
│   ├── parse.js      # 从报告抽取结构化 JSON
│   ├── mock.js       # 演示模式（无 Key 时的拟真分析）
│   └── scenarios.js  # 5 个预设无人零售场景
├── public/
│   ├── index.html    # 页面结构
│   ├── styles.css    # 暗色 AI 仪表盘样式
│   └── app.js        # 前端逻辑（场景/表单/轮询/渲染/PDF）
├── Dockerfile
├── .env.example
└── README.md
```

---

## 🏆 参赛信息

- **赛事**：InfiniSynapse × CSDN 首届 Vibe Coding 泛数据分析应用开发大赛
- **报名/提交**：https://infinisynapse.cn/contest/vibe-coding
- **应用形态**：Web 应用（已部署公网可访问）
- **核心能力**：全部分析经 InfiniSynapse Server API 完成
