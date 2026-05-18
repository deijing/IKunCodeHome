import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  Github,
  Globe,
  Moon,
  Sun,
} from 'lucide-react'
import MagneticButton from './components/MagneticButton'
import IkunEasterEgg from './components/IkunEasterEgg'

// ==================== 类型定义 ====================
interface ContainerProps {
  children: React.ReactNode
  delay?: number
}

interface ToolSupport {
  name: string
  tag: string
  color: string
  desc: string
  descEn: string
  logo: string
}

interface NavItem {
  label: string
  labelEn: string
  href: string
  external?: boolean
}

interface Translations {
  nav: NavItem[]
  hero: {
    badge: string
    title: string
    titleLight: string
    subtitle: string
    subtitleHighlight: string
    description: string
    ctaPrimary: string
    ctaSecondary: string
    ctaStatus: string
    replaceBaseUrl: string
  }
  terminal: {
    comment1: string
    comment2: string
  }
  tools: {
    title: string
    subtitle: string
    learnConfig: string
  }
  contact: {
    supportTitle: string
    supportMessage: string
    commitment: string
  }
  aria: {
    toggleLang: string
    toggleTheme: string
    copyUrl: string
  }
  easterEgg: {
    activated: string
    tagline: string
  }
  footer: {
    description: string
    resourcesTitle: string
    communityTitle: string
    copyright: string
    privacy: string
    terms: string
    status: string
  }
}

// ==================== 常量配置 ====================
const NAV_ITEMS: NavItem[] = [
  { label: '服务', labelEn: 'Services', href: 'https://api.ikuncode.cc/', external: false },
  { label: '定价', labelEn: 'Pricing', href: '#pricing', external: false },
  { label: '文档', labelEn: 'Docs', href: 'https://docs.ikuncode.cc/', external: true },
  { label: '状态', labelEn: 'Status', href: 'https://status.ikuncode.cc/status/api', external: true },
]

const TRANSLATIONS: Record<'zh' | 'en', Translations> = {
  zh: {
    nav: NAV_ITEMS,
    hero: {
      badge: 'v2.0 Beta 现已开放',
      title: 'IKun',
      titleLight: 'Code',
      subtitle: '专注于给编码人员生产提效的',
      subtitleHighlight: '中转站',
      description: '支持 Claude Code、CodeX、Gemini CLI 三大 AI 编程工具。\n开箱即用、价格实惠、专业运营，让开发者只关注代码本身。',
      ctaPrimary: '快速接入',
      ctaSecondary: '浏览文档',
      ctaStatus: '状态检测',
      replaceBaseUrl: '替换基础 URL 即可接入',
    },
    terminal: {
      comment1: '// 1秒配置 Claude Code',
      comment2: '# 以光速开始编码',
    },
    tools: {
      title: '原生支持\n极致工具链',
      subtitle: '深度优化 API 路由，确保在 CLI 环境下依然拥有流畅的流式交互体验。',
      learnConfig: '查看配置',
    },
    contact: {
      supportTitle: '需要帮助？',
      supportMessage: '如需获取帮助，请联系',
      commitment: '专属客服通道 · 实时技术支持',
    },
    aria: {
      toggleLang: '切换语言',
      toggleTheme: '切换主题',
      copyUrl: '复制 URL',
    },
    easterEgg: {
      activated: 'IKUN MODE ACTIVATED',
      tagline: '懂的都懂',
    },
    footer: {
      description: '为编码效率而生，用技术驱动生产力。我们不仅提供 API，更提供稳定的编程伴侣。',
      resourcesTitle: 'Resources',
      communityTitle: 'Community',
      copyright: '© 2026 ikuncode. All rights reserved.',
      privacy: 'Privacy',
      terms: 'Terms',
      status: 'Status: All Operational',
    },
  },
  en: {
    nav: NAV_ITEMS,
    hero: {
      badge: 'v2.0 Beta Now Open',
      title: 'IKun',
      titleLight: 'Code',
      subtitle: 'AI API Gateway built for',
      subtitleHighlight: 'Developers',
      description: 'Native support for Claude Code, CodeX, and Gemini CLI.\nOut-of-the-box, affordable, professionally operated — so developers can focus on code itself.',
      ctaPrimary: 'Get Started',
      ctaSecondary: 'View Docs',
      ctaStatus: 'Status',
      replaceBaseUrl: 'Just swap the base URL to get started',
    },
    terminal: {
      comment1: '// Configure Claude Code in 1 second',
      comment2: '# Start coding at the speed of light',
    },
    tools: {
      title: 'Native Support\nUltimate Toolchain',
      subtitle: 'Deeply optimized API routing, ensuring smooth streaming interaction even inside the CLI.',
      learnConfig: 'Learn Config',
    },
    contact: {
      supportTitle: 'Need Help?',
      supportMessage: 'For assistance, please contact',
      commitment: 'Dedicated Support Channel · Real-time Technical Assistance',
    },
    aria: {
      toggleLang: 'Toggle language',
      toggleTheme: 'Toggle theme',
      copyUrl: 'Copy URL',
    },
    easterEgg: {
      activated: 'IKUN MODE ACTIVATED',
      tagline: 'If you know, you know',
    },
    footer: {
      description: 'Born for coding efficiency, driven by technology. We provide not only API, but also a reliable coding companion.',
      resourcesTitle: 'Resources',
      communityTitle: 'Community',
      copyright: '© 2026 ikuncode. All rights reserved.',
      privacy: 'Privacy',
      terms: 'Terms',
      status: 'Status: All Operational',
    },
  },
}


