'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Briefcase, Calendar, Check } from 'lucide-react'
import { Section, AnimatedHeading } from '../section'
import { experience } from '@/lib/data'
import { isMobileDevice } from '@/lib/utils'

export function Experience() {
  return (
    <Section id="experience" label="// 03 — EXPERIENCE" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedHeading
          as="h2"
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
        >
          Work Experience
        </AnimatedHeading>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg text-muted-foreground mb-16 max-w-2xl"
        >
          My professional journey spans IT management, event organization, and community impact.
        </motion.p>

        {/* Stacking cards */}
        <div className="relative space-y-8">
          {experience.map((exp, index) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              index={index}
              total={experience.length}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}

function ExperienceCard({
  experience,
  index,
  total,
}: {
  experience: typeof import('@/lib/data').experience[0]
  index: number
  total: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-10%' })
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(isMobileDevice())
  }, [])

  // Scroll-driven transforms — only on desktop
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start center', 'end center'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5])

  const cardColors = ['#00F5FF', '#00FF88', '#A855F7']
  const color = cardColors[index % cardColors.length]

  return (
    <motion.div
      ref={cardRef}
      style={mobile ? {} : { scale, opacity, rotateX }}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative ${mobile ? '' : 'perspective-1000'}`}
    >
      {/* Timeline connector */}
      {index < total - 1 && (
        <div className="absolute left-8 top-full w-0.5 h-8 bg-gradient-to-b from-border to-transparent" />
      )}

      <div
        className="glass rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
        style={{ borderLeft: `4px solid ${color}` }}
      >
        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Briefcase className="w-5 h-5" style={{ color }} />
                </div>
                <span
                  className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {experience.company}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">{experience.role}</h3>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-mono">{experience.duration}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-6">
            {experience.description}
          </p>

          {/* Highlights */}
          <ul className="space-y-3">
            {experience.highlights.map((highlight, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${color}30` }}
                >
                  <Check className="w-3 h-3" style={{ color }} />
                </div>
                <span className="text-sm text-muted-foreground">{highlight}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
