[简体中文](./IFRAME_THEME_SYNC.md) | English

# iframe Theme Sync Integration Guide

## Problem Statement
When the IKunCode landing page is embedded as an iframe inside the newapi parent site, the parent site and the iframe page may end up with mismatched themes (dark/light mode), resulting in a fragmented user experience.

## Solution
Use the `postMessage` API to synchronize the theme between the parent window and the iframe.

---

## 📦 iframe Side (Implemented)

The IKunCode landing page already implements the following:

### 1. URL Parameter Initialization
You can specify the initial theme via URL parameter when loading the iframe:
```html
<!-- Dark mode -->
<iframe src="https://api.ikuncode.cc/?theme=dark"></iframe>

<!-- Light mode -->
<iframe src="https://api.ikuncode.cc/?theme=light"></iframe>
```

### 2. postMessage Listener
The page inside the iframe listens for theme-change messages from the parent window, and **supports both of the following formats**:

**Format 1 (standard, recommended):**
```javascript
{
  type: 'theme-change',
  theme: 'dark' | 'light'
}
```

**Format 2 (simplified, compatible with newapi):**
```javascript
{
  themeMode: 'dark' | 'light'
}
```

---

## 🔧 Parent Window Side (Requires Integration)

You need to add the following code to your newapi parent site:

### Option A: Send a Message When the Theme Toggle Is Clicked

Locate the click handler of your theme toggle button and add a postMessage call:

```javascript
// Suppose your theme toggle function looks like this
function toggleTheme() {
  // Your existing theme-toggle logic
  const newTheme = isDarkMode ? 'light' : 'dark'
  setIsDarkMode(!isDarkMode)

  // 🔥 New: notify the iframe about the theme change
  const iframe = document.querySelector('iframe[src*="api.ikuncode.cc"]')
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({
      type: 'theme-change',
      theme: newTheme
    }, 'https://api.ikuncode.cc')
  }
}
```

### Option B: Auto-Sync With MutationObserver (Recommended)

If modifying your theme-toggle logic is inconvenient, you can use a MutationObserver to watch for theme changes:

```javascript
// Run after the page has loaded
window.addEventListener('DOMContentLoaded', () => {
  const iframe = document.querySelector('iframe[src*="api.ikuncode.cc"]')
  if (!iframe) return

  // Watch class changes on <html> or <body>
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        // Adjust the detection logic to match your parent site's theme strategy
        const isDark = document.documentElement.classList.contains('dark')
                    || document.body.classList.contains('dark-mode')
                    || document.documentElement.getAttribute('data-theme') === 'dark'

        const theme = isDark ? 'dark' : 'light'

        // Send the message to the iframe
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'theme-change',
            theme: theme
          }, 'https://api.ikuncode.cc')
        }
      }
    })
  })

  // Start observing
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme']
  })

  // Also observe body (use as appropriate)
  if (document.body) {
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    })
  }
})
```

### Option C: Sync the Initial Theme When the iframe Loads

When the iframe finishes loading, push the current theme to it:

```javascript
const iframe = document.querySelector('iframe[src*="api.ikuncode.cc"]')

iframe.addEventListener('load', () => {
  // Get the current theme (adjust to match your parent site's logic)
  const isDark = document.documentElement.classList.contains('dark')
  const theme = isDark ? 'dark' : 'light'

  // Send the initial theme
  iframe.contentWindow.postMessage({
    type: 'theme-change',
    theme: theme
  }, 'https://api.ikuncode.cc')
})
```

---

## 🎯 Complete Example (Recommended)

Combine URL parameter initialization with dynamic postMessage sync:

```html
<script>
// 1. Get the current theme
function getCurrentTheme() {
  // Adjust to match your parent site's theme detection logic
  const isDark = document.documentElement.classList.contains('dark')
              || document.body.classList.contains('dark-mode')
              || localStorage.getItem('theme') === 'dark'
  return isDark ? 'dark' : 'light'
}

// 2. Create an iframe with the theme parameter
function createIframe() {
  const iframe = document.createElement('iframe')
  const currentTheme = getCurrentTheme()
  iframe.src = `https://api.ikuncode.cc/?theme=${currentTheme}`
  iframe.style.width = '100%'
  iframe.style.height = '600px'
  iframe.style.border = 'none'

  // 3. After the iframe loads, set up a MutationObserver to watch for theme changes
  iframe.addEventListener('load', () => {
    setupThemeSync(iframe)
  })

  document.getElementById('iframe-container').appendChild(iframe)
}

// 4. Set up theme sync
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

// 5. Create the iframe on page load
window.addEventListener('DOMContentLoaded', createIframe)
</script>

<div id="iframe-container"></div>
```

---

## 🔒 Security Considerations

### 1. Validate the Message Origin (Optional)
If you're concerned about security, you can add origin validation on the iframe side. Update the postMessage listener in `src/App.tsx`:

```typescript
const handleMessage = (event: MessageEvent) => {
  // 🔒 Only accept messages from a specific origin
  if (event.origin !== 'https://your-parent-domain.com') return

  if (event.data?.type === 'theme-change') {
    // ...
  }
}
```

### 2. Use targetOrigin
When the parent window sends a message, explicitly specify the target origin (as shown in the examples above):

```javascript
iframe.contentWindow.postMessage(message, 'https://api.ikuncode.cc')
// Do not use '*' as the targetOrigin
```

---

## 🧪 Testing Steps

1. **Initial Load Test**
   - Load the page in light mode; the iframe should render in light mode
   - Load the page in dark mode; the iframe should render in dark mode

2. **Dynamic Switching Test**
   - Click the theme toggle on the parent site
   - The iframe page should immediately switch to the matching theme
   - Toggle multiple times to verify sync stability

3. **Cross-Tab Test**
   - Open the page in a new tab and verify theme consistency
   - Refresh the page and verify theme persistence

---

## ❓ FAQ

### Q1: postMessage isn't working?
- Make sure the iframe has finished loading (use `iframe.addEventListener('load')`)
- Check the console for cross-origin errors
- Confirm the message format is correct: `{ type: 'theme-change', theme: 'dark' | 'light' }`

### Q2: How do I debug postMessage?
Add logging on both the parent window and iframe sides:

```javascript
// Parent window
iframe.contentWindow.postMessage(message, 'https://api.ikuncode.cc')
console.log('Sent theme message:', message)

// iframe side (inside handleMessage in App.tsx)
console.log('Received theme message:', event.data, 'origin:', event.origin)
```

### Q3: Theme switching feels delayed?
- postMessage is asynchronous, but the latency is usually negligible (< 10ms)
- If the delay is noticeable, check whether you have heavy CSS transition animations

---

## 📚 Related Documentation

- [MDN - Window.postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [MDN - MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [CLAUDE.md - Project Architecture](./CLAUDE.md)
