'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Matter from 'matter-js'
import { skills } from '@/lib/data'
import { isMobileDevice } from '@/lib/utils'

const COLORS: Record<string, string> = {
  'skill-mobile': '#FF6B35',
  'skill-ai': '#A855F7',
  'skill-frontend': '#00F5FF',
  'skill-backend': '#00FF88',
  'skill-languages': '#F0EFFF',
  'skill-devops': '#FF2D78',
}

const TECH_ICONS: Record<string, string> = {
  // Mobile Dev
  'Flutter':        '/skills/flutter.svg',
  'Dart':           '/skills/dart.svg',
  'Java':           '/skills/java.svg',
  'Kotlin':         '/skills/kotlin.svg',
  'Android SDK':    '/skills/android-sdk.svg',

  // AI & ML
  'Google Gemini':  '/skills/google-gemini.svg',
  'OpenAI':         '/skills/openai.svg',
  'Claude':         '/skills/claude.svg',
  'Perplexity':     '/skills/perplexity.svg',
  'Hugging Face':   '/skills/hugging-face.svg',

  // Frontend
  'React':          '/skills/react.svg',
  'Next.js':        '/skills/next-js.svg',
  'TypeScript':     '/skills/typescript.svg',
  'Tailwind CSS':   '/skills/tailwind-css.svg',
  'HTML5/CSS3':     '/skills/html5-css3.svg',

  // Backend
  'Node.js':        '/skills/node-js.svg',
  'Express.js':     '/skills/express-js.svg',
  'Firebase':       '/skills/firebase.svg',
  'Supabase':       '/skills/supabase.svg',
  'MongoDB':        '/skills/mongodb.svg',
  'MySQL':          '/skills/mysql.svg',

  // Languages
  'Python':         '/skills/python.svg',
  'JavaScript':     '/skills/javascript.svg',
  'C/C++':          '/skills/c-c.svg',

  // DevOps & Tools
  'Git':            '/skills/git.svg',
  'Docker':         '/skills/docker.svg',
  'Vercel':         '/skills/vercel.svg',
  'Netlify':        '/skills/netlify.svg',
  'Figma':          '/skills/figma.svg',
  'WordPress':      '/skills/wordpress.svg',
  'VS Code':        '/skills/vs-code.svg',
  'GitHub':         '/skills/github.svg',
}

// Monochrome BLACK SVGs — invisible on dark bg → invert only in dark mode
const BLACK_SVGS = new Set(['OpenAI', 'Claude', 'Perplexity'])

// Monochrome WHITE SVGs — invisible on light bg → invert only in light mode
const WHITE_SVGS = new Set(['Next.js', 'Express.js', 'Vercel', 'GitHub'])

