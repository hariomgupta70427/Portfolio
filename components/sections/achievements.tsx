'use client'

import { motion } from 'framer-motion'
import { Section, AnimatedHeading } from '../section'
import { achievements } from '@/lib/data'

export function Achievements() {
  return (
    <Section id="achievements" label="// 04 — ACHIEVEMENTS" className="py-32">
      <div className="relative">
        {/* Background blurs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-neon/10 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-aurora/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <AnimatedHeading
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            Awards &amp; Recognition
          </AnimatedHeading>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground mb-16 max-w-2xl"
          >
            Recognition for innovation, teamwork, and technical excellence.
          </motion.p>

          {/* Achievement cards — 3x2 responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative glass rounded-2xl overflow-hidden"
              >
                {/* Top colored border */}
                <div
                  className="h-1 transition-all group-hover:h-1.5"
                  style={{ backgroundColor: achievement.color }}
                />

                {/* Holographic shine */}
                <motion.div
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
                />

                <div className="p-6 relative">
                  {/* Large emoji */}
                  <div className="text-4xl mb-4">
                    {achievement.subtitle.split(' ')[0]}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {achievement.title}
                  </h3>

                  {/* Subtitle */}
                  <p
                    className="text-sm font-semibold mb-3"
                    style={{ color: achievement.color }}
                  >
                    {achievement.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {achievement.description}
                  </p>

                  {/* Org + Date */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>{achievement.org}</span>
                    <span>{achievement.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
