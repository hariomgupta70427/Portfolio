'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Github, ExternalLink, Star, GitFork, Check } from 'lucide-react'

interface Project {
  id: number
  name: string
  description: string
  longDescription?: string
  tech: string[]
  color: string
  github: string
  live: string | null
  stars: number
  forks: number
  highlights?: string[]
}

interface ProjectModalProps {
  project: Project
  liveStats?: { stars: number; forks: number } | null
  onClose: () => void
}

export function ProjectModal({ project, liveStats, onClose }: ProjectModalProps) {
  const stars = liveStats?.stars ?? project.stars
  const forks = liveStats?.forks ?? project.forks

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    
    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
      onWheel={(e) => e.stopPropagation()}
    >
      <motion.div
        initial={{ scale: 0.9, rotateY: -10, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
        exit={{ scale: 0.9, rotateY: 10, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl overflow-y-auto overscroll-contain glass rounded-3xl"
        style={{ borderTop: `4px solid ${project.color}`, maxHeight: '80vh', scrollbarWidth: 'thin' }}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {project.name}
            </h2>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-5 h-5" />
                {stars} stars
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="w-5 h-5" />
                {forks} forks
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {project.description}
            </p>
            {project.longDescription && (
              <p className="text-muted-foreground leading-relaxed">
                {project.longDescription}
              </p>
            )}
          </div>

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Key Highlights</h3>
              <ul className="space-y-3">
                {project.highlights.map((highlight, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${project.color}30` }}
                    >
                      <Check className="w-3 h-3" style={{ color: project.color }} />
                    </div>
                    <span className="text-muted-foreground">{highlight}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech stack */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 text-sm font-mono rounded-full bg-secondary text-secondary-foreground"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold hover:scale-105 transition-transform"
            >
              <Github className="w-5 h-5" />
              View Code
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-foreground text-foreground font-semibold hover:bg-foreground hover:text-background transition-all"
              >
                <ExternalLink className="w-5 h-5" />
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Decorative gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${project.color}10, transparent)`,
          }}
        />
      </motion.div>
    </motion.div>
  )
}
