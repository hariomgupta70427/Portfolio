'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Instagram } from 'lucide-react'
import { personalInfo, stats } from '@/lib/data'
import { MagneticButton } from '../magnetic-button'

const roles = [
  'Full-Stack Developer',
  'AI Innovator',
  'Flutter Mobile Developer',
  'Code. Build. Deploy',
  'From Idea to Production',
  'Building AI-Powered Apps',
  'Scalable Web App Developer',
  'AI Application Builder'
]

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentRole, setCurrentRole] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Scroll-driven animations
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const nameOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const nameScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 300])

  // Role rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const letterVariants = {
    hidden: { opacity: 0, y: 100, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay: i * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  }

  const firstName = 'HARIOM'
  const lastName = 'GUPTA'

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background gradient that moves with scroll */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-aurora/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          style={{ y: nameY, opacity: nameOpacity, scale: nameScale }}
          className="text-center perspective-1000"
        >
          {/* Pre-title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <span className="font-mono text-sm text-muted-foreground tracking-widest uppercase">
              Welcome to my portfolio
            </span>
          </motion.div>

          {/* First name */}
          <div className="overflow-hidden mb-2">
            <h1 className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold leading-none tracking-tighter">
              {firstName.split('').map((letter, i) => (
                <motion.span
                  key={`first-${i}`}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate={isLoaded ? 'visible' : 'hidden'}
                  className="inline-block text-gradient hover:scale-110 transition-transform cursor-default"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>
          </div>

          {/* Last name */}
          <div className="overflow-hidden mb-8">
            <h1 className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold leading-none tracking-tighter">
              {lastName.split('').map((letter, i) => (
                <motion.span
                  key={`last-${i}`}
                  custom={i + firstName.length}
                  variants={letterVariants}
                  initial="hidden"
                  animate={isLoaded ? 'visible' : 'hidden'}
                  className="inline-block text-foreground hover:text-gradient hover:scale-110 transition-all cursor-default"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>
          </div>

          {/* Role flip animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="h-12 mb-8 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentRole}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="text-xl md:text-2xl font-medium text-foreground"
              >
                {roles[currentRole]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <MagneticButton strength={0.2}>
              <a
                href="#projects"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-foreground text-background hover:scale-105 transition-transform"
              >
                View My Work
              </a>
            </MagneticButton>
            <MagneticButton strength={0.2}>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all"
              >
                Get In Touch
              </a>
            </MagneticButton>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex justify-center gap-4 mb-16"
          >
            {[
              { icon: Github, href: personalInfo.github },
              { icon: Linkedin, href: personalInfo.linkedin },
              { icon: Instagram, href: personalInfo.instagram },
            ].map((social, i) => (
              <MagneticButton key={i} strength={0.3}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              </MagneticButton>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-wrap justify-center gap-8 md:gap-12"
        >
          {stats.map((stat, index) => (
            <StatItem key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}

function StatItem({ stat, index }: { stat: { label: string; value: string | number }; index: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const numericValue = typeof stat.value === 'number'
      ? stat.value
      : parseFloat(stat.value.toString().replace(/[^0-9.]/g, ''))

    if (isNaN(numericValue)) return

    const duration = 2000
    const steps = 60
    const increment = numericValue / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        setCount(numericValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current * 10) / 10)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, stat.value])

  const displayValue = typeof stat.value === 'string'
    ? stat.value.replace(/[0-9.]+/, count.toString())
    : count

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
        {displayValue}
      </div>
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {stat.label}
      </div>
    </div>
  )
}
