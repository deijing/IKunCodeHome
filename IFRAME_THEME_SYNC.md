# iframe 主题同步集成指南

## 问题描述
当 IKunCode 落地页通过 iframe 嵌套在 newapi 主站时，主站和 iframe 内页面的主题（暗色/亮色模式）可能不一致，导致用户体验割裂。

## 解决方案
使用 `postMessage` API 实现父窗口和 iframe 之间的主题同步。

---

## 📦 iframe 端（已完成）

IKunCode 落地页已经实现了以下功能：

### 1. URL 参数初始化
在加载 iframe 时可以通过 URL 参数指定初始主题：
```html
<!-- 暗色模式 -->
<iframe src="https://api.ikuncode.cc/?theme=dark"></iframe>

<!-- 亮色模式 -->
<iframe src="https://api.ikuncode.cc/?theme=light"></iframe>
```

### 2. postMessage 监听
iframe 内页面会监听来自父窗口的主题变化消息，**兼容以下两种格式**：

**格式1（标准格式，推荐）：**
```javascript
{
  type: 'theme-change',
  theme: 'dark' | 'light'
}
```

**格式2（简化格式，兼容 newapi）：**
```javascript
{
  themeMode: 'dark' | 'light'
}
```

---

## 🔧 父窗口端（需要集成）

在你的 newapi 主站中，需要添加以下代码：

### 方案 A：在主题切换按钮点击时发送消息

找到你的主题切换按钮的点击事件处理函数，添加 postMessage 调用：

```javascript
// 假设你的主题切换函数是这样的
function toggleTheme() {
  // 你原有的主题切换逻辑
  const newTheme = isDarkMode ? 'light' : 'dark'
  setIsDarkMode(!isDarkMode)

  // 🔥 新增：通知 iframe 主题变化
  const iframe = document.querySelector('iframe[src*="api.ikuncode.cc"]')
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({
      type: 'theme-change',
      theme: newTheme
    }, 'https://api.ikuncode.cc')
  }
}
```

### 方案 B：使用 MutationObserver 自动同步（推荐）

如果不方便修改主题切换逻辑，可以使用 MutationObserver 监听主题变化：

```javascript
// 在页面加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
  const iframe = document.querySelector('iframe[src*="api.ikuncode.cc"]')
  if (!iframe) return

  // 监听 <html> 或 <body> 的 class 变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        // 根据你的主站主题判断逻辑调整
        const isDark = document.documentElement.classList.contains('dark')
                    || document.body.classList.contains('dark-mode')
                    || document.documentElement.getAttribute('data-theme') === 'dark'

        const theme = isDark ? 'dark' : 'light'

        // 发送消息给 iframe
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'theme-change',
            theme: theme
          }, 'https://api.ikuncode.cc')
        }
      }
    })
  })

  // 开始监听
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme']
  })

  // 也监听 body（根据实际情况选择）
  if (document.body) {
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    })
  }
})
```

### 方案 C：iframe 加载时同步初始主题

在 iframe 加载完成时，同步当前主题：

```javascript
const iframe = document.querySelector('iframe[src*="api.ikuncode.cc"]')

iframe.addEventListener('load', () => {
  // 获取当前主题（根据你的主站逻辑调整）
  const isDark = document.documentElement.classList.contains('dark')
  const theme = isDark ? 'dark' : 'light'

  // 发送初始主题
  iframe.contentWindow.postMessage({
    type: 'theme-change',
    theme: theme
  }, 'https://api.ikuncode.cc')
})
```

---

## 🎯 完整示例（推荐使用）

结合 URL 参数初始化 + postMessage 动态同步：

```html
<script>
// 1. 获取当前主题
function getCurrentTheme() {
  // 根据你的主站主题判断逻辑调整
  const isDark = document.documentElement.classList.contains('dark')
              || document.body.classList.contains('dark-mode')
              || localStorage.getItem('theme') === 'dark'
  return isDark ? 'dark' : 'light'
}

// 2. 创建带主题参数的 iframe
function createIframe() {
  const iframe = document.createElement('iframe')
  const currentTheme = getCurrentTheme()
  iframe.src = `https://api.ikuncode.cc/?theme=${currentTheme}`
  iframe.style.width = '100%'
  iframe.style.height = '600px'
  iframe.style.border = 'none'

  // 3. iframe 加载完成后，设置 MutationObserver 监听主题变化
  iframe.addEventListener('load', () => {
    setupThemeSync(iframe)
  })

  document.getElementById('iframe-container').appendChild(iframe)
}

// 4. 设置主题同步
function setupThemeSync(iframe) {
  const observer = new MutationObserver(() => {
    const theme = getCurrentTheme()
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'theme-change',
        theme: theme
      }, 'https://api.ikuncode.cc')
    }
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme']
  })

  if (document.body) {
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    })
  }
}

// 5. 页面加载时创建 iframe
window.addEventListener('DOMContentLoaded', createIframe)
</script>

<div id="iframe-container"></div>
```

---

## 🔒 安全注意事项

### 1. 验证消息来源（可选）
如果担心安全性，可以在 iframe 端添加来源验证。修改 `src/App.tsx` 中的 postMessage 监听器：

```typescript
const handleMessage = (event: MessageEvent) => {
  // 🔒 仅接受来自特定域名的消息
  if (event.origin !== 'https://your-parent-domain.com') return

  if (event.data?.type === 'theme-change') {
    // ...
  }
}
```

### 2. 使用 targetOrigin
在父窗口发送消息时，明确指定目标域名（已在上面示例中使用）：

```javascript
iframe.contentWindow.postMessage(message, 'https://api.ikuncode.cc')
// 不要使用 '*' 作为 targetOrigin
```

---

## 🧪 测试步骤

1. **初始加载测试**
   - 在亮色模式下加载页面，iframe 应显示亮色
   - 在暗色模式下加载页面，iframe 应显示暗色

2. **动态切换测试**
   - 点击主站的主题切换按钮
   - iframe 内页面应立即切换到对应主题
   - 多次切换验证同步稳定性

3. **跨标签页测试**
   - 在新标签页打开，验证主题一致性
   - 刷新页面，验证主题持久化

---

## ❓ 常见问题

### Q1: postMessage 没有生效？
- 检查 iframe 是否已加载完成（使用 `iframe.addEventListener('load')`）
- 检查控制台是否有跨域错误
- 确认消息格式正确：`{ type: 'theme-change', theme: 'dark' | 'light' }`

### Q2: 如何调试 postMessage？
在父窗口和 iframe 端都添加日志：

```javascript
// 父窗口
iframe.contentWindow.postMessage(message, 'https://api.ikuncode.cc')
console.log('发送主题消息:', message)

// iframe 端（在 App.tsx 的 handleMessage 中）
console.log('收到主题消息:', event.data, '来源:', event.origin)
```

### Q3: 主题切换有延迟？
- postMessage 是异步的，但通常延迟极小（< 10ms）
- 如果延迟明显，检查是否有复杂的 CSS 过渡动画

---

## 📚 相关文档

- [MDN - Window.postMessage()](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)
- [MDN - MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)
- [CLAUDE.md - 项目架构说明](./CLAUDE.md)
