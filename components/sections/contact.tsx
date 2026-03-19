'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, MapPin, Clock, Copy, Check, Send } from 'lucide-react'
import { Section, AnimatedHeading } from '../section'
import { ContactForm } from '../contact-form'
import { personalInfo } from '@/lib/data'

export function Contact() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-20%' })

  return (
    <Section id="contact" label="// 05 — CONTACT" className="py-32">
      <div ref={containerRef} className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left column - Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <AnimatedHeading
              as="h2"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              {"Let's work together"}
            </AnimatedHeading>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-12 leading-relaxed"
            >
              Have a project in mind? Looking to collaborate? Feel free to reach out and I will get back to you as soon as possible.
            </motion.p>

            {/* Contact cards */}
            <div className="space-y-4 mb-8">
              <ContactCard
                icon={Mail}
                label="Email"
                value={personalInfo.email}
                copyable
                delay={0.3}
                isInView={isInView}
              />
              <ContactCard
                icon={MapPin}
                label="Location"
                value={personalInfo.location}
                delay={0.4}
                isInView={isInView}
              />
              <ContactCard
                icon={Clock}
                label="Response time"
                value="Within 24 hours"
                delay={0.5}
                isInView={isInView}
              />
            </div>

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-aurora/10 border border-aurora/30"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-aurora" />
              </span>
              <span className="text-sm font-medium text-aurora">
                Available for new projects
              </span>
            </motion.div>
          </motion.div>

          {/* Right column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-3xl p-8 md:p-10"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </Section>
  )
}

function ContactCard({
  icon: Icon,
  label,
  value,
  copyable,
  delay,
  isInView,
}: {
  icon: typeof Mail
  label: string
  value: string
  copyable?: boolean
  delay: number
  isInView: boolean
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!copyable) return
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      onClick={handleCopy}
      className={`group flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 transition-all ${
        copyable ? 'cursor-pointer hover:bg-card hover:border-border' : ''
      }`}
    >
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-foreground font-medium truncate">{value}</p>
      </div>
      {copyable && (
        <div className="flex-shrink-0">
          {copied ? (
            <Check className="w-5 h-5 text-aurora" />
          ) : (
            <Copy className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      )}
    </motion.div>
  )
}
