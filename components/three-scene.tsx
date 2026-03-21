'use client'

// CSS-based particle animation — zero JS animation overhead
import { useEffect, useRef, useState } from 'react'
import { isMobileDevice } from '@/lib/utils'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
  dx: number
  dy: number
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
  const [reducedMotion, setReducedMotion] = useState(false)
  const mousePosRef = useRef({ x: 0, y: 0 })
  const gradientRef = useRef<HTMLDivElement>(null)
  const rafPending = useRef(false)
  const isMobile = useRef(false)

  useEffect(() => {
    isMobile.current = isMobileDevice()

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)

    // Generate particles — fewer on mobile
    const particleCount = isMobile.current ? 15 : 60
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
        dx: Math.random() * 20 - 10,
        dy: -(Math.random() * 25 + 10),
      })
    }
    setParticles(newParticles)

    // Generate floating shapes — fewer on mobile
    const shapeCount = isMobile.current ? 2 : 5
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

    // Mouse tracking — only on non-touch, RAF-throttled
    if (!isMobile.current) {
      const handleMouseMove = (e: MouseEvent) => {
        mousePosRef.current = { x: e.clientX, y: e.clientY }
        if (!rafPending.current) {
          rafPending.current = true
          requestAnimationFrame(() => {
            if (gradientRef.current) {
              gradientRef.current.style.background =
                `radial-gradient(circle at ${mousePosRef.current.x}px ${mousePosRef.current.y}px, var(--neon) 0%, transparent 50%)`
            }
            rafPending.current = false
          })
        }
      }
      window.addEventListener('mousemove', handleMouseMove, { passive: true })

      return () => {
        mediaQuery.removeEventListener('change', handler)
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }

    return () => {
      mediaQuery.removeEventListener('change', handler)
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
      {/* Gradient overlay that follows mouse — desktop only, updated via ref */}
      {!isMobile.current && (
        <div
          ref={gradientRef}
          className="absolute inset-0 opacity-30"
          style={{ willChange: 'background' }}
        />
      )}

      {/* Particles — pure CSS animations, zero JS cost */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: 'var(--neon)',
            willChange: 'transform, opacity',
            ['--p-opacity' as string]: particle.opacity,
            ['--p-dx' as string]: `${particle.dx}px`,
            ['--p-dy' as string]: `${particle.dy}px`,
            animation: `particle-float ${particle.duration}s ${particle.delay}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Floating shapes — pure CSS animations */}
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            willChange: 'transform',
            ['--s-rot' as string]: `${shape.rotation}deg`,
            animation: `shape-float ${shape.duration}s ${shape.delay}s ease-in-out infinite`,
          }}
        >
          {renderShape(shape)}
        </div>
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
