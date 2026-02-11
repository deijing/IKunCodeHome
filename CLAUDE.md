# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 React + TypeScript + Vite + Tailwind CSS + Framer Motion 构建的现代化落地页项目，用于展示 IKunCode Cloud API 中转服务。该服务专注于为编码人员提供生产力工具（Claude Code、CodeX、Gemini CLI）的 API 接入。

## 快速开始

### 开发命令
```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器 (http://localhost:5173)
npm run build        # 构建生产版本
npm run preview      # 预览生产构建
npm run type-check   # TypeScript 类型检查
```

## 核心架构

### 技术栈
- **React 18.3.1**: 使用函数组件 + Hooks
- **TypeScript 5.6.3**: 严格模式（`strict: true`），完整类型定义，启用 `noUnusedLocals` 和 `noUnusedParameters`
- **Vite 6.0.3**: 构建工具，路径别名配置 `@/` -> `src/`，开发服务器端口 5173，自动打开浏览器
- **Tailwind CSS 3.4.16**: 采用 `class` 模式的暗黑主题，自定义颜色变量和动画
- **Framer Motion 11.11.17**: 所有动画和交互效果
- **Lucide React 0.468.0**: 图标库，按需导入

### 项目结构
```
src/
├── App.tsx                      # 主应用组件（单文件架构）
├── main.tsx                     # 应用入口
├── components/
│   ├── MagneticButton.tsx       # 磁吸跟随按钮组件
│   ├── IkunEasterEgg.tsx        # 彩蛋组件（输入 "jntm" 触发）
│   ├── Card3D.tsx               # 3D 卡片效果
│   └── ParticlesBackground.tsx  # 粒子背景
└── styles/
    └── globals.css              # 全局样式（Tailwind 导入）
```

### 单文件组件架构
整个应用的核心逻辑集中在 `src/App.tsx` 中，包含：
- **内联子组件**：
  - `Container`: 统一的视口进入动画容器
  - `Hero`: 首屏英雄区
  - `Features`: 特性展示区
  - `ToolSupports`: 工具支持卡片区
  - `Pricing`: 定价方案展示区
  - `Footer`: 页脚区
- **常量配置**（位于文件顶部，类型定义之后）：
  - `NAV_ITEMS`: 导航菜单项（4 个：服务、定价、文档、状态）
  - `TRANSLATIONS`: 双语文本配置（中文/英文完整映射）
  - `FEATURES`: 特性卡片数据（约 6-8 个）
  - `TOOL_SUPPORTS`: 支持的工具列表（Claude Code、CodeX、Gemini CLI 等）
  - `PRICING_PLANS`: 定价方案（Bronze/Silver/Gold 三个层级）
- 双语支持（中文/英文）
- 主题管理（暗黑/亮色模式）

### 状态管理
使用 React Hooks 进行本地状态管理，无全局状态库：
- `isDarkMode`: 主题模式（同步到 localStorage 和 HTML class）
- `lang`: 语言切换（'zh' | 'en'）
- `mousePosition`: 鼠标坐标（用于聚光灯效果）
- `copied`: 复制状态提示
- `apiPathIndex`: API 路径轮播索引

## 关键技术特性

### 1. 主题系统
- **首屏防闪烁**: `index.html` 中有内联脚本同步读取 localStorage 和系统主题偏好
- **持久化**: 主题选择保存至 `localStorage.theme`
- **CSS 变量**: 在 `globals.css` 中定义了 `--ink`、`--paper`、`--gold` 等颜色变量

### 2. 动画体系
所有动画基于 Framer Motion：
- `Container` 组件: 统一的 `whileInView` 入场动画
- `MagneticButton`: 鼠标磁吸跟随效果（考虑 `useReducedMotion`）
- 鼠标聚光灯: 使用 `motion.div` + `animate` 实现跟随效果
- API 路径轮播: 使用 `motion.code` + `animate` 实现垂直滚动切换

