'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const trailRef = useRef<{ x: number; y: number }[]>([])
  
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 300 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    // Check for touch device
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(hover: none)').matches)
    }
    checkTouch()
    
    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)
      
      // Update trail
      trailRef.current.push({ x: e.clientX, y: e.clientY })
      if (trailRef.current.length > 8) {
        trailRef.current.shift()
      }
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    // Detect hoverable elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isHoverable = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]')
      setIsHovering(!!isHoverable)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousemove', handleElementHover)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousemove', handleElementHover)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [cursorX, cursorY, isTouchDevice])

  if (isTouchDevice) return null

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 0.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </motion.div>

      {/* Cursor outline */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
        }}
        transition={{ duration: 0.2 }}
      >
        <div 
          className={`w-full h-full rounded-full border-2 border-white transition-colors duration-200 ${
            isHovering ? 'bg-white/10' : 'bg-transparent'
          }`} 
        />
      </motion.div>

      {/* Trail effect */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 pointer-events-none z-[9997] mix-blend-difference"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{
            opacity: isVisible ? 0.3 - i * 0.05 : 0,
            scale: 1 - i * 0.1,
          }}
          transition={{ 
            duration: 0.1,
            delay: i * 0.02,
          }}
        >
          <div 
            className="w-1 h-1 bg-white rounded-full"
            style={{ 
              transform: `scale(${1 - i * 0.15})`,
            }} 
          />
        </motion.div>
      ))}
    </>
  )
}
