'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

export function useScrollVelocity() {
  const [velocity, setVelocity] = useState(0)
  const [direction, setDirection] = useState<'up' | 'down' | 'none'>('none')
  const lastScrollY = useRef(0)
  const lastTime = useRef(Date.now())
  const velocityRef = useRef(0)
  const decayTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const currentTime = Date.now()
    const deltaY = currentScrollY - lastScrollY.current
    const deltaTime = currentTime - lastTime.current

    if (deltaTime > 0) {
      const newVelocity = Math.abs(deltaY) / deltaTime * 100
      velocityRef.current = velocityRef.current * 0.8 + newVelocity * 0.2
      setVelocity(velocityRef.current)
      
      if (deltaY > 0) {
        setDirection('down')
      } else if (deltaY < 0) {
        setDirection('up')
      }
    }

    lastScrollY.current = currentScrollY
    lastTime.current = currentTime

    // Reset decay timer
    if (decayTimer.current) clearTimeout(decayTimer.current)
    decayTimer.current = setTimeout(() => {
      velocityRef.current = 0
      setVelocity(0)
      setDirection('none')
    }, 150)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (decayTimer.current) clearTimeout(decayTimer.current)
    }
  }, [handleScroll])

  return { velocity, direction }
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = window.scrollY / scrollHeight
      setProgress(Math.min(Math.max(currentProgress, 0), 1))
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener('scroll', updateProgress)
    }
  }, [])

  return progress
}