### 3. 响应式设计
- 使用 Tailwind 的响应式前缀（`sm:`、`md:`、`lg:`）
- 文字大小使用 `clamp()` 函数实现流式排版
- 移动端优先，渐进式增强

### 4. 性能优化
- Vite 配置的代码分割（`react-vendor`、`animation`）
- 图标按需导入自 `lucide-react`
- 图片使用静态资源（`/images/` 路径）

## 开发规范

### 1. 组件开发
- 所有组件必须有完整的 TypeScript 接口定义（如 `ContainerProps`、`Feature`、`ToolSupport`）
- 优先使用函数组件 + Hooks
- 动画组件需考虑 `useReducedMotion` 以支持无障碍访问

### 2. 样式规范
- 使用 Tailwind 原子类，避免自定义 CSS
- 颜色值优先使用 `opacity-[0.XX]` 而非硬编码透明度
- 暗黑模式使用条件渲染（三元表达式）而非 Tailwind 的 `dark:` 前缀（除 `darkMode: 'class'` 配置外）
- **自定义 Tailwind 配置**（`tailwind.config.js`）：
  - 自定义颜色：`ink`、`paper`、`gold`（通过 CSS 变量实现，支持透明度）
  - 自定义动画：`animate-pulse-slow`（3秒脉冲）、`animate-shine`（0.8秒光泽效果）
  - 主题色：`primary: #252423`

### 3. 新增功能指导
- **新增工具卡片**: 修改 `TOOL_SUPPORTS` 数组，添加对应的 logo 到 `public/images/`
- **新增定价方案**: 修改 `PRICING_PLANS` 数组和对应的 `tierColors` 配置
- **新增导航项**: 修改 `NAV_ITEMS` 数组
- **新增语言**: 扩展 `TRANSLATIONS` 类型和对象

### 4. 类型安全
- 启用 `strict: true`，所有参数必须显式类型
- 使用 `Record<'zh' | 'en', Translations>` 确保双语完整性
- Props 接口优先使用 `interface` 而非 `type`
- **核心类型定义**（位于 `App.tsx` 顶部）：
  - `ContainerProps`: 容器组件属性
  - `Feature`: 特性卡片数据结构
  - `ToolSupport`: 工具支持卡片数据结构
  - `PricingPlan`: 定价方案数据结构（包含 tier 字段：`'bronze' | 'silver' | 'gold'`）
  - `NavItem`: 导航项数据结构
  - `Translations`: 双语文本配置类型

## 部署相关

### Vercel 配置
项目包含 `vercel.json`，配置了：
- SPA 回退路由（所有请求重定向到 `index.html`）
- 构建输出目录为 `dist`
- **缓存优化**：`/assets/*` 资源设置 1 年缓存（`max-age=31536000, immutable`）

### 使用 Vercel CLI 部署

本项目使用 Vercel CLI 进行部署，确保本地已安装 Vercel CLI：

```bash
# 检查 Vercel CLI 版本
vercel --version

# 如未安装，使用 npm 安装
npm install -g vercel
```

#### 部署到生产环境

**完整部署流程：**

```bash
# 1. 确保代码通过类型检查
npm run type-check

# 2. 部署到 Vercel 生产环境
vercel --prod

# 3. 等待构建完成（通常 15-20 秒）
# 部署成功后会显示生产环境 URL
```

**部署后验证：**
- 自动部署到 Vercel 生成的 URL（如 `https://ikuncode-xxx.vercel.app`）
- 如果配置了自定义域名（`api.ikuncode.cc`），等待 1-2 分钟 CDN 缓存更新
- 在浏览器中访问域名验证更新是否生效

#### 常用 Vercel CLI 命令

```bash
# 查看部署历史
vercel ls

# 查看项目的域名配置
vercel domains ls

# 查看特定部署的日志
vercel logs <deployment-url>

# 重新部署最近一次的构建
vercel redeploy <deployment-url>

# 检查部署详情
vercel inspect <deployment-url> --logs
```

#### 重要提示

