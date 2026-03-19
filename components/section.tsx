'use client'

import { ReactNode, useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface SectionProps {
  id: string
  children: ReactNode
  className?: string
  label?: string
  fullHeight?: boolean
}

export function Section({ id, children, className = '', label, fullHeight = false }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-20% 0px' })

  return (
    <section
      id={id}
      ref={ref}
      className={`relative ${fullHeight ? 'min-h-screen' : ''} ${className}`}
    >
      {label && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="font-mono text-sm text-muted-foreground tracking-wider">
            {label}
          </span>
        </motion.div>
      )}
      {children}
    </section>
  )
}

interface AnimatedHeadingProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3'
  delay?: number
}

export function AnimatedHeading({ children, className = '', as = 'h2', delay = 0 }: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [words, setWords] = useState<string[]>([])

  useEffect(() => {
    setWords(children.split(' '))
  }, [children])

  const Tag = as

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}

interface AnimatedParagraphProps {
  children: string
  className?: string
  delay?: number
}

export function AnimatedParagraph({ children, className = '', delay = 0 }: AnimatedParagraphProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.p>
  )
}

export function SectionDivider() {
  return (
    <div className="py-20 flex justify-center">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        viewport={{ once: true }}
        className="w-32 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />
    </div>
  )
}