export function SkillsPhysics() {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const runnerRef = useRef<Matter.Runner | null>(null)
  const rafRef = useRef<number>(0)
  const bodiesRef = useRef<Matter.Body[]>([])
  const domNodesRef = useRef<Map<string, HTMLDivElement>>(new Map())
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null)

  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasDropped, setHasDropped] = useState(false)
  const [imagesReady, setImagesReady] = useState(false)
  const [failedIcons, setFailedIcons] = useState<Set<string>>(new Set())
  const [iconBlobUrls, setIconBlobUrls] = useState<Record<string, string>>({})
  const [engineReady, setEngineReady] = useState(false)

  // Build deduplicated skill list
  const allSkills = useRef<{ name: string; color: string }[]>([])
  if (allSkills.current.length === 0) {
    const seen = new Set<string>()
    Object.values(skills).forEach((category) => {
      category.items.forEach((skill) => {
        if (!seen.has(skill)) {
          seen.add(skill)
          allSkills.current.push({
            name: skill,
            color: COLORS[category.color] || '#ffffff',
          })
        }
      })
    })
  }

  // Fetch all SVGs as blobs on mount
  useEffect(() => {
    let cancelled = false

    const preloadLinks: HTMLLinkElement[] = []
    Object.values(TECH_ICONS).forEach((url) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = url
      link.type = 'image/svg+xml'
      document.head.appendChild(link)
      preloadLinks.push(link)
    })

    async function loadAllIcons() {
      const entries = Object.entries(TECH_ICONS)
      const blobMap: Record<string, string> = {}

      await Promise.all(
        entries.map(async ([name, url]) => {
          try {
            const res = await fetch(url)
            if (!res.ok) return
            const blob = await res.blob()
            blobMap[name] = URL.createObjectURL(blob)
          } catch {
            // Icon will use fallback
          }
        })
      )

      if (!cancelled) {
        setIconBlobUrls(blobMap)
        setImagesReady(true)
      }
    }

    loadAllIcons()

    const timeout = setTimeout(() => {
      if (!cancelled) setImagesReady(true)
    }, 3000)

    return () => {
      cancelled = true
      clearTimeout(timeout)
      preloadLinks.forEach((link) => link.remove())
    }
  }, [])

  // IntersectionObserver to trigger drop
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasDropped) {
          setIsInView(true)
          setHasDropped(true)
        }
      },
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [hasDropped])

  // Direct DOM sync — no React re-renders
  const syncPositions = useCallback(() => {
    const bodies = bodiesRef.current
    if (bodies.length === 0) {
      rafRef.current = requestAnimationFrame(syncPositions)
      return
    }

    for (const body of bodies) {
      const node = domNodesRef.current.get(body.label)
      if (node) {
        node.style.transform = `translate(${body.position.x - 26}px, ${body.position.y - 26}px) rotate(${body.angle}rad)`
      }
    }

    rafRef.current = requestAnimationFrame(syncPositions)
  }, [])

  // Initialize Matter.js engine + bodies
  useEffect(() => {
    if (!containerRef.current || !isInView || !imagesReady) return

    const container = containerRef.current
    const width = container.offsetWidth
    const height = 500
    const mobile = isMobileDevice()

    // Engine
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1 } })
    engineRef.current = engine

    // Walls
    const wallThickness = 50
    const walls = [
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width * 2, wallThickness, {
        isStatic: true, render: { visible: false }, label: '_wall',
      }),
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, {
        isStatic: true, render: { visible: false }, label: '_wall',
      }),
      Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, {
        isStatic: true, render: { visible: false }, label: '_wall',
      }),
      Matter.Bodies.rectangle(width / 2, -200 - wallThickness / 2, width * 2, wallThickness, {
        isStatic: true, render: { visible: false }, label: '_wall',
      }),
    ]
    Matter.Composite.add(engine.world, walls)

    // Shuffle skills
    const shuffled = [...allSkills.current].sort(() => Math.random() - 0.5)

    // Create bodies with staggered drop
    const bodies: Matter.Body[] = []
    const staggerDelay = mobile ? 30 : 60
    shuffled.forEach((skill, index) => {
      setTimeout(() => {
        const body = Matter.Bodies.circle(
          Math.random() * (width - 60) + 30,
          -50 - Math.random() * 250,
          26,
          {
            restitution: 0.6,
            friction: 0.1,
            frictionAir: mobile ? 0.04 : 0.02, // Higher air friction on mobile = settle faster
            label: skill.name,
          }
        )
        ;(body as any)._skillColor = skill.color

        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 6,
          y: Math.random() * 2 + 1,
        })

        bodies.push(body)
        bodiesRef.current = bodies
        Matter.Composite.add(engine.world, body)
      }, index * staggerDelay)
    })

    // Mouse interaction — only on non-touch
    let phantomCanvas: HTMLDivElement | null = null
    if (!mobile) {
      phantomCanvas = document.createElement('div')
      phantomCanvas.style.position = 'absolute'
      phantomCanvas.style.inset = '0'
      phantomCanvas.style.zIndex = '5'
      phantomCanvas.style.cursor = 'grab'
      container.appendChild(phantomCanvas)

      const mouse = Matter.Mouse.create(phantomCanvas as any)
      mouse.pixelRatio = 1

      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.2,
          render: { visible: false },
        },
      })
      Matter.Composite.add(engine.world, mouseConstraint)
      mouseConstraintRef.current = mouseConstraint
    }

    // Runner
    const runner = Matter.Runner.create({
      delta: mobile ? 1000 / 30 : 1000 / 60, // 30fps on mobile, 60fps on desktop
    })
    Matter.Runner.run(runner, engine)
    runnerRef.current = runner

    setEngineReady(true)

    // Start syncing positions via direct DOM
    rafRef.current = requestAnimationFrame(syncPositions)

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const newWidth = containerRef.current.offsetWidth

      Matter.Body.setPosition(walls[0], { x: newWidth / 2, y: height + wallThickness / 2 })
      Matter.Body.setVertices(walls[0], Matter.Bodies.rectangle(newWidth / 2, height + wallThickness / 2, newWidth * 2, wallThickness).vertices)
      Matter.Body.setPosition(walls[2], { x: newWidth + wallThickness / 2, y: height / 2 })
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(rafRef.current)

      if (runnerRef.current) Matter.Runner.stop(runnerRef.current)
      Matter.World.clear(engine.world, false)
      Matter.Engine.clear(engine)

      if (phantomCanvas?.parentNode) {
        phantomCanvas.parentNode.removeChild(phantomCanvas)
      }
    }
  }, [isInView, imagesReady, syncPositions])

  // Ref callback to collect DOM nodes
  const setNodeRef = useCallback((name: string) => (el: HTMLDivElement | null) => {
    if (el) {
      domNodesRef.current.set(name, el)
    } else {
      domNodesRef.current.delete(name)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm"
      style={{ height: 500 }}
    >
      {/* Rendered skill icons — positioned via direct DOM, not React state */}
      {engineReady && allSkills.current.map((item) => {
        const blobUrl = iconBlobUrls[item.name]
        const iconUrl = blobUrl || TECH_ICONS[item.name]
        const isHovered = hoveredSkill === item.name
        const isFailed = failedIcons.has(item.name)

        return (
          <div
            key={item.name}
            ref={setNodeRef(item.name)}
            onMouseEnter={() => setHoveredSkill(item.name)}
            onMouseLeave={() => setHoveredSkill(null)}
            style={{
              position: 'absolute',
              width: 52,
              height: 52,
              left: 0,
              top: 0,
              willChange: 'transform',
              zIndex: isHovered ? 20 : 10,
              pointerEvents: 'none',
            }}
          >
            {iconUrl && !isFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={iconUrl}
                alt={item.name}
                width={44}
                height={44}
                className={
                  BLACK_SVGS.has(item.name)
                    ? 'dark:invert transition-[filter] duration-300'
                    : WHITE_SVGS.has(item.name)
                    ? 'invert dark:invert-0 transition-[filter] duration-300'
                    : ''
                }
                style={{
                  objectFit: 'contain',
                  width: 44,
                  height: 44,
                  margin: '4px auto',
                  display: 'block',
                }}
                draggable={false}
                loading="eager"
                decoding="async"
                onError={() => {
                  setFailedIcons((prev) => new Set(prev).add(item.name))
                }}
              />
            ) : (
              <div
                style={{
                  width: 44,
                  height: 44,
                  margin: '4px auto',
                  borderRadius: '50%',
                  background: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'white',
                  fontFamily: 'Syne, sans-serif',
                }}
              >
                {item.name.charAt(0)}
              </div>
            )}

            {/* Hover tooltip */}
            {isHovered && (
              <div
                style={{
                  position: 'absolute',
                  bottom: -22,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0, 0, 0, 0.85)',
                  color: 'white',
                  fontSize: '10px',
                  fontFamily: '"JetBrains Mono", monospace',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
              >
                {item.name}
              </div>
            )}
          </div>
        )
      })}

      {/* Placeholder before drop */}
      {(!isInView || !imagesReady) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">
            {!imagesReady ? 'Loading skills...' : 'Scroll to reveal skills...'}
          </p>
        </div>
      )}
    </div>
  )
}
