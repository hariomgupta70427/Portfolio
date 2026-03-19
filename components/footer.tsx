'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Instagram, Mail, ArrowUp } from 'lucide-react'
import { personalInfo, navLinks } from '@/lib/data'
import { MagneticButton } from './magnetic-button'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const socialLinks = [
    { icon: Github, href: personalInfo.github, label: 'GitHub' },
    { icon: Linkedin, href: personalInfo.linkedin, label: 'LinkedIn' },
    { icon: Instagram, href: personalInfo.instagram, label: 'Instagram' },
    { icon: Mail, href: `mailto:${personalInfo.email}`, label: 'Email' },
  ]

  return (
    <footer className="relative py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-gradient">{personalInfo.name}</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {personalInfo.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Connect
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <MagneticButton key={social.label} strength={0.3}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                </MagneticButton>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>

          <MagneticButton>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to top
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowUp className="w-4 h-4" />
              </motion.div>
            </button>
          </MagneticButton>
        </div>
      </div>
    </footer>
  )
}
