'use client'

import { useRef, useState, ReactNode, useEffect } from 'react'
import { motion } from 'framer-motion'
import { isTouchDevice } from '@/lib/utils'

interface MagneticButtonProps {
  children: ReactNode
  strength?: number
  className?: string
}

export function MagneticButton({ children, strength = 0.5, className = '' }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(isTouchDevice())
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isTouch) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    setPosition({
      x: distanceX * strength,
      y: distanceY * strength,
    })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  // On touch devices, render a plain div — no springs, no motion overhead
  if (isTouch) {
    return (
      <div className={`cursor-pointer ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  )
}
