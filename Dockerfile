# 使用 Node 18+ 精简镜像，零运行时依赖
FROM node:18-alpine

WORKDIR /app

# 只复制必要文件（无 node_modules）
COPY package.json ./
COPY server ./server
COPY public ./public

ENV PORT=3000
ENV INFINI_API_KEY=""
ENV INFINI_SERVER=https://app.infinisynapse.cn

EXPOSE 3000

# 容器启动时通过环境变量注入 API Key 即可接入真实分析
CMD ["node", "server/index.js"]
