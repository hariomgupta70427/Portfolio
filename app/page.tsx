'use client'

import { LenisProvider } from '@/components/lenis-provider'
import { CustomCursor } from '@/components/custom-cursor'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ScrollProgress } from '@/components/scroll-progress'
import { ThreeScene } from '@/components/three-scene'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Projects } from '@/components/sections/projects'
import { Experience } from '@/components/sections/experience'
import { Achievements } from '@/components/sections/achievements'
import { Contact } from '@/components/sections/contact'
import { SectionDivider } from '@/components/section'

export default function Home() {
  return (
    <LenisProvider>
      {/* Custom cursor */}
      <CustomCursor />

      {/* Scroll progress bar */}
      <ScrollProgress />

      {/* 3D Background */}
      <ThreeScene />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero />

        {/* Section Divider */}
        <SectionDivider />

        {/* About Section */}
        <About />

        {/* Section Divider */}
        <SectionDivider />

        {/* Projects Section */}
        <Projects />

        {/* Section Divider */}
        <SectionDivider />

        {/* Experience Section */}
        <Experience />

        {/* Section Divider */}
        <SectionDivider />

        {/* Achievements Section */}
        <Achievements />

        {/* Section Divider */}
        <SectionDivider />

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </LenisProvider>
  )
}
