# 部署上线指南（获取公网 URL）

> 评委需要**实际打开并使用的公网地址**。以下两种免费方案任选其一，约 5 分钟搞定。
> 核心：把代码推到 GitHub，在云平台连仓库部署，并通过**环境变量**注入 `INFINI_API_KEY`。

---

## 方案 A：Railway（推荐，最简单）

1. 打开 https://railway.app ，用 GitHub 登录。
2. **New Project → Deploy from GitHub repo**，选中本仓库。
3. Railway 会识别 `Dockerfile`（或 Node）自动构建。
4. 进入项目 **Variables**，添加：
   - `INFINI_API_KEY` = `sk-xxxx`（你的 InfiniSynapse Key）
   - `INFINI_SERVER` = `https://app.infinisynapse.cn`
   - `PORT` = `3000`
   - `INFINI_CLIENT_ID` = `partner_xxx`（已启用 SSO 时填）
   - `INFINI_CLIENT_SECRET` = `psk_xxx`（仅展示一次，务必保存）
   - `SELF_ORIGIN` = `https://你的公网域名`（必须与下面的回调白名单一致）
5. 部署完成后，在 **Settings → Domains** 生成 `xxx.railway.app` 公网地址。
6. **配置 SSO 回调白名单**：去 InfiniSynapse「设置 → 第三方接入 → 编辑应用」，把回调域名白名单加上你的公网域名（如 `xxx.railway.app`；本地调试用 `127.0.0.1`）。
7. 打开该地址 → 点「登录」走一遍 SSO → 选场景 → 一键生成建议，确认可用。

## 方案 B：Render

1. 打开 https://render.com ，用 GitHub 登录。
2. **New → Web Service**，连本仓库。
3. Runtime 选 **Docker**（自动用 Dockerfile），或 Node（零依赖也能跑）。
4. **Environment → Add Environment Variable**：同上填 `INFINI_API_KEY` 等。
5. 部署完成后获得 `xxx.onrender.com` 公网地址。

> 免费版可能有冷启动（首次打开慢几秒），属正常；如担心，可在部署后用工具定时 ping 保活。

---

## 关于「用户指标 60% 分」的加分项

比赛用户分来自 **InfiniSynapse 平台后台**的注册用户数与活跃使用量。若要最大化这部分分数，建议启用 **InfiniSynapse 登录（Partner SSO）**：

- 让使用你应用的用户「用 InfiniSynapse 账号登录」→ 注册即送 500 积分 → 变成活跃用户 → 直接计入评分（拉新加分）。
- 接入只需服务端 2 个 HTTP 请求（见 `https://infinisynapse.cn/zh/docs/InfiniSynapse%20Partner%20SSO%20Integration%20Guide`），无 SDK 依赖。
- 本项目已实现完整 SSO（`server/sso.js` + `index.js` 的 `/auth/infini/*` 路由）：用户登录后其分析以本人账号发起，计入其活跃使用量；匿名访客回落主 Key。

**配置要点**：部署后必须把公网域名加入 InfiniSynapse「第三方接入」的**回调域名白名单**，且环境变量 `SELF_ORIGIN` 与之完全一致，否则 SSO 回调会被拒绝。本地调试白名单填 `127.0.0.1` 即可。

---

## 自托管 / Docker

```bash
docker build -t ai-merchandising-agent .
docker run -d -e INFINI_API_KEY=sk-xxxx -p 3000:3000 ai-merchandising-agent
```

---

## 提交材料清单对照

| 要求 | 位置 |
| --- | --- |
| 应用名称与简介 | README.md / 本文件 |
| 公网 URL | Railway/Render 提供的域名 |
| InfiniSynapse API 集成说明 | README.md「InfiniSynapse API 集成说明」 |
| 代码仓库 | 你的 GitHub 仓库 |
| 使用截图 / 演示视频 | 应用运行后截图（决策卡 / 评分卡 / 关联销售） |
