<div align="center">

# hariomgupta.vercel.app

Personal portfolio — built to load fast, look good, and actually convert visitors into clients.

[![Live](https://img.shields.io/badge/Live-hariomgupta.vercel.app-00F5FF?style=flat)](https://hariomgupta.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-white?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)

</div>

---

## Stack

- **Framework** — Next.js 14 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS
- **Animations** — Framer Motion + GSAP + ScrollTrigger
- **Physics** — Matter.js (skills section)
- **Smooth scroll** — Lenis
- **3D / Particles** — Three.js
- **Email** — Resend
- **Analytics** — Vercel Analytics
- **Deployment** — Vercel

---

## Running locally

```bash
git clone https://github.com/hariomgupta70427/Portfolio
cd Portfolio
pnpm install
```

Copy the env file:

```bash
cp .env.local.example .env.local
```

Fill in the values, then:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable | Required | What it's for |
|---|---|---|
| `RESEND_API_KEY` | Yes | Contact form emails. Free at [resend.com](https://resend.com) |
| `GITHUB_TOKEN` | Optional | GitHub API — raises rate limit from 60 to 5000 req/hr |
| `NEXT_PUBLIC_SITE_URL` | Yes | Full URL of the deployed site |

---

## Project structure

```
app/
  layout.tsx          # Root layout, fonts, SEO metadata
  page.tsx            # Main page — all sections assembled here
  globals.css         # CSS variables, theme tokens, dark/light
  api/contact/        # Contact form handler (Resend)

components/
  sections/           # Hero, About, Projects, Experience,
                      # Achievements, GitHubStats, Contact
  layout/             # Navbar, Footer
  skills-physics.tsx  # Matter.js physics — skill icons
  three-scene.tsx     # Particle field background (Three.js)
  custom-cursor.tsx   # Glowing cursor (desktop only)
  magnetic-button.tsx # Magnetic hover on CTA buttons
  project-modal.tsx   # Full-screen project detail overlay

lib/
  data.ts             # All content — projects, skills,
                      # experience, achievements

public/
  hg-logo.svg         # Logo + favicon
  skills/             # Tech stack SVG icons (local, no CDN)
  cv.pdf              # Resume (linked from navbar)
```

---

## What's notable

A few things that aren't standard in most portfolio templates:

**Matter.js physics on skills** — the skill icons in the About section are actual physics bodies. They fall, collide, bounce, and you can drag them around.

**Three.js particle field** — the hero background is a WebGL particle system where nodes connect based on proximity and react to mouse movement.

**GitHub live data** — project cards pull star and fork counts from the GitHub API in real time (cached hourly).

**Mobile performance** — animations are conditionally disabled or simplified on touch devices. Three.js particle count drops to 60 on mobile. Custom cursor is disabled entirely.

---

## Lighthouse

| Metric | Score |
|---|---|
| Performance | 90+ |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 95+ |

---

## Contact

Built by [Hariom Gupta](https://hariomgupta.vercel.app) — available for freelance.

guptahariom049@gmail.com
