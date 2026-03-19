'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Section, AnimatedHeading } from '../section'
import { SkillsPhysics } from '../skills-physics'

export function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-20%' })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  const paragraphs = [
    "I'm a passionate full-stack developer with a deep love for creating innovative digital experiences.",
    "My journey in tech has been defined by curiosity, continuous learning, and a drive to push boundaries.",
    "I specialize in AI/ML, mobile development, and modern web technologies, always staying ahead of the curve.",
  ]

  const highlightLine = "I once won 5 hackathons in a single week—because why stop at one?"

  return (
    <Section id="about" label="// 01 — ABOUT" className="py-32 relative">
      <div ref={containerRef} className="max-w-7xl mx-auto px-6">
        {/* Animated background */}
        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-aurora/5 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute top-1/3 right-0 w-96 h-96 bg-neon/5 rounded-full blur-3xl" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start relative">
          {/* Left column - Text */}
          <div>
            <AnimatedHeading
              as="h2"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
            >
              Building the future, one line of code at a time
            </AnimatedHeading>

            <div className="space-y-6">
              {paragraphs.map((text, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                  className="text-lg text-muted-foreground leading-relaxed"
                >
                  {text}
                </motion.p>
              ))}

              {/* Highlight line */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="relative mt-8"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-neon/20 to-aurora/20 rounded-xl blur-xl" />
                <p className="relative text-xl font-semibold text-foreground bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
                  <span className="text-gradient">{highlightLine}</span>
                </p>
              </motion.div>
            </div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex flex-wrap gap-6 mt-12"
            >
              {[
                { label: 'Years Coding', value: '4+' },
                { label: 'Technologies', value: '20+' },
                { label: 'Projects Shipped', value: '15+' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-foreground">{item.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column - Skills Physics */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:sticky lg:top-32"
          >
            <div className="mb-6">
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Skills & Technologies
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and play with my skills below
              </p>
            </div>
            <SkillsPhysics />
          </motion.div>
        </div>
      </div>
    </Section>
  )
}
