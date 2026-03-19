'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Github, ExternalLink, Star, GitFork } from 'lucide-react'
import { MagneticButton } from './magnetic-button'
import { useGitHubStats } from '@/hooks/useGitHubStats'

interface Project {
  id: number
  name: string
  description: string
  tech: string[]
  color: string
  github: string
  live: string | null
  stars: number
  forks: number
}

interface ProjectCardProps {
  project: Project
  isActive: boolean
  onClick: (liveStats: { stars: number; forks: number }) => void
}

function StatSkeleton() {
  return (
    <span className="inline-block w-6 h-4 rounded bg-secondary animate-pulse" />
  )
}

export function ProjectCard({ project, isActive, onClick }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const { data: ghData, loading } = useGitHubStats(project.name, {
    stars: project.stars,
    forks: project.forks,
  })

  // 3D tilt effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick({ stars: ghData.stars, forks: ghData.forks })}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        scale: isActive ? 1 : 0.85,
        opacity: isActive ? 1 : 0.5,
      }}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-xl cursor-pointer perspective-1000"
    >
      {/* Glow effect */}
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        className="absolute -inset-4 rounded-3xl blur-2xl"
        style={{ backgroundColor: `${project.color}20` }}
      />

      {/* Card */}
      <div
        className="relative glass rounded-2xl overflow-hidden"
        style={{
          borderTop: `4px solid ${project.color}`,
        }}
      >
        {/* Reflection effect */}
        <motion.div
          animate={{
            x: isHovered ? '200%' : '-100%',
          }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
        />

        <div className="p-8" style={{ transform: 'translateZ(50px)' }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{project.name}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {loading ? <StatSkeleton /> : ghData.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  {loading ? <StatSkeleton /> : ghData.forks}
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-2">
              <MagneticButton strength={0.3}>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              </MagneticButton>
              {project.live && (
                <MagneticButton strength={0.3}>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </MagneticButton>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-mono rounded-full bg-secondary text-secondary-foreground"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Click hint */}
          <motion.p
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="mt-6 text-center text-sm text-muted-foreground"
          >
            Click to view details
          </motion.p>
        </div>
      </div>

      {/* Reflection beneath card */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl opacity-30"
        style={{ backgroundColor: project.color }}
      />
    </motion.div>
  )
}