const TOOL_SUPPORTS: ToolSupport[] = [
  {
    name: 'Claude Code',
    tag: 'Anthropic',
    color: 'text-amber-400',
    desc: '代码执行能力强劲，高效理解需求，快速生成精准代码。',
    descEn: 'Powerful code execution, efficient requirement understanding, and rapid generation of accurate code.',
    logo: '/images/Anthropic.png',
  },
  {
    name: 'CodeX',
    tag: 'OpenAI',
    color: 'text-blue-400',
    desc: '深度思考模式，慢工出细活，复杂逻辑处理更严谨。',
    descEn: 'Deep-thinking mode — slow but precise, with rigorous handling of complex logic.',
    logo: '/images/openai.png',
  },
  {
    name: 'Gemini CLI',
    tag: 'Google AI',
    color: 'text-purple-400',
    desc: '前端能力顶尖，UI/UX 设计与实现一步到位，视觉效果出众。',
    descEn: 'Top-tier frontend capability — UI/UX design and implementation in one step, with stunning visuals.',
    logo: '/images/gemini-ai.png',
  },
]

// 定价数据现在直接内联在表格中渲染

// ==================== 工具函数 ====================
function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return true

  // 1. 优先从 URL 参数读取主题（用于 iframe 嵌套场景）
  const urlParams = new URLSearchParams(window.location.search)
  const urlTheme = urlParams.get('theme')
  if (urlTheme === 'dark') return true
  if (urlTheme === 'light') return false

  // 2. 其次从 localStorage 读取
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') return true
  if (saved === 'light') return false

  // 3. 最后使用系统偏好
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true
}

function getInitialLang(): 'zh' | 'en' {
  if (typeof window === 'undefined') return 'en'

  // 1. URL 参数优先（用于 iframe 嵌套）
  const urlParams = new URLSearchParams(window.location.search)
  const urlLang = urlParams.get('lang')
  if (urlLang === 'zh' || urlLang === 'en') return urlLang

  // 2. localStorage 中保存的选择（用户已显式切换过）
  const saved = localStorage.getItem('lang')
  if (saved === 'zh' || saved === 'en') return saved

  // 3. 默认英文
  return 'en'
}

// ==================== 动画常量 ====================
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const
const TOOL_GLOW_CLASSES = ['hover-glow-amber', 'hover-glow-blue', 'hover-glow-purple'] as const

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: EASE_OUT_EXPO },
  },
}

