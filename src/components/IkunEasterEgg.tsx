import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

interface Props {
  isDarkMode: boolean
}

const SEQ = 'jntm'

export default function IkunEasterEgg({ isDarkMode }: Props) {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)

  const palette = useMemo(() => {
    if (isDarkMode) {
      return { bg: 'bg-black/60', border: 'border-white/10', fg: 'text-zinc-100' }
    }
    return { bg: 'bg-white/80', border: 'border-black/10', fg: 'text-zinc-900' }
  }, [isDarkMode])

  useEffect(() => {
    let buffer = ''
    let timer: number | undefined

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return
      buffer = (buffer + e.key.toLowerCase()).slice(-SEQ.length)

      if (buffer === SEQ) {
        setOpen(true)
        window.clearTimeout(timer)
        timer = window.setTimeout(() => setOpen(false), 1800)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          aria-hidden="true"
        >
          <motion.div
            className={[
              'relative overflow-hidden rounded-2xl border backdrop-blur-xl',
              palette.bg,
              palette.border,
              palette.fg,
              'px-8 py-6 text-center',
            ].join(' ')}
            initial={reduceMotion ? { scale: 1 } : { scale: 0.95, y: 12, filter: 'blur(8px)' }}
            animate={reduceMotion ? { scale: 1 } : { scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduceMotion ? { scale: 1 } : { scale: 0.98, y: 8, filter: 'blur(8px)' }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-40 noise-overlay mix-blend-overlay" />

            <div className="relative">
              <div className="text-[10px] tracking-[0.4em] uppercase opacity-50 mb-2">
                IKUN MODE ACTIVATED
              </div>
              <div className="text-4xl font-black tracking-[-0.02em]">
                JNTM <span className="text-amber-500">·</span> MONOGRAM
              </div>
              <div className="mt-2 text-sm opacity-50">
                懂的都懂
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