1. **iframe 嵌套场景**: 本项目的落地页通过 iframe 嵌套在主站中，所有指向 `api.ikuncode.cc` 的链接使用 `target="_top"` 以确保在整个浏览器窗口跳转，而不是仅在 iframe 内跳转。

2. **CDN 缓存**: 部署成功后，如果使用自定义域名，可能需要等待 1-2 分钟让 Vercel 的 CDN 缓存更新。

3. **构建优化**: Vercel 会自动使用构建缓存，通常只需要 12-20 秒即可完成构建。

### 环境变量
当前无环境变量依赖，所有 API URL 硬编码在组件中：
- `https://api.ikuncode.cc` (主 API)
- `https://docs.ikuncode.cc` (文档)
- `https://status.ikuncode.cc` (状态页)

### 静态资源
图片资源放置在 `public/images/` 目录：
- `Anthropic.png`
- `openai.png`
- `gemini-ai.png`

## 特殊功能

### iframe 主题同步（重要）
项目支持通过 iframe 嵌套在父页面中，并能自动同步主题：

**URL 参数初始化：**
```html
<iframe src="https://api.ikuncode.cc/?theme=dark"></iframe>
<iframe src="https://api.ikuncode.cc/?theme=light"></iframe>
```

**postMessage 动态同步：**
- iframe 监听来自父窗口的 `{ type: 'theme-change', theme: 'dark' | 'light' }` 消息
- 父窗口需要在主题切换时调用 `iframe.contentWindow.postMessage()` 通知 iframe
- 详细集成方法见 [IFRAME_THEME_SYNC.md](./IFRAME_THEME_SYNC.md)

**主题优先级：**
1. URL 参数 `?theme=dark/light`（最高优先级）
2. localStorage 中保存的主题
3. 系统主题偏好

### 彩蛋（Easter Egg）
- 在页面上输入键盘序列 `jntm` 触发弹窗
- 实现位于 `src/components/IkunEasterEgg.tsx`
- 使用 `AnimatePresence` 管理出入场动画

### 磁吸按钮
- 鼠标悬停时按钮跟随鼠标移动
- 使用 `useMotionValue` + `useSpring` 实现弹簧物理效果
- 自动检测用户的运动偏好设置（`useReducedMotion`）

## 常见开发任务

### 修改 Logo/品牌信息
- 主标题: `App.tsx` 中的 `TRANSLATIONS` -> `hero.title`
- Footer Logo: `App.tsx` 中的 `<footer>` 区域

### 调整动画时长
- 全局入场动画: 修改 `Container` 组件的 `transition.duration`
- 按钮动画: 修改 `MagneticButton` 中的 `stiffness` 和 `damping` 参数

### 添加新的特性卡片
1. 在 `FEATURES` 数组中添加新项
2. 确保 `icon` 使用 `lucide-react` 中的组件
3. 调整网格布局（`md:col-span-X`）以保持视觉平衡

## 注意事项

### 开发要点
- **图片路径**: 使用 `public/` 目录下的静态资源时，路径以 `/` 开头（如 `/images/logo.png`）
- **类型检查**: 提交前运行 `npm run type-check` 确保无类型错误
- **暗黑模式测试**: 确保所有新组件在两种主题下都有良好的对比度
- **响应式验证**: 在移动端、平板、桌面三种视口下测试新功能

### 性能注意
- Vite 会自动进行代码分割，`react-vendor` 和 `animation` 已配置为独立 chunk
- 图标使用命名导入（`import { Icon } from 'lucide-react'`），确保 Tree Shaking 生效
- 避免在 `App.tsx` 中添加过多的内联组件，考虑拆分到 `components/` 目录

### 常见陷阱
- **暗黑模式闪烁**: 不要移除 `index.html` 中的内联主题脚本，它保证首屏无 FOUC（Flash of Unstyled Content）
- **动画性能**: 使用 `useReducedMotion()` 检测用户偏好设置，尊重无障碍需求
- **链接跳转**: 项目通过 iframe 嵌套，记得使用 `target="_top"` 避免在 iframe 内跳转
