'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download } from 'lucide-react'
import Image from 'next/image'
import { navLinks } from '@/lib/data'
import { ThemeToggle } from './theme-toggle'
import { MagneticButton } from './magnetic-button'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Detect active section
      const sections = navLinks.map((link) => link.href.replace('#', ''))
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= window.innerHeight / 3) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <MagneticButton>
            <a
              href="#"
              className="flex items-center"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <Image
                src="/hg-logo.svg"
                alt="Hariom Gupta Logo"
                width={40}
                height={40}
                className="object-contain dark:invert-0 invert"
              />
            </a>
          </MagneticButton>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <MagneticButton key={link.name} strength={0.3}>
                <button
                  onClick={() => scrollToSection(link.href)}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    activeSection === link.href.replace('#', '')
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.name}
                  {activeSection === link.href.replace('#', '') && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    />
                  )}
                </button>
              </MagneticButton>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />

            {/* Resume Button */}
            <MagneticButton strength={0.3}>
              <a
                href="https://drive.google.com/file/d/104PHxCfTrAHu84qSvXysFCR_8jfXSgLJ/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 text-sm text-muted-foreground border border-primary/40 rounded-full hover:border-primary hover:text-foreground hover:shadow-[0_0_12px_rgba(var(--neon-rgb),0.3)] transition-all duration-300"
              >
                <Download size={14} />
                <span className="hidden lg:inline">Resume</span>
              </a>
            </MagneticButton>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 md:hidden"
          >
            <div className="flex flex-col items-center gap-6 p-6">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(link.href)}
                  className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