// ==================== 子组件 ====================
const Container: React.FC<ContainerProps> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true }}
    transition={{ duration: 1, delay, ease: EASE_OUT_EXPO }}
  >
    {children}
  </motion.div>
)

// ==================== 主组件 ====================
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme)
  const [lang, setLang] = useState<'zh' | 'en'>(getInitialLang)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [copied, setCopied] = useState(false)
  const [apiPathIndex, setApiPathIndex] = useState(0)

  const t = TRANSLATIONS[lang]

  const API_PATHS = ['/v1beta/models', '/v1/messages', '/v1/chat/completions']

  // 鼠标位置追踪
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // 主题切换
  useEffect(() => {
    const root = document.documentElement

    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  // 监听父窗口的主题变化（用于 iframe 嵌套场景）
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 安全检查：验证消息来源（可根据实际情况调整允许的来源）
      // 如果你的主站域名固定，建议添加来源验证：
      // if (event.origin !== 'https://your-parent-domain.com') return

      // 处理主题变化消息（兼容多种格式）
      let newTheme: string | undefined

      // 格式1: { type: 'theme-change', theme: 'dark' | 'light' }（标准格式）
      if (event.data?.type === 'theme-change') {
        newTheme = event.data.theme
      }
      // 格式2: { themeMode: 'dark' | 'light' }（newapi 格式）
      else if (event.data?.themeMode) {
        newTheme = event.data.themeMode
      }

      // 应用主题
      if (newTheme === 'dark') {
        setIsDarkMode(true)
      } else if (newTheme === 'light') {
        setIsDarkMode(false)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // 语言切换
  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  // API 路径轮播
  useEffect(() => {
    const interval = setInterval(() => {
      setApiPathIndex((prev) => (prev + 1) % API_PATHS.length)
    }, 2500) // 每2.5秒切换一次

    return () => clearInterval(interval)
  }, [API_PATHS.length])

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev)
  }, [])

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'))
  }, [])

  return (
    <div
      className={`min-h-screen selection:bg-amber-500/30 transition-colors duration-1000 ${
        isDarkMode ? 'bg-[#0a0a0f] text-zinc-100' : 'bg-[#fafafa] text-zinc-900'
      }`}
    >
      {/* 背景装饰 */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* 网格背景 */}
        <div
          className={`absolute inset-0 opacity-[0.03] ${isDarkMode ? 'invert-0' : 'invert'}`}
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* 渐变遮罩 */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${
            isDarkMode
              ? 'from-transparent via-[#0a0a0f]/50 to-[#0a0a0f]'
              : 'from-transparent via-white/50 to-white'
          }`}
        />

        {/* 鼠标跟随聚光灯效果 */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${
              isDarkMode ? 'rgba(251, 191, 36, 0.15)' : 'rgba(251, 191, 36, 0.08)'
            } 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: mousePosition.x - 300,
            y: mousePosition.y - 300,
          }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 200,
            mass: 0.5,
          }}
        />

        {/* 动态流光 */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"
        />

        {/* Noise texture overlay for premium feel */}
        <div className="absolute inset-0 noise-overlay opacity-[0.15] mix-blend-overlay pointer-events-none" />
      </div>

      {/* 语言和主题切换按钮 */}
      <div className="absolute top-20 right-8 z-50 flex items-center gap-4 pointer-events-auto">
        <button
          type="button"
          onClick={toggleLang}
          className="px-3 py-2 opacity-60 hover:opacity-100 rounded-lg transition-all flex items-center justify-center gap-2"
          aria-label={t.aria.toggleLang}
        >
          <Globe size={18} />
          <span className="text-sm font-medium">{lang === 'zh' ? 'EN' : '中文'}</span>
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 opacity-60 hover:opacity-100 rounded-lg transition-all flex items-center justify-center"
          aria-label={t.aria.toggleTheme}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <main className="relative z-10">
        {/* Hero 区域 */}
        <section className="min-h-[100svh] flex items-center relative px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          {/* Hero gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] bg-amber-500/20 rounded-full blur-[150px]" />
            <div className="absolute top-1/3 -right-1/4 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-purple-500/15 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-blue-500/10 rounded-full blur-[150px]" />
          </div>

          <div className="max-w-[1400px] mx-auto w-full">
              {/* Premium Badge */}
              <motion.div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-xl saturate-150 mb-8 sm:mb-10 ${
                  isDarkMode
                    ? 'bg-white/[0.03] border-white/[0.08] text-zinc-500'
                    : 'bg-black/[0.02] border-black/[0.06] text-zinc-500'
                }`}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.2, duration: 0.8, ease: EASE_OUT_EXPO }}
              >
                <span className="text-[10px] sm:text-xs font-medium tracking-[0.15em] uppercase">
                  Sing · Dance · Rap · Code
                </span>
              </motion.div>

              <h1 className="text-[clamp(3rem,14vw,9rem)] font-black leading-[0.85] tracking-[-0.05em] mb-8 sm:mb-10 lg:mb-14">
                <span className="overflow-hidden inline-block">
                  <motion.span
                    className="inline-block bg-gradient-to-br from-[#d4af37] via-[#c9a227] to-[#b8860b] bg-clip-text text-transparent"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT_EXPO }}
                  >
                    {t.hero.title}
                  </motion.span>
                </span>
                <span className="overflow-hidden inline-block">
                  <motion.span
                    className={`inline-block font-light italic ${isDarkMode ? 'text-zinc-700' : 'text-zinc-300'}`}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT_EXPO }}
                  >
                    {t.hero.titleLight}
                  </motion.span>
                </span>
              </h1>

            <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20 items-start lg:items-center justify-between">
              <Container delay={0.2}>
                <div className="max-w-2xl space-y-4 sm:space-y-6 lg:space-y-8">
                  <p className="text-[clamp(1.75rem,5vw,3.5rem)] font-light leading-snug tracking-[-0.03em]">
                    {t.hero.subtitle}
                    <span className="font-black border-b-2 border-amber-500/30">{lang === 'zh' ? t.hero.subtitleHighlight : ` ${t.hero.subtitleHighlight}`}</span>
                  </p>
                  <p
                    className={`text-base sm:text-lg opacity-50 font-light leading-relaxed ${
                      isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
                    }`}
                  >
                    {t.hero.description.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < t.hero.description.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>

                  <div className="pt-8 sm:pt-10 flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6">
                    <MagneticButton
                      href="https://api.ikuncode.cc/console"
                      className={`relative flex items-center gap-2 sm:gap-3 lg:gap-4 group font-semibold tracking-wider text-xs sm:text-sm uppercase px-6 sm:px-8 py-3.5 sm:py-4 backdrop-blur-xl ${
                        isDarkMode
                          ? 'bg-white/[0.08] text-white/90 border border-white/[0.12]'
                          : 'bg-black/[0.04] text-black/90 border border-black/[0.08]'
                      }`}
                    >
                      {t.hero.ctaPrimary}{' '}
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </MagneticButton>
                    <div className={`flex items-center gap-4 sm:gap-5 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 border ${
                      isDarkMode ? 'border-white/[0.1] bg-white/[0.03]' : 'border-black/[0.08] bg-black/[0.02]'
                    }`}>
                      <a
                        href="https://docs.ikuncode.cc/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm font-bold opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2"
                      >
                        <Github size={16} className="sm:w-[18px] sm:h-[18px]" /> {t.hero.ctaSecondary}
                      </a>
                      <span className={`w-px h-4 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />
                      <a
                        href="https://status.ikuncode.cc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm font-bold opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2"
                      >
                        <Activity size={16} className="sm:w-[18px] sm:h-[18px]" /> {t.hero.ctaStatus}
                      </a>
                    </div>
                  </div>

                  {/* API URL 配置展示区域 */}
                  <div className="mt-14 sm:mt-8 lg:mt-20">
                    <p className={`text-xs sm:text-sm font-medium mb-3 sm:mb-4 flex items-center gap-2 ${
                      isDarkMode ? 'text-zinc-500' : 'text-zinc-500'
                    }`}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t.hero.replaceBaseUrl}
                    </p>

                    {/* Outer wrapper with glow */}
                    <div className="relative group/url">
                      {/* Ambient glow */}
                      <motion.div
                        className={`absolute -inset-1 rounded-2xl sm:rounded-3xl blur-xl pointer-events-none ${
                          isDarkMode
                            ? 'bg-gradient-to-r from-amber-500/15 via-blue-500/10 to-purple-500/15'
                            : 'bg-gradient-to-r from-amber-400/10 via-blue-400/8 to-purple-400/10'
                        }`}
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      />

                      {/* Main container */}
                      <div
                        className={`relative flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl border overflow-hidden backdrop-blur-xl backdrop-saturate-150 ${
                          isDarkMode
                            ? 'bg-[#0f0f14]/90 border-white/[0.08] group-hover/url:border-amber-500/25'
                            : 'bg-white/80 border-black/[0.08] group-hover/url:border-amber-500/30'
                        } transition-all duration-500`}
                      >
                        {/* Shimmer sweep effect */}
                        <div
                          className={`absolute inset-0 z-0 pointer-events-none animate-shimmer ${
                            isDarkMode
                              ? 'bg-gradient-to-r from-transparent via-white/[0.04] to-transparent'
                              : 'bg-gradient-to-r from-transparent via-black/[0.03] to-transparent'
                          }`}
                          style={{ width: '40%' }}
                        />

                        {/* URL content */}
                        <div className="relative z-10 flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                          <code className={`text-[11px] sm:text-sm lg:text-base font-mono tracking-tight whitespace-nowrap flex-shrink-0 ${
                            isDarkMode ? 'text-zinc-500' : 'text-zinc-500'
                          }`}>
                            https://api.ikuncode.cc
                          </code>
                          <div className="relative h-5 sm:h-6 flex items-center">
                            {/* 不可见占位：用最长路径撑开容器宽度 */}
                            <code className="invisible text-xs sm:text-sm lg:text-base font-mono font-semibold whitespace-nowrap" aria-hidden="true">
                              {API_PATHS.reduce((a, b) => a.length >= b.length ? a : b)}
                            </code>
                            <AnimatePresence mode="wait">
                              <motion.code
                                key={API_PATHS[apiPathIndex]}
                                className="absolute left-0 text-xs sm:text-sm lg:text-base font-mono font-semibold whitespace-nowrap bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent"
                                initial={{ y: 18, opacity: 0, filter: 'blur(6px)' }}
                                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                                exit={{ y: -18, opacity: 0, filter: 'blur(6px)' }}
                                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                              >
                                {API_PATHS[apiPathIndex]}
                              </motion.code>
                            </AnimatePresence>
                          </div>
                          {/* Blinking cursor */}
                          <motion.span
                            className="hidden sm:inline-block w-[2px] h-4 sm:h-5 rounded-full bg-amber-500/70 flex-shrink-0"
                            animate={{ opacity: [1, 0.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'steps(2)' }}
                          />
                        </div>

                        {/* Path indicator dots */}
                        <div className="relative z-10 hidden sm:flex items-center gap-1.5 mr-1 sm:mr-2 flex-shrink-0">
                          {API_PATHS.map((_, i) => (
                            <motion.div
                              key={i}
                              className="rounded-full"
                              animate={{
                                width: i === apiPathIndex ? 12 : 4,
                                height: 4,
                                backgroundColor: i === apiPathIndex
                                  ? '#f59e0b'
                                  : isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                              }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                            />
                          ))}
                        </div>

                        {/* Copy button */}
                        <motion.button
                          type="button"
                          className={`relative z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex-shrink-0 ${
                            copied
                              ? 'bg-emerald-500/15'
                              : isDarkMode
                                ? 'bg-white/5 hover:bg-white/10'
                                : 'bg-black/5 hover:bg-black/10'
                          } transition-colors duration-300 relative overflow-hidden`}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          aria-label={t.aria.copyUrl}
                          onClick={() => {
                            const text = 'https://api.ikuncode.cc'
                            const fallbackCopy = () => {
                              const textarea = document.createElement('textarea')
                              textarea.value = text
                              textarea.style.position = 'fixed'
                              textarea.style.opacity = '0'
                              document.body.appendChild(textarea)
                              textarea.select()
                              document.execCommand('copy')
                              document.body.removeChild(textarea)
                              setCopied(true)
                              setTimeout(() => setCopied(false), 2000)
                            }
                            if (navigator.clipboard && window.isSecureContext) {
                              navigator.clipboard.writeText(text).then(() => {
                                setCopied(true)
                                setTimeout(() => setCopied(false), 2000)
                              }).catch(fallbackCopy)
                            } else {
                              fallbackCopy()
                            }
                          }}
                        >
                          <AnimatePresence mode="wait">
                            {copied ? (
                              <motion.div
                                key="check"
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 90 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                              >
                                <Check size={16} className="text-emerald-500 sm:w-[18px] sm:h-[18px]" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="copy"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <Copy size={16} className="opacity-50 sm:w-[18px] sm:h-[18px]" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </Container>

              {/* 终端演示卡片 */}
              <Container delay={0.3}>
                <motion.div
                  className={`relative group -mt-8 sm:mt-0 lg:-mt-12 mx-auto lg:mx-0 p-0.5 sm:p-1 rounded-2xl sm:rounded-3xl border ${
                    isDarkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/5'
                  } backdrop-blur-3xl shadow-2xl overflow-hidden`}
                  whileHover={{
                    scale: 1.02,
                    rotateX: 2,
                    rotateY: 2,
                    transition: { duration: 0.3 },
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div
                    className={`rounded-xl sm:rounded-2xl overflow-hidden ${
                      isDarkMode ? 'bg-[#0a0a0f]/80' : 'bg-zinc-50'
                    } p-4 sm:p-6 lg:p-8 font-mono text-xs sm:text-sm w-full max-w-[calc(100vw-2rem)] sm:min-w-[320px] md:min-w-[480px]`}
                  >
                    <div className="flex justify-between items-center mb-4 sm:mb-6 lg:mb-8">
                      <div className="flex gap-1.5 sm:gap-2">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/40" />
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500/40" />
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500/40" />
                      </div>
                      <span className="text-[8px] sm:text-[10px] opacity-30 tracking-widest uppercase">
                        terminal — node
                      </span>
                    </div>
                    <div className="space-y-2 sm:space-y-3 opacity-90 overflow-x-auto">
                      <p className="text-zinc-600 whitespace-nowrap">{t.terminal.comment1}</p>
                      <p className="whitespace-nowrap">
                        <span className="text-amber-500">export</span>{' '}
                        <span className="text-blue-400">ANTHROPIC_BASE_URL</span>=
                        <span className="text-emerald-500">&quot;https://api.ikuncode.cc&quot;</span>
                      </p>
                      <p className="whitespace-nowrap">
                        <span className="text-amber-500">export</span>{' '}
                        <span className="text-blue-400">ANTHROPIC_API_KEY</span>=
                        <span className="text-emerald-500">&quot;sk-...&quot;</span>
                      </p>
                      <p className="pt-2 sm:pt-4 text-zinc-600 whitespace-nowrap">{t.terminal.comment2}</p>
                      <p className="whitespace-nowrap">
                        <span className="text-zinc-400">$</span> claude
                      </p>
                      <div className="h-3 sm:h-4 w-1 bg-amber-500 animate-pulse inline-block" />
                    </div>
                  </div>
                </motion.div>
              </Container>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <span className={`text-[10px] tracking-[0.2em] uppercase font-medium ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Scroll
            </span>
            <motion.div
              className={`w-5 h-8 rounded-full border-2 flex justify-center pt-1.5 ${
                isDarkMode ? 'border-zinc-700' : 'border-zinc-300'
              }`}
            >
              <motion.div
                className="w-1 h-1.5 rounded-full bg-amber-500"
                animate={{ opacity: [1, 0], y: [0, 8] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* 工具支持网格 */}
        <section
          className={`py-24 sm:py-32 lg:py-40 relative ${
            isDarkMode ? 'bg-white/[0.02]' : 'bg-zinc-50/50'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 divider-gradient" />
          <div className="absolute bottom-0 left-0 right-0 divider-gradient" />

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 sm:mb-20 lg:mb-24 gap-4 sm:gap-6">
              <Container>
                <h2 className="text-[clamp(1.75rem,5vw,3.5rem)] font-black tracking-[-0.03em] whitespace-pre-line">
                  {t.tools.title}
                </h2>
              </Container>
              <Container delay={0.1}>
                <p className="max-w-xs text-xs sm:text-sm opacity-40 font-light">
                  {t.tools.subtitle}
                </p>
              </Container>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {TOOL_SUPPORTS.map((tool, i) => (
                <motion.div key={tool.name} variants={staggerItem}>
                  <motion.div
                    className={`p-8 sm:p-10 lg:p-12 rounded-2xl sm:rounded-[2rem] border ${TOOL_GLOW_CLASSES[i]} ${
                      isDarkMode
                        ? 'bg-[#0f0f14] border-white/[0.06] hover:border-white/[0.15] card-inner-glow'
                        : 'bg-white border-black/5 hover:shadow-2xl'
                    } transition-all duration-500 group cursor-pointer`}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <motion.div
                      className="mb-6 sm:mb-8"
                      whileHover={{
                        scale: 1.15,
                        rotate: 8,
                        transition: { duration: 0.3 },
                      }}
                    >
                      <img
                        src={tool.logo}
                        alt={tool.name}
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                      />
                    </motion.div>
                    <span
                      className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] ${tool.color} mb-4 sm:mb-6 block`}
                    >
                      {tool.tag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-3 sm:mb-4">{tool.name}</h3>
                    <p className="opacity-40 text-sm sm:text-base font-light leading-relaxed mb-6 sm:mb-8">{lang === 'zh' ? tool.desc : tool.descEn}</p>
                    <a
                      href="https://api.ikuncode.cc/pricing"
                      target="_top"
                      className="flex items-center gap-2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {t.tools.learnConfig.toUpperCase()} <ChevronRight size={14} />
                    </a>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>


        {/* 页脚 */}
        <footer
          className={`pt-24 sm:pt-32 lg:pt-40 pb-8 sm:pb-12 lg:pb-16 relative ${
            isDarkMode ? 'bg-white/[0.02]' : 'bg-zinc-50'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 divider-gradient" />

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* 联系方式区域 */}
            <div className="text-center mb-16 sm:mb-20 lg:mb-24">
              <motion.div
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE_OUT_EXPO }}
              >
                {/* Logo */}
                <h2 className="text-[clamp(3rem,10vw,7rem)] font-black mb-6 sm:mb-8 tracking-[-0.04em]">
                  IKunCode
                </h2>

                {/* 支持邮箱 */}
                <div className="flex flex-col items-center gap-3 sm:gap-4 mb-10 sm:mb-14">
                  <p className="text-base sm:text-xl lg:text-2xl font-bold opacity-70">
                    {t.contact.supportTitle}
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg opacity-60 font-light">
                    {t.contact.supportMessage}{' '}
                    <a
                      href="mailto:support@ikuncode.cc"
                      className="font-mono font-bold text-amber-500 hover:text-amber-400 transition-colors"
                    >
                      support@ikuncode.cc
                    </a>
                  </p>
                </div>

                {/* 服务承诺 */}
                <p className="text-[10px] sm:text-xs opacity-40 tracking-[0.15em] uppercase font-medium">
                  {t.contact.commitment}
                </p>
              </motion.div>
            </div>

            {/* 版权信息 */}
            <div className="text-center pt-6 sm:pt-8">
              <div className="divider-gradient mb-6 sm:mb-8" />
              <p className="text-[10px] sm:text-xs opacity-30 tracking-[0.15em] uppercase">
                {t.footer.copyright}
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* JNTM Easter Egg - 懂的都懂 */}
      <IkunEasterEgg isDarkMode={isDarkMode} lang={lang} />
    </div>
  )
}
