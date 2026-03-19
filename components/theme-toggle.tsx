'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect, useRef } from 'react'
import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return

    // Get click position for ripple effect
    const rect = e.currentTarget.getBoundingClientRect()
    setRipplePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })

    setIsAnimating(true)
    
    // Start the animation
    setTimeout(() => {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }, 150)

    setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
        <div className="w-5 h-5" />
      </button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center overflow-hidden transition-colors"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? 'moon' : 'sun'}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {isDark ? (
            <Moon className="w-5 h-5 text-foreground" />
          ) : (
            <Sun className="w-5 h-5 text-foreground" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Ripple effect */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: ripplePosition.x,
              top: ripplePosition.y,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 20, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div
              className={`w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                isDark ? 'bg-yellow-400/30' : 'bg-indigo-600/30'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
