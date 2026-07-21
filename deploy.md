# 部署上线指南（Railway 获取公网 URL）

> 评委需要**实际打开并使用的公网地址**。本项目已推到 GitHub，用 Railway 连仓库约 5 分钟搞定。
> 核心：Railway 拉 GitHub 代码构建 → 通过**环境变量**注入密钥 → 生成 `xxx.railway.app` 公网域名。

---

## 一、Railway 部署 step-by-step

### 1. 登录并新建项目
1. 打开 https://railway.app ，点 **Login** → 选 **GitHub** 授权登录。
2. 登录后点 **New Project**。
3. 选 **Deploy from GitHub repo**（从 GitHub 仓库部署）。
4. 在列表里选中 `nicozhan/productselect` → 确认。
   - 仓库已含 `Dockerfile`，Railway 会自动用 Docker 构建（`node server/index.js` 启动，零依赖）。

### 2. 配置环境变量（关键）
进入项目 → 左侧 **Variables**（变量）→ 点 **New Variable** 逐个添加：

| 变量名 | 值 | 说明 |
| --- | --- | --- |
| `INFINI_API_KEY` | `sk-xxxx`（你的 InfiniSynapse API Key） | **必填**，缺省则应用自动降级为演示模式 |
| `INFINI_CLIENT_ID` | `partner_xxx` | 启用 InfiniSynapse 登录（Partner SSO）时填 |
| `INFINI_CLIENT_SECRET` | `psk_xxx` | 仅展示一次，务必保存好 |
| `SELF_ORIGIN` | `https://你的域名.railway.app` | **必须与下面的 SSO 回调白名单完全一致** |
| `INFINI_SERVER` | 不填（默认 `https://app.infinisynapse.cn`） | 一般无需改 |
| `PORT` | **不填** | Railway 会自动注入自己的端口，代码已兼容 |

> ⚠️ 不要手动设 `PORT`——Railway 注入的端口才是正确的；代码读 `process.env.PORT` 已处理。
> 三个密钥值的来源：见本对话，或本地 `.env`（绝不入库，已 gitignore）。

### 3. 生成公网域名
1. 部署会自动开始（首次构建约 1–2 分钟）。可在 **Deployments** 看日志。
2. 构建成功后，进入 **Settings → Domains**（或项目页 **Generate Domain**）。
3. 点 **Add Domain** / **Generate Domain**，得到形如 `https://xxxx.up.railway.app` 的公网地址。
   - 免费版域名即 `xxx.railway.app`（或 `xxx.up.railway.app`），可直接用。

### 4. 配置 SSO 回调白名单（闭环）
1. 打开 InfiniSynapse → **设置 → 第三方接入 → 编辑「无人零售AI选品」应用**。
2. 把**回调域名白名单**加上你的 Railway 公网域名（如 `xxxx.up.railway.app`）。
   - 本地调试时白名单填 `127.0.0.1`；线上必须填公网域名，且要和 `SELF_ORIGIN` 一字不差。
3. 改完保存。现在访客点「用 InfiniSynapse 登录」才会成功跳转授权。

### 5. 验证上线
浏览器打开你的 `https://xxxx.up.railway.app`，确认：
- 首页能加载（暗色 AI 仪表盘）。
- 访问 `https://xxxx.up.railway.app/api/health` 应返回：
  ```json
  { "ok": true, "configured": true, "mock": false, "server": "https://app.infinisynapse.cn", "sso": true }
  ```
  - `configured:true` = API Key 注入成功；`sso:true` = SSO 凭证配对成功。
- 选一个场景 → 点「开始分析」→ 约 1–3 分钟后返回 5 块卡片（决策/场景/评分/关联/AI Tomorrow）。
- （可选）点右上「登录」走一遍 SSO，确认能跳转并回写登录态。

---

## 二、常见问题排查

| 现象 | 原因 / 解决 |
| --- | --- |
| `/api/health` 返回 `configured:false` | `INFINI_API_KEY` 没填或拼错 → 回 Variables 核对 |
| 首页能开但分析报错 401/403 | API Key 失效 → 换一把有效的 `sk-` |
| SSO 点登录报「创建登录会话失败」或 901 | `INFINI_CLIENT_ID/SECRET` 不匹配或应用未启用 → 去第三方接入核对；白名单/SELF_ORIGIN 域名不一致也会失败 |
| 部署成功但域名打不开 | 端口问题 → 确认未手动设 `PORT`；看 Deployments 日志是否 `listen` 在 Railway 给的端口 |
| 免费版首次打开很慢 | 冷启动，多等几秒；可在部署后用定时 ping 保活 |

> Railway 健康检查建议设为 **HTTP → `/api/health`**（在 Settings → Healthcheck 填路径），比默认 TCP 更稳。

---

## 三、关于「用户指标 60% 分」的加分项

比赛用户分来自 **InfiniSynapse 平台后台**的注册用户数与活跃使用量。最大化这部分分数要启用 **InfiniSynapse 登录（Partner SSO）**：

- 让使用你应用的用户「用 InfiniSynapse 账号登录」→ 注册即送 500 积分 → 变成活跃用户 → 直接计入评分（拉新加分）。
- 接入只需服务端 2 个 HTTP 请求（见官方 `InfiniSynapse Partner SSO Integration Guide`），无 SDK 依赖。
- 本项目已实现完整 SSO（`server/sso.js` + `index.js` 的 `/auth/infini/*` 路由）：用户登录后其分析以本人账号发起，计入其活跃使用量；匿名访客回落主 Key。

**配置要点**：部署后必须把公网域名加入 InfiniSynapse「第三方接入」的**回调域名白名单**，且 `SELF_ORIGIN` 与之完全一致，否则 SSO 回调会被拒绝。

---

## 四、自托管 / Docker（本地或自有服务器）

```bash
docker build -t ai-merchandising-agent .
docker run -d -e INFINI_API_KEY=sk-xxxx -p 3000:3000 ai-merchandising-agent
```

---

## 五、提交材料清单对照

| 要求 | 位置 |
| --- | --- |
| 应用名称与简介 | README.md / 本文件 |
| 公网 URL | Railway 提供的 `xxx.up.railway.app` |
| InfiniSynapse API 集成说明 | README.md「InfiniSynapse API 集成说明」 |
| 代码仓库 | https://github.com/nicozhan/productselect |
| 使用截图 / 演示视频 | 应用运行后截图（决策卡 / 评分卡 / 关联销售） |
