# AGNES AI - Image Generation & Modification Interface

这是一个基于 **Agnes-2.0-Flash** 和 **Agnes-Image-2.1-Flash** 模型构建的现代、粗野主义（Brutalism）风格的 AI 图像生成与编辑 Web 平台。

本项目提供了一个完整的端到端工作流：从自然语言提示词（Prompt）的 AI 智能扩写优化，到高信息密度图像的生成，再到基于历史版本的局部定向图生图（Image-to-Image）修改。

## ✨ 核心特性 (Features)

*   **🎨 粗野主义 UI 设计 (Brutalist UI)**
    *   极具辨识度的黑白高对比度设计，点缀霓虹橙色高光。
    *   使用 `Syne` 标题字体与 `JetBrains Mono` 等宽字体，呈现工业级排版美学。
    *   深度适配移动端，提供平滑的响应式布局与全屏大图预览沉浸体验。
*   **🧠 AI 提示词优化 (Prompt Optimization)**
    *   接入 `agnes-2.0-flash` 大语言模型。
    *   只需输入简单的草稿，即可一键扩写为富含画面细节、光影、构图的专业级生图提示词。
*   **🖼️ 高清图像生成 (Text-to-Image)**
    *   接入 `agnes-image-2.1-flash` 图像大模型。
    *   支持自定义模型版本、图片比例（1:1, 16:9, 9:16 等）。
*   **🔄 图生图高级编辑 (Image-to-Image)**
    *   支持粘贴在线图片 URL 作为底图。
    *   独创的 **"What to change" + "What to keep"** 双输入表单，引导用户写出符合模型最佳实践的图生图指令。
*   **⏱️ 历史会话流 (Session History)**
    *   自动记录您在当前会话中生成和修改的所有图片。
    *   可视化的底部历史缩略图画廊，支持一键点击回溯。
    *   随时可以选中任意一张历史图片作为新的底图，进行无数次的叠代修改（Modify This）。
*   **🔒 安全的 API 代理 (Cloudflare Worker Proxy)**
    *   内置了 Cloudflare Worker 代理代码，防止前端暴露真实 API Key，确保生产环境绝对安全。

## 🛠️ 技术栈 (Tech Stack)

*   **前端框架**: React 18 + Vite
*   **类型语言**: TypeScript
*   **样式方案**: Tailwind CSS
*   **图标库**: Lucide React
*   **动画引擎**: Framer Motion
*   **后端代理**: Cloudflare Workers (JavaScript)

## 🚀 快速开始 (Getting Started)

### 1. 本地开发运行

```bash
# 安装依赖
npm install

# 启动本地开发服务器
npm run dev
```

打开浏览器访问 `http://localhost:5173` 即可预览。

*(注意：当前代码中硬编码了线上的代理接口 `https://agnes-api.lz-t.top`，本地开发可直接运行而无需配置 Key)*

### 2. 部署前端到 Cloudflare Pages

本项目非常适合部署在 Cloudflare Pages 上，以获得全球 CDN 加速。

**方式 A: 使用 Wrangler CLI 快速部署**
```bash
# 构建前端产物
npm run build

# 使用 wrangler 部署 dist 目录
npx wrangler pages deploy dist
```

**方式 B: 通过 GitHub 自动部署**
1. 将代码 Push 到您的 GitHub 仓库。
2. 在 Cloudflare Dashboard 中选择 **Workers & Pages** -> **Create** -> **Pages** -> **Connect to Git**。
3. 选择该仓库，配置构建命令为 `npm run build`，输出目录为 `dist`。
4. 点击 Deploy 即可。

## 🔐 关于 API 密钥与后端代理

为了保护您的 `AGNES_API_KEY` 不被泄露，本项目根目录下包含了一个 `worker.js` 文件。

它是一个 Cloudflare Worker 脚本，用于拦截前端的请求，附加上您的真实 API Key，并转发给官方的 `https://apihub.agnes-ai.com`。

目前前端 `src/App.tsx` 中已经硬编码指向了代理地址。如果您需要自己部署这套代理，可以：
1. 修改 `worker.js` 中的 `AGNES_API_KEY` 为您的真实 Key。
2. 运行 `npx wrangler deploy worker.js --name agnes-api-proxy`。
3. 将 `src/App.tsx` 中的 `API_URL` 替换为您自己的代理地址并重新打包前端。

## 📄 许可证 (License)
MIT License
