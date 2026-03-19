'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Check, AlertCircle, Loader2 } from 'lucide-react'

interface FormData {
  name: string
  email: string
  subject: string
  budget: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const subjects = [
  { value: '', label: 'Select a subject' },
  { value: 'project', label: 'Project Inquiry' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'job', label: 'Job Opportunity' },
  { value: 'other', label: 'Other' },
]

const budgetRanges = [
  { value: '', label: 'Select budget range' },
  { value: 'under-10k', label: 'Under ₹10,000' },
  { value: '10k-20k', label: '₹10,000 - ₹20,000' },
  { value: '20k-30k', label: '₹20,000 - ₹30,000' },
  { value: '30k-plus', label: '₹30,000+' },
]

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    budget: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      // Shake animation for form
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to send')

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', budget: '', message: '' })

      // Reset to idle after showing success
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const showBudget = formData.subject === 'project'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <FormField
        label="Name"
        error={errors.name}
        isFocused={focusedField === 'name'}
      >
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onFocus={() => setFocusedField('name')}
          onBlur={() => setFocusedField(null)}
          placeholder="Your name"
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none py-3"
        />
      </FormField>

      {/* Email */}
      <FormField
        label="Email"
        error={errors.email}
        isFocused={focusedField === 'email'}
      >
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          placeholder="your@email.com"
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none py-3"
        />
      </FormField>

      {/* Subject */}
      <FormField
        label="Subject"
        error={errors.subject}
        isFocused={focusedField === 'subject'}
      >
        <select
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          onFocus={() => setFocusedField('subject')}
          onBlur={() => setFocusedField(null)}
          className="w-full bg-transparent text-foreground focus:outline-none py-3 cursor-pointer"
        >
          {subjects.map((option) => (
            <option key={option.value} value={option.value} className="bg-card">
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      {/* Budget (conditional) */}
      <AnimatePresence>
        {showBudget && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormField
              label="Budget Range"
              isFocused={focusedField === 'budget'}
            >
              <select
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                onFocus={() => setFocusedField('budget')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent text-foreground focus:outline-none py-3 cursor-pointer"
              >
                {budgetRanges.map((option) => (
                  <option key={option.value} value={option.value} className="bg-card">
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message */}
      <FormField
        label="Message"
        error={errors.message}
        isFocused={focusedField === 'message'}
      >
        <textarea
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          onFocus={() => setFocusedField('message')}
          onBlur={() => setFocusedField(null)}
          placeholder="Tell me about your project..."
          rows={4}
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none py-3 resize-none"
        />
      </FormField>

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={status === 'loading'}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${status === 'success'
            ? 'bg-aurora text-white'
            : status === 'error'
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-foreground text-background hover:opacity-90'
          }`}
        style={{ cursor: 'pointer' }}
      >
        {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
        {status === 'success' && <Check className="w-5 h-5" />}
        {status === 'error' && <AlertCircle className="w-5 h-5" />}
        {status === 'idle' && <Send className="w-5 h-5" />}
        <span>
          {status === 'loading' && 'Sending...'}
          {status === 'success' && 'Message Sent!'}
          {status === 'error' && 'Failed to send'}
          {status === 'idle' && 'Send Message'}
        </span>
      </motion.button>
    </form>
  )
}

function FormField({
  label,
  error,
  isFocused,
  children,
}: {
  label: string
  error?: string
  isFocused?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        {label}
      </label>
      <div
        className={`relative border-b-2 transition-colors ${error
            ? 'border-destructive'
            : isFocused
              ? 'border-primary'
              : 'border-border'
          }`}
      >
        {children}
        {/* Animated underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-destructive mt-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
