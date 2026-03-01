import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Github,
  Globe,
  Moon,
  Sparkles,
  Sun,
  Terminal,
} from 'lucide-react'
import MagneticButton from './components/MagneticButton'
import IkunEasterEgg from './components/IkunEasterEgg'

// ==================== 类型定义 ====================
interface ContainerProps {
  children: React.ReactNode
  delay?: number
}

interface Feature {
  icon: React.ReactNode
  title: string
  desc: string
}

interface ToolSupport {
  name: string
  tag: string
  color: string
  desc: string
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
    description: string
    ctaPrimary: string
    ctaSecondary: string
  }
  terminal: {
    comment1: string
    comment2: string
  }
  tools: {
    title: string
    subtitle: string
  }
  pricing: {
    title: string
    subtitle: string
    btnContact: string
    btnGetStarted: string
  }
  tokenGroups: {
    title: string
    subtitle: string
    groups: {
      name: string
      desc: string
      tag: string
      highlight?: boolean
    }[]
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
      description: '支持 Claude Code、CodeX、Gemini CLI 三大 AI 编程工具。\n开箱即用、价格实惠、专业运营，让开发者只关注代码本身。',
      ctaPrimary: '快速接入',
      ctaSecondary: '浏览文档',
    },
    terminal: {
      comment1: '// 1秒配置 Claude Code',
      comment2: '# 以光速开始编码',
    },
    tools: {
      title: '原生支持\n极致工具链',
      subtitle: '深度优化 API 路由，确保在 CLI 环境下依然拥有流畅的流式交互体验。',
    },
    pricing: {
      title: '开箱即用，价格实惠',
      subtitle: 'Fair pricing for every dev',
      btnContact: '联系我们',
      btnGetStarted: '立即开始',
    },
    tokenGroups: {
      title: '分组令牌说明',
      subtitle: '根据您的需求选择合适的分组，获得最佳性价比',
      groups: [
        {
          name: 'Claude Code 专用',
          desc: '🔥 自动跟随用户分组倍率，无需手动切换 Key！一个 Key 搞定所有场景，省心省力。',
          tag: '⭐ 推荐',
          highlight: true,
        },
        {
          name: 'Codex 专用',
          desc: '专为 OpenAI Codex 工具优化，稳定高效。',
          tag: 'Codex',
        },
        {
          name: 'CC 逆向分组',
          desc: '基于第三方平台逆向的分组，稳定性略差，价格低。',
          tag: '经济实惠',
        },
        {
          name: 'Gemini CLI 专用',
          desc: 'gemini-cli-反重力，专为 Gemini CLI 工具优化。',
          tag: 'Gemini',
        },
        {
          name: 'Grok 搜索利器',
          desc: '集成 MCP 协议的网页搜索引擎，Claude → MCP → Grok API → 搜索/抓取 → 结构化返回，固定倍率 0.1x。',
          tag: '🔍 搜索',
        },
      ],
    },
    footer: {
      description: '为编码效率而生，用技术驱动生产力。我们不仅提供 API，更提供稳定的编程伴侣。',
      resourcesTitle: 'Resources',
      communityTitle: 'Community',
      copyright: '© 2026 IKunCode Cloud. Professional Operation.',
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
      subtitle: 'AI API Gateway for',
      description: 'Support Claude Code, CodeX, Gemini CLI.\nOut-of-the-box, affordable pricing, professional operation.',
      ctaPrimary: 'Get Started',
      ctaSecondary: 'View Docs',
    },
    terminal: {
      comment1: '// Setup Claude Code in 1s',
      comment2: '# Start coding with speed of light',
    },
    tools: {
      title: 'Native Support\nUltimate Toolchain',
      subtitle: 'Deeply optimized API routing for smooth streaming in CLI.',
    },
    pricing: {
      title: 'Simple & Affordable Pricing',
      subtitle: 'Fair pricing for every dev',
      btnContact: 'Contact Us',
      btnGetStarted: 'Get Started',
    },
    tokenGroups: {
      title: 'Token Group Guide',
      subtitle: 'Choose the right group for your needs and get the best value',
      groups: [
        {
          name: 'Claude Code Dedicated',
          desc: '🔥 Auto-sync with your user tier rate! One Key for all scenarios, hassle-free.',
          tag: '⭐ Recommended',
          highlight: true,
        },
        {
          name: 'Codex Dedicated',
          desc: 'Optimized for OpenAI Codex tools, stable and efficient.',
          tag: 'Codex',
        },
        {
          name: 'CC Reverse Group',
          desc: 'Reverse groups from third-party platforms, slightly less stable, lower price.',
          tag: 'Budget',
        },
        {
          name: 'Gemini CLI Dedicated',
          desc: 'gemini-cli-antigravity, optimized for Gemini CLI tools.',
          tag: 'Gemini',
        },
        {
          name: 'Grok Search Engine',
          desc: 'Integrated MCP web search engine, Claude → MCP → Grok API → Search/Fetch → Structured Return, fixed rate 0.1x.',
          tag: '🔍 Search',
        },
      ],
    },
    footer: {
      description: 'Born for coding efficiency, driven by technology. We provide not only API, but also a reliable coding companion.',
      resourcesTitle: 'Resources',
      communityTitle: 'Community',
      copyright: '© 2026 IKunCode Cloud. Professional Operation.',
      privacy: 'Privacy',
      terms: 'Terms',
      status: 'Status: All Operational',
    },
  },
}

