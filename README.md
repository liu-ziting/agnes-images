# AGNES Images

一个基于 `React + Vite + TypeScript` 构建的 Agnes AI 图像生成与改图前端工作台。

当前版本已经不是最初的单文件 Demo，而是围绕以下工作流重构过的可维护前端：

- 文本提示词优化
- 多候选提示词生成
- 文生图
- 图生图
- 本地底图上传 / 粘贴截图
- 历史记录持久化
- 基于历史图恢复参数继续创作

## 项目定位

这个项目聚焦于一个简单直接的 AI 创作流程：

1. 输入草稿提示词
2. 根据当前语言环境生成对应语言的优化提示词或候选提示词
3. 调用 Agnes 图片接口生成图片
4. 基于生成结果或本地图片继续改图
5. 在历史记录中回看、恢复、继续分支创作

## 当前功能

### 1. 文本生成能力

- 支持提示词一键优化
- 支持生成 3 个不同方向的提示词候选
- 根据当前界面语言输出对应语言的提示词
- 支持负面提示词输入

### 2. 图片生成能力

- 支持 Agnes 文生图接口
- 支持常用尺寸切换
- 支持从候选提示词直接继续生成

### 3. 改图能力

- 支持通过图片 URL 改图
- 支持本地上传底图
- 支持粘贴截图作为底图
- 支持底图预览
- 支持快捷改图模板
- 支持 `需要修改什么 / 需要保留什么 / 需要避免什么` 的改图输入方式

### 4. 历史记录能力

- 历史记录保存在浏览器本地
- 支持查看历史缩略图时间轴
- 支持选中历史项后恢复参数
- 支持从任意历史图继续改图
- 支持删除单条历史记录
- 支持清空全部历史记录

### 5. 界面体验

- 粗野主义风格 UI
- 中英文双语切换
- 全屏预览与详情弹层
- 移动端可用的自适应布局

## 当前目录结构

项目当前真实使用的 `src` 目录如下：

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── FullscreenModal.tsx
│   ├── GeneratePanel.tsx
│   ├── Header.tsx
│   ├── HistoryGallery.tsx
│   ├── ModifyPanel.tsx
│   ├── OutputPanel.tsx
│   ├── PromptVariants.tsx
│   ├── SizeSelect.tsx
│   └── TabNav.tsx
├── constants/
│   ├── i18n.ts
│   └── options.ts
├── services/
│   └── agnesApi.ts
├── utils/
│   ├── download.ts
│   ├── files.ts
│   └── storage.ts
└── types.ts
```

### 目录说明

- `App.tsx`
  - 页面容器层，负责状态管理、交互编排、请求触发
- `components/`
  - 展示组件层，负责表单、历史区、弹层、输出区等 UI
- `constants/`
  - 静态配置和中英文文案
- `services/`
  - Agnes API 请求封装
- `utils/`
  - 下载、文件读取、本地存储等通用工具
- `types.ts`
  - 全局类型定义

## 技术栈

- React 18
- Vite 5
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## 本地开发

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

本地预览构建产物：

```bash
npm run preview
```

## 接口说明

当前前端使用固定代理地址：

```text
https://agnes-api.lz-t.top
```

在代码中对应位置为：

- `src/constants/options.ts` 中的 `API_URL`

当前封装的接口包括：

- `optimizePrompt()`
- `generatePromptVariants()`
- `generateImage()`
- `modifyImage()`

都位于：

- `src/services/agnesApi.ts`

## 重要说明

### 1. 提示词语言

提示词优化和提示词候选会跟随当前界面语言：

- 中文界面输出中文提示词
- 英文界面输出英文提示词

### 2. 本地图片改图

当前本地上传底图使用的是 `data URL` 方案，也就是前端直接把图片转成 Base64 后作为底图传给改图接口。

这意味着：

- 如果你的代理层或上游接口支持 `data URL`，本地改图可以直接使用
- 如果你的代理层不支持，则需要补一个图片上传接口，把本地图片先转成可访问 URL 再调用改图

相关代码位置：

- `src/utils/files.ts`
- `src/components/ModifyPanel.tsx`
- `src/App.tsx`

### 3. 历史记录存储

历史记录当前使用浏览器 `localStorage` 保存，适合本地单用户使用，不适合多人共享或云端同步。

相关代码位置：

- `src/utils/storage.ts`

## 后续可以继续扩展的方向

- 接入真实的图片上传接口，替代前端 `data URL`
- 批量出图
- 版本树可视化
- 收藏 / 项目管理
- 参数导出与分享链接
- 更细的高级生成参数

## License

MIT
