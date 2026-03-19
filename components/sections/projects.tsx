'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Section } from '../section'
import { ProjectCard } from '../project-card'
import { ProjectModal } from '../project-modal'
import { projects } from '@/lib/data'

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const [selectedLiveStats, setSelectedLiveStats] = useState<{ stars: number; forks: number } | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Horizontal scroll progress
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `-${(projects.length - 1) * 100}%`]
  )

  // Track active card based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      const index = Math.round(value * (projects.length - 1))
      setActiveIndex(Math.min(index, projects.length - 1))
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <>
      <Section id="projects" label="// 02 — PROJECTS" className="relative">
        {/* Header - outside the scroll container */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            Featured <span className="text-gradient">Projects</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-2xl"
          >
            A selection of projects that showcase my expertise in AI, mobile development, and full-stack engineering.
          </motion.p>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={containerRef}
          className="relative"
          style={{ height: `${projects.length * 100}vh` }}
        >
          <div className="sticky top-0 h-screen overflow-hidden">
            {/* Progress bar */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-64">
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon to-aurora rounded-full"
                  style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
                />
              </div>
              <div className="flex justify-between mt-2">
                {projects.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === activeIndex ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Cards container */}
            <motion.div
              ref={scrollRef}
              style={{ x }}
              className="flex h-full items-center pt-16"
            >
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="min-w-screen w-screen h-full flex items-center justify-center px-6"
                >
                  <ProjectCard
                    project={project}
                    isActive={index === activeIndex}
                    onClick={(liveStats) => {
                      setSelectedProject(project)
                      setSelectedLiveStats(liveStats)
                    }}
                  />
                </div>
              ))}
            </motion.div>

            {/* Navigation hint */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
              <p className="text-sm text-muted-foreground font-mono">
                {activeIndex + 1} / {projects.length}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            liveStats={selectedLiveStats}
            onClose={() => {
              setSelectedProject(null)
              setSelectedLiveStats(null)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
