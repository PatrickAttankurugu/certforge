'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'

// Fade in on scroll
export function FadeIn({
  children,
  className,
  delay = 0,
  direction = 'up',
  ...props
}: {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
} & Omit<HTMLMotionProps<'div'>, 'children'>) {
  const directionOffset = {
    up: { y: 24 },
    down: { y: -24 },
    left: { x: 24 },
    right: { x: -24 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Staggered children animation
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scale on hover
export function HoverScale({
  children,
  className,
  scale = 1.02,
}: {
  children: ReactNode
  className?: string
  scale?: number
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Animated counter
export function AnimatedNumber({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {value}
    </motion.span>
  )
}

// Pulse animation for CTAs
export function PulseGlow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          '0 0 0 0 rgba(var(--primary), 0)',
          '0 0 0 8px rgba(var(--primary), 0.1)',
          '0 0 0 0 rgba(var(--primary), 0)',
        ],
      }}
      transition={{ duration: 2, repeat: Infinity }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Float animation for decorative elements
export function FloatingElement({
  children,
  className,
  duration = 3,
  distance = 10,
}: {
  children: ReactNode
  className?: string
  duration?: number
  distance?: number
}) {
  return (
    <motion.div
      animate={{
        y: [-distance, distance, -distance],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
