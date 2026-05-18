简体中文 | [English](./README.en.md)

# IKunCode Cloud - React 落地页

基于 React + TypeScript + Vite + Tailwind CSS + Framer Motion 构建的现代化落地页项目。

## 特性

- ⚡️ **极速开发** - 使用 Vite 作为构建工具，开发体验流畅
- 🎨 **现代设计** - 采用 Tailwind CSS，支持暗黑模式切换
- 🎭 **流畅动画** - 集成 Framer Motion，实现丝滑的页面交互
- 📱 **完全响应式** - 适配各种屏幕尺寸
- 🔒 **类型安全** - 使用 TypeScript 确保代码质量
- 🎯 **SEO 优化** - 预配置 meta 标签

## 技术栈

- **框架**: React 18.3.1
- **语言**: TypeScript 5.6.3
- **构建工具**: Vite 6.0.3
- **样式**: Tailwind CSS 3.4.16
- **动画**: Framer Motion 11.11.17
- **图标**: Lucide React 0.468.0

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

项目将在 `http://localhost:5173` 启动，支持热更新。

### 生产构建

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

### 类型检查

```bash
npm run type-check
```

## 项目结构

```
ikuncode/
├── src/
│   ├── App.tsx              # 主应用组件
│   ├── main.tsx             # 应用入口
│   └── styles/
│       └── globals.css      # 全局样式
├── index.html               # HTML 模板
├── package.json             # 项目配置
├── tsconfig.json            # TypeScript 配置
├── tsconfig.node.json       # Node TypeScript 配置
├── vite.config.ts           # Vite 配置
├── tailwind.config.js       # Tailwind 配置
├── postcss.config.js        # PostCSS 配置
└── README.md               # 项目文档
```

## 功能说明

### 定价策略

**汇率标准**: 1 CNY = 1 USD（无汇率差异）

#### 🔹 Codex 模型
- **固定倍率**: 0.2x
- 适用于所有用户，无需达到充值门槛

#### 🔹 CC 模型（Claude/Chat）
分为四个等级，根据累计充值金额自动解锁：

| 档位 | 充值门槛 | 倍率 | 说明 |
|------|---------|------|------|
| **C0** | < ¥25 | 1.1x | 初始档位 |
| **C1** | ≥ ¥25 | 1.0x | 达标即享官方定价 |
| **C2** | ≥ ¥500 | 0.95x | 5% 优惠 |
| **C3** | ≥ ¥1000 | 0.90x | 10% 优惠 |

**注意事项**:
- ✅ 无忙时/闲时之分，全时段统一倍率
- ✅ 累计充值金额自动累加，档位自动提升
- ✅ 倍率实时生效，无需手动申请

### 暗黑模式

项目支持暗黑/亮色模式切换，并会记住用户的选择：

- 首次访问时根据系统主题自动选择
- 用户手动切换后保存到 localStorage
- 首屏同步加载主题，避免闪烁（FOUC）

### 响应式设计

- **移动端**: 单列布局，优化触摸交互
- **平板**: 适配中等屏幕
- **桌面端**: 多列布局，充分利用大屏空间

### 动画效果

- **进入视口动画**: 使用 Framer Motion 的 `whileInView`
- **交互动画**: 按钮悬停、导航展开等
- **背景动效**: 微妙的流光效果

## 性能优化

- ✅ 代码分割（React、动画库独立打包）
- ✅ 图标按需加载
- ✅ CSS 自动 Tree Shaking
- ✅ gzip 压缩
- ✅ 类型检查

## 浏览器支持

支持所有现代浏览器：

- Chrome/Edge (最新版)
- Firefox (最新版)
- Safari (最新版)

## 开发注意事项

1. **类型安全**: 所有组件都有完整的 TypeScript 类型定义
2. **代码规范**: 遵循 React 最佳实践
3. **可维护性**: 清晰的代码结构和注释

## 后续优化建议

- [ ] 组件模块化拆分（Header、Hero、Features 等）
- [ ] 添加 ESLint + Prettier
- [ ] 集成单元测试（Vitest）
- [ ] 添加 E2E 测试（Playwright）
- [x] 配置 CI/CD (Vercel 自动部署已启用)
- [ ] 添加更多 SEO 优化（OpenGraph、Twitter Cards）

## License

MIT

## 作者

IKunCode Team
