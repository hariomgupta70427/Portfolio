'use client'

// CSS-based particle animation (no React Three Fiber)
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
}

interface FloatingShape {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  type: 'circle' | 'ring' | 'triangle' | 'square'
  color: string
  duration: number
  delay: number
}

export function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const [shapes, setShapes] = useState<FloatingShape[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)

    // Generate particles
    const particleCount = window.innerWidth < 768 ? 30 : 80
    const newParticles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }
    setParticles(newParticles)

    // Generate floating shapes
    const shapeCount = window.innerWidth < 768 ? 3 : 6
    const colors = ['#00F5FF', '#00FF88', '#A855F7', '#FF2D78', '#FF6B35']
    const types: FloatingShape['type'][] = ['circle', 'ring', 'triangle', 'square']
    const newShapes: FloatingShape[] = []
    for (let i = 0; i < shapeCount; i++) {
      newShapes.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        size: Math.random() * 60 + 40,
        rotation: Math.random() * 360,
        type: types[Math.floor(Math.random() * types.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 15 + 20,
        delay: Math.random() * 5,
      })
    }
    setShapes(newShapes)

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      mediaQuery.removeEventListener('change', handler)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  if (reducedMotion) return null

  const renderShape = (shape: FloatingShape) => {
    switch (shape.type) {
      case 'circle':
        return (
          <div
            className="rounded-full"
            style={{
              width: shape.size,
              height: shape.size,
              background: `radial-gradient(circle, ${shape.color}40 0%, transparent 70%)`,
              boxShadow: `0 0 40px ${shape.color}30`,
            }}
          />
        )
      case 'ring':
        return (
          <div
            className="rounded-full"
            style={{
              width: shape.size,
              height: shape.size,
              border: `2px solid ${shape.color}40`,
              boxShadow: `0 0 20px ${shape.color}20, inset 0 0 20px ${shape.color}10`,
            }}
          />
        )
      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}30`,
              filter: `drop-shadow(0 0 20px ${shape.color}30)`,
            }}
          />
        )
      case 'square':
        return (
          <div
            style={{
              width: shape.size * 0.7,
              height: shape.size * 0.7,
              background: `linear-gradient(135deg, ${shape.color}20 0%, ${shape.color}05 100%)`,
              border: `1px solid ${shape.color}30`,
              boxShadow: `0 0 30px ${shape.color}20`,
            }}
          />
        )
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Gradient overlay that follows mouse */}
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, var(--neon) 0%, transparent 50%)`,
        }}
      />

      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: 'var(--neon)',
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px var(--neon)`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            transform: `translate(-50%, -50%) rotate(${shape.rotation}deg)`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: [shape.rotation, shape.rotation + 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {renderShape(shape)}
        </motion.div>
      ))}

      {/* Grid lines for depth effect */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--neon) 1px, transparent 1px),
            linear-gradient(90deg, var(--neon) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center top',
        }}
      />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, var(--background) 100%)',
        }}
      />
    </div>
  )
}

export default ThreeScene
