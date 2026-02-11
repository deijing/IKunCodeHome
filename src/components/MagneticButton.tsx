import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface Props {
  href: string
  children: ReactNode
  className?: string
  target?: string
  rel?: string
}

export default function MagneticButton({
  href,
  children,
  className = '',
  target = '_top',
  rel,
}: Props) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const sx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 220, damping: 22, mass: 0.6 })

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion) return
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)

    x.set(dx * 0.12)
    y.set(dy * 0.12)
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduceMotion ? undefined : { x: sx, y: sy }}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 18 }}
      className={[
        'relative isolate overflow-hidden group',
        'rounded-full',
        'shadow-2xl shadow-black/10',
        className,
      ].join(' ')}
    >
      {/* Shine effect on hover */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
      </span>
      {children}
    </motion.a>
  )
}