const FEATURES: Feature[] = [
  {
    icon: <Code2 className="w-5 h-5 text-amber-400" />,
    title: '极致编码提效',
    desc: '专为程序员优化的响应链路，支持流式输出，让代码生成几乎零感知延迟。',
  },
  {
    icon: <Terminal className="w-5 h-5 text-emerald-400" />,
    title: '多端完美适配',
    desc: '完美集成 Claude Code, CodeX, Gemini CLI 等生产力工具，一键替换 API 地址即可起飞。',
  },
  {
    icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
    title: '价格实惠透明',
    desc: '无套路按量计费，不仅比官方更便宜，更提供详尽的消耗看板，每一分钱都花在刀刃上。',
  },
]

const TOOL_SUPPORTS: ToolSupport[] = [
  {
    name: 'Claude Code',
    tag: 'Anthropic',
    color: 'text-amber-400',
    desc: '代码执行能力强劲，高效理解需求，快速生成精准代码。',
    logo: '/images/Anthropic.png',
  },
  {
    name: 'CodeX',
    tag: 'OpenAI',
    color: 'text-blue-400',
    desc: '深度思考模式，慢工出细活，复杂逻辑处理更严谨。',
    logo: '/images/openai.png',
  },
  {
    name: 'Gemini CLI',
    tag: 'Google AI',
    color: 'text-purple-400',
    desc: '前端能力顶尖，UI/UX 设计与实现一步到位，视觉效果出众。',
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
  if (typeof window === 'undefined') return 'zh'

  const saved = localStorage.getItem('lang')
  if (saved === 'zh' || saved === 'en') return saved

  return 'zh'
}

// ==================== 子组件 ====================
const Container: React.FC<ContainerProps> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
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

  // 处理分组点击 - 跳转到令牌创建页面
  const handleGroupClick = useCallback(() => {
    // 直接跳转到令牌管理页面
    window.open('https://api.ikuncode.cc/console/token', '_top')
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
          aria-label="切换语言"
        >
          <Globe size={18} />
          <span className="text-sm font-medium">{lang === 'zh' ? 'EN' : '中文'}</span>
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 opacity-60 hover:opacity-100 rounded-lg transition-all flex items-center justify-center"
          aria-label="切换主题"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <main className="relative z-10">
        {/* Hero 区域 */}
        <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1400px] mx-auto">
            <Container delay={0.1}>
              {/* Premium Badge */}
              <motion.div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-sm mb-6 sm:mb-8 ${
                  isDarkMode
                    ? 'bg-white/[0.03] border-white/[0.08] text-zinc-500'
                    : 'bg-black/[0.02] border-black/[0.06] text-zinc-500'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.25em] uppercase">
                  Sing · Dance · Rap · Code
                </span>
              </motion.div>

              <h1 className="text-[clamp(2.5rem,12vw,8rem)] font-bold leading-[0.9] tracking-[-0.04em] mb-6 sm:mb-8 lg:mb-12">
                <span className="bg-gradient-to-br from-[#d4af37] via-[#c9a227] to-[#b8860b] bg-clip-text text-transparent">
                  {t.hero.title}
                </span>
                <span className={`font-light italic ${isDarkMode ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  {t.hero.titleLight}
                </span>
              </h1>
            </Container>

            <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20 items-start lg:items-center justify-between">
              <Container delay={0.2}>
                <div className="max-w-2xl space-y-4 sm:space-y-6 lg:space-y-8">
                  <p className="text-xl sm:text-2xl md:text-3xl font-light leading-snug tracking-tight">
                    {t.hero.subtitle}
                    <span className="font-bold border-b border-amber-500/30">{lang === 'zh' ? '中转站' : ' Developers'}</span>
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

                  <div className="pt-4 sm:pt-6 flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6">
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
                    <a
                      href="https://docs.ikuncode.cc/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-bold opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2"
                    >
                      <Github size={16} className="sm:w-[18px] sm:h-[18px]" /> {t.hero.ctaSecondary}
                    </a>
                  </div>

                  {/* API URL 配置展示区域 */}
                  <div className="mt-14 sm:mt-8 lg:mt-20">
                    <p className={`text-xs sm:text-sm font-medium mb-3 sm:mb-4 flex items-center gap-2 ${
                      isDarkMode ? 'text-zinc-500' : 'text-zinc-500'
                    }`}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      替换基础 URL 即可接入
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
                        className={`relative flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl border overflow-hidden backdrop-blur-xl ${
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
                          aria-label="复制 URL"
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
                        <span className="text-emerald-500">&quot;sk-ikun-...&quot;</span>
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
        </section>

        {/* 工具支持网格 */}
        <section
          className={`py-16 sm:py-24 lg:py-32 border-y ${
            isDarkMode ? 'border-white/[0.04] bg-white/[0.02]' : 'border-black/5 bg-zinc-50/50'
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 sm:mb-16 lg:mb-20 gap-4 sm:gap-6">
              <Container>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter whitespace-pre-line">
                  {t.tools.title}
                </h2>
              </Container>
              <Container delay={0.1}>
                <p className="max-w-xs text-xs sm:text-sm opacity-40 font-medium">
                  {t.tools.subtitle}
                </p>
              </Container>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {TOOL_SUPPORTS.map((tool, i) => (
                <Container key={tool.name} delay={0.2 + i * 0.1}>
                  <motion.div
                    className={`p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2rem] border ${
                      isDarkMode
                        ? 'bg-[#0f0f14] border-white/[0.06] hover:border-white/[0.12]'
                        : 'bg-white border-black/5 hover:shadow-2xl'
                    } transition-all group cursor-pointer`}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <div className="mb-4 sm:mb-6">
                      <img
                        src={tool.logo}
                        alt={tool.name}
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                      />
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${tool.color} mb-4 sm:mb-6 block`}
                    >
                      {tool.tag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{tool.name}</h3>
                    <p className="opacity-40 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">{tool.desc}</p>
                    <a
                      href="https://api.ikuncode.cc/pricing"
                      target="_top"
                      className="flex items-center gap-2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      LEARN CONFIG <ChevronRight size={14} />
                    </a>
                  </motion.div>
                </Container>
              ))}
            </div>
          </div>
        </section>

        {/* 特性卡片 */}
        <section className="py-16 sm:py-24 lg:py-32 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className={i === 0 || i === 3 ? 'md:col-span-7' : 'md:col-span-5'}
              >
                <Container delay={i * 0.1}>
                  <motion.div
                    className={`p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl border h-full transition-all cursor-pointer ${
                      isDarkMode
                        ? 'bg-[#0f0f14] border-white/[0.06] hover:bg-[#12121a]'
                        : 'bg-white border-black/5 hover:shadow-xl'
                    }`}
                    whileHover={{
                      y: -6,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <motion.div
                      className="mb-4 sm:mb-6 lg:mb-8"
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.3 },
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{feature.title}</h3>
                    <p className="opacity-40 font-light text-sm sm:text-base leading-relaxed">{feature.desc}</p>
                  </motion.div>
                </Container>
              </div>
            ))}
          </div>
        </section>

        {/* 定价方案 */}
        <section className="py-16 sm:py-24 lg:py-32 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8" id="pricing">
          {/* 分组令牌说明 */}
          <Container>
            <div className="text-center mb-12 sm:mb-16">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3 sm:mb-4">{t.tokenGroups.title}</h3>
              <p className="opacity-60 text-sm sm:text-base max-w-2xl mx-auto">{t.tokenGroups.subtitle}</p>
            </div>
          </Container>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-24 lg:mb-32">
            {t.tokenGroups.groups.map((group, i) => (
              <Container key={group.name} delay={i * 0.1}>
                <motion.div
                  className={`relative p-6 sm:p-8 rounded-2xl border-2 transition-all h-full cursor-pointer flex flex-col ${
                    group.highlight
                      ? isDarkMode
                        ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 border-amber-500/40 hover:border-amber-400/60 ring-2 ring-amber-500/20'
                        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-amber-400/50 hover:border-amber-500/70 ring-2 ring-amber-400/30'
                      : isDarkMode
                        ? 'bg-[#0f0f14] border-white/[0.06] hover:border-white/[0.12]'
                        : 'bg-white border-black/5 hover:border-black/10'
                  }`}
                  onClick={handleGroupClick}
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* 顶部标签 */}
                  <div className="absolute -top-3 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      group.highlight
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                        : isDarkMode
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300'
                          : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600'
                    }`}>
                      {group.tag}
                    </span>
                  </div>

                  {/* 分组名称 */}
                  <h4 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${group.highlight ? 'text-amber-500' : ''}`}>{group.name}</h4>

                  {/* 分组描述 - 设置最小高度确保对齐 */}
                  <p className={`text-sm sm:text-base leading-relaxed min-h-[4.5rem] sm:min-h-[5rem] mb-6 ${group.highlight ? 'opacity-80' : 'opacity-60'}`}>{group.desc}</p>

                  {/* 点击提示 */}
                  <div className={`flex items-center justify-center gap-2 text-xs font-medium transition-opacity ${
                    isDarkMode ? 'text-amber-400/60 hover:text-amber-400' : 'text-amber-600/60 hover:text-amber-600'
                  }`}>
                    <span>点击前往令牌管理</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Container>
            ))}
          </div>

          <Container>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight">{t.pricing.title}</h2>
            </div>
          </Container>

          {/* Linear 风格定价表格 */}
          <Container delay={0.1}>
            <div className={`rounded-xl border overflow-hidden ${
              isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-black/10'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className={`border-b text-[11px] uppercase tracking-wider font-medium ${
                      isDarkMode ? 'border-white/10 text-white/40' : 'border-black/10 text-black/40'
                    }`}>
                      <th className="py-4 pl-6 pr-4 w-12">#</th>
                      <th className="py-4 px-4 w-28">分组</th>
                      <th className="py-4 px-4 w-40">倍率 (C1/C2/C3)</th>
                      <th className="py-4 px-4 w-48">特性</th>
                      <th className="py-4 px-4">说明</th>
                                          </tr>
                  </thead>
                  <tbody className="text-sm">
                    {/* Claude Code */}
                    <tr className={`border-b transition-colors ${
                      isDarkMode ? 'border-white/5 hover:bg-white/[0.02]' : 'border-black/5 hover:bg-black/[0.02]'
                    }`}>
                      <td className="py-4 pl-6 pr-4 font-mono text-xs opacity-40">01</td>
                      <td className="py-4 px-4 font-medium whitespace-nowrap">Claude Code</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded font-mono text-xs whitespace-nowrap ${
                          isDarkMode ? 'bg-white/5 border border-white/5 text-indigo-300' : 'bg-black/5 border border-black/5 text-indigo-600'
                        }`}>
                          1.5 / 1.45 / 1.4
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs opacity-60 leading-relaxed">200K上下文 + 5min缓存，仅支持CC客户端</td>
                      <td className="py-4 px-4 opacity-60 leading-relaxed text-xs">
                        优质合作伙伴独立Max号池，欢迎测试监督。
                      </td>
                    </tr>

                    {/* CC逆向 */}
                    <tr className={`border-b transition-colors ${
                      isDarkMode ? 'border-white/5 hover:bg-white/[0.02]' : 'border-black/5 hover:bg-black/[0.02]'
                    }`}>
                      <td className="py-4 pl-6 pr-4 font-mono text-xs opacity-40">02</td>
                      <td className="py-4 px-4 font-medium whitespace-nowrap">CC逆向</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded font-mono text-xs whitespace-nowrap ${
                          isDarkMode ? 'bg-white/5 border border-white/5 text-indigo-300' : 'bg-black/5 border border-black/5 text-indigo-600'
                        }`}>
                          0.4 / 0.35 / 0.35
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs opacity-60 leading-relaxed">200K上下文 + 5min缓存，支持非CC客户端</td>
                      <td className="py-4 px-4 opacity-60 leading-relaxed text-xs">
                        【近期非常不稳定】较优质低成本逆向渠道(Kiro)。服务端实现高缓存命中、网络搜索及PDF识别。
                      </td>
                    </tr>

                    {/* CC逆向2 */}
                    <tr className={`border-b transition-colors ${
                      isDarkMode ? 'border-white/5 hover:bg-white/[0.02]' : 'border-black/5 hover:bg-black/[0.02]'
                    }`}>
                      <td className="py-4 pl-6 pr-4 font-mono text-xs opacity-40">03</td>
                      <td className="py-4 px-4 font-medium whitespace-nowrap">CC逆向2</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded font-mono text-xs whitespace-nowrap ${
                          isDarkMode ? 'bg-white/5 border border-white/5 text-indigo-300' : 'bg-black/5 border border-black/5 text-indigo-600'
                        }`}>
                          0.8 / 0.75 / 0.7
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs opacity-60 leading-relaxed">200K上下文 + 5min缓存，支持非CC客户端</td>
                      <td className="py-4 px-4 opacity-60 leading-relaxed text-xs">
                        优质高成本逆向渠道，支持CC所有功能。<span className="text-amber-400">白天速度较慢</span>但缓存命中率极高。
                      </td>
                    </tr>

                    {/* Codex */}
                    <tr className={`border-b transition-colors ${
                      isDarkMode ? 'border-white/5 hover:bg-white/[0.02]' : 'border-black/5 hover:bg-black/[0.02]'
                    }`}>
                      <td className="py-4 pl-6 pr-4 font-mono text-xs opacity-40">05</td>
                      <td className="py-4 px-4 font-medium whitespace-nowrap">Codex</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded font-mono text-xs whitespace-nowrap ${
                          isDarkMode ? 'bg-white/5 border border-white/5 text-indigo-300' : 'bg-black/5 border border-black/5 text-indigo-600'
                        }`}>
                          0.2 / 0.2 / 0.2
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs opacity-60 leading-relaxed">OpenAI Codex，固定倍率</td>
                      <td className="py-4 px-4 opacity-60 leading-relaxed text-xs">
                        专为 OpenAI Codex 工具优化，所有用户统一 0.2x 固定倍率。
                      </td>
                    </tr>

                    {/* Gemini */}
                    <tr className={`border-b transition-colors ${
                      isDarkMode ? 'border-white/5 hover:bg-white/[0.02]' : 'border-black/5 hover:bg-black/[0.02]'
                    }`}>
                      <td className="py-4 pl-6 pr-4 font-mono text-xs opacity-40">06</td>
                      <td className="py-4 px-4 font-medium whitespace-nowrap">gemini</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded font-mono text-xs whitespace-nowrap ${
                          isDarkMode ? 'bg-white/5 border border-white/5 text-indigo-300' : 'bg-black/5 border border-black/5 text-indigo-600'
                        }`}>
                          0.7 / 0.7 / 0.7
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs opacity-60 leading-relaxed">gemini分组，固定倍率</td>
                      <td className="py-4 px-4 opacity-60 leading-relaxed text-xs">
                        Google Gemini 通用分组。
                      </td>
                    </tr>

                    {/* Gemini CLI 反重力 */}
                    <tr className={`border-b transition-colors ${
                      isDarkMode ? 'border-white/5 hover:bg-white/[0.02]' : 'border-black/5 hover:bg-black/[0.02]'
                    }`}>
                      <td className="py-4 pl-6 pr-4 font-mono text-xs opacity-40">07</td>
                      <td className="py-4 px-4 font-medium whitespace-nowrap">gemini-cli-反重力</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded font-mono text-xs whitespace-nowrap ${
                          isDarkMode ? 'bg-white/5 border border-white/5 text-indigo-300' : 'bg-black/5 border border-black/5 text-indigo-600'
                        }`}>
                          0.7 / 0.7 / 0.7
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs opacity-60 leading-relaxed">Gemini CLI专用，固定倍率</td>
                      <td className="py-4 px-4 opacity-60 leading-relaxed text-xs">
                        专为 Gemini CLI 工具优化，前端能力顶尖，UI/UX 设计一步到位。
                      </td>
                    </tr>

                    {/* Grok 网页逆向 */}
                    <tr className={`border-b transition-colors ${
                      isDarkMode ? 'border-white/5 hover:bg-white/[0.02]' : 'border-black/5 hover:bg-black/[0.02]'
                    }`}>
                      <td className="py-4 pl-6 pr-4 font-mono text-xs opacity-40">08</td>
                      <td className="py-4 px-4 font-medium whitespace-nowrap">grok网页逆向</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded font-mono text-xs whitespace-nowrap ${
                          isDarkMode ? 'bg-white/5 border border-white/5 text-blue-300' : 'bg-black/5 border border-black/5 text-blue-600'
                        }`}>
                          0.1 / 0.1 / 0.1
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs opacity-60 leading-relaxed">网页搜索专用，固定倍率</td>
                      <td className="py-4 px-4 opacity-60 leading-relaxed text-xs">
                        集成 MCP 协议的 Grok API，支持网页搜索/抓取 → 结构化返回。<a href="https://github.com/GuDaStudio/GrokSearch" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-1 underline">项目地址</a>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </Container>

          {/* 用户档位说明 */}
          <Container delay={0.3}>
            <div className={`mt-12 sm:mt-16 text-center p-6 sm:p-8 rounded-2xl border ${isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.02] border-black/10'}`}>
              <p className="text-sm sm:text-base opacity-70">
                <span className="font-bold">用户档位说明：</span>
                <span className="mx-2">C1 ≥ ¥25</span>
                <span className={`mx-1 ${isDarkMode ? 'opacity-30' : 'opacity-40'}`}>|</span>
                <span className="mx-2">C2 ≥ ¥500</span>
                <span className={`mx-1 ${isDarkMode ? 'opacity-30' : 'opacity-40'}`}>|</span>
                <span className="mx-2">C3 ≥ ¥1000</span>
              </p>
            </div>
          </Container>
        </section>

        {/* 页脚 */}
        <footer
          className={`pt-16 sm:pt-24 lg:pt-32 pb-8 sm:pb-12 lg:pb-16 border-t ${
            isDarkMode ? 'border-white/[0.04] bg-white/[0.02]' : 'border-black/5 bg-zinc-50'
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* 联系方式区域 */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {/* Logo */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 tracking-tight">
                  IKunCode
                </h2>

                {/* 副标题 */}
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 lg:mb-16 opacity-60 font-medium px-4">
                  🚀 IKUNCODE 双线路中转 | ClaudeCode & Codex
                </p>

                {/* 联系方式 */}
                <div className="inline-grid grid-cols-[auto_auto] gap-x-4 gap-y-4 sm:gap-x-6 sm:gap-y-6 mb-8 sm:mb-12 text-left">
                  <span className="text-base sm:text-xl lg:text-2xl font-bold text-right">官方 QQ 群1群<span className="text-xs sm:text-sm text-red-500 ml-1">(已满)</span>:</span>
                  <a
                    href="https://qm.qq.com/q/Uib5UwurIs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    120753006
                  </a>

                  <span className="text-base sm:text-xl lg:text-2xl font-bold text-right">官方 QQ 群2群:</span>
                  <a
                    href="https://qm.qq.com/q/9vJyIfYAYU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    30168337
                  </a>

                  <span className="text-base sm:text-xl lg:text-2xl font-bold text-right">售后 QQ 群:</span>
                  <a
                    href="https://qm.qq.com/q/mq9v47VMuk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    132077881
                  </a>

                  <span className="text-base sm:text-xl lg:text-2xl font-bold text-right">Telegram:</span>
                  <a
                    href="https://t.me/ikuncode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    @ikuncode
                  </a>
                </div>

                {/* 服务承诺 */}
                <p className="text-sm sm:text-base opacity-40 tracking-wide">
                  专属客服通道 · 实时技术支持
                </p>
              </motion.div>
            </div>

            {/* 版权信息 */}
            <div className="text-center pt-6 sm:pt-8 border-t border-current/5">
              <p className="text-xs sm:text-sm opacity-30 tracking-wide">
                © 2026 ikuncode. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* JNTM Easter Egg - 懂的都懂 */}
      <IkunEasterEgg isDarkMode={isDarkMode} />
    </div>
  )
}
