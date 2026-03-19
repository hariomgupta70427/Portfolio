'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function useGsapFadeIn(options?: {
  y?: number
  duration?: number
  delay?: number
  stagger?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { y = 50, duration = 0.8, delay = 0, stagger = 0.1 } = options || {}

  useEffect(() => {
    if (!ref.current) return

    const elements = ref.current.children
    
    gsap.fromTo(
      elements,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [y, duration, delay, stagger])

  return ref
}

export function useGsapSplitText(options?: {
  type?: 'chars' | 'words' | 'lines'
  duration?: number
  stagger?: number
}) {
  const ref = useRef<HTMLElement>(null)
  const { type = 'chars', duration = 0.05, stagger = 0.02 } = options || {}

  useEffect(() => {
    if (!ref.current) return

    const text = ref.current.textContent || ''
    const element = ref.current

    // Clear and split text
    element.innerHTML = ''
    
    let items: string[] = []
    if (type === 'chars') {
      items = text.split('')
    } else if (type === 'words') {
      items = text.split(' ')
    } else {
      items = text.split('\n')
    }

    items.forEach((item, index) => {
      const span = document.createElement('span')
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      span.textContent = item + (type === 'words' ? ' ' : '')
      element.appendChild(span)
    })

    gsap.to(element.children, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [type, duration, stagger])

  return ref
}

export function useGsapCounter(
  end: number,
  options?: {
    duration?: number
    delay?: number
    prefix?: string
    suffix?: string
  }
) {
  const ref = useRef<HTMLSpanElement>(null)
  const { duration = 2, delay = 0, prefix = '', suffix = '' } = options || {}

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const startValue = { value: 0 }

    gsap.to(startValue, {
      value: end,
      duration,
      delay,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = `${prefix}${Math.round(startValue.value)}${suffix}`
      },
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [end, duration, delay, prefix, suffix])

  return ref
}

export function useGsapParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.to(ref.current, {
      y: () => window.innerHeight * speed * -1,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [speed])

  return ref
}

export function useGsapHorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return

    const sections = scrollRef.current.children
    const totalWidth = scrollRef.current.scrollWidth - window.innerWidth

    gsap.to(scrollRef.current, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return { containerRef, scrollRef }
}

export function useGsapStackingCards() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const cards = containerRef.current.querySelectorAll('[data-card]')
    
    cards.forEach((card, index) => {
      const isLast = index === cards.length - 1
      
      if (!isLast) {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 20%',
          end: 'bottom 20%',
          pin: true,
          pinSpacing: false,
          onUpdate: (self) => {
            const progress = self.progress
            gsap.to(card, {
              scale: 1 - progress * 0.05,
              opacity: 1 - progress * 0.3,
              duration: 0.1,
            })
          },
        })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return containerRef
}
