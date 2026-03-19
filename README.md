# hariomgupta.vercel.app

Personal portfolio site. Built to actually load fast and look good, not to win awards for using the most frameworks.

## Stack

- **Framework** — Next.js 14 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS
- **Animations** — Framer Motion + GSAP
- **Physics** — Matter.js (skills section)
- **Smooth scroll** — Lenis
- **Email** — Resend
- **Deployment** — Vercel

## Running locally

```bash
git clone https://github.com/hariomgupta70427/Portfolio
cd Portfolio
npm install
```

Copy the example env file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes | For contact form emails. Free at [resend.com](https://resend.com) |
| `GITHUB_TOKEN` | Optional | GitHub API token. Raises rate limit from 60 to 5000 req/hr |
| `NEXT_PUBLIC_SITE_URL` | Yes | Full URL of your deployed site |

## Project structure

```
app/
├── layout.tsx            # Root layout, fonts, metadata
├── page.tsx              # Main page, imports all sections
├── globals.css           # CSS variables, theme tokens
└── api/contact/          # Contact form API route (Resend)

components/
├── sections/             # Hero, About, Projects, Experience,
│                         # Achievements, Contact
├── layout/               # Navbar, Footer
├── skills-physics.tsx    # Matter.js physics for skills section
├── three-scene.tsx       # Background particle animation
├── custom-cursor.tsx     # Custom cursor (desktop only)
└── magnetic-button.tsx   # Magnetic hover effect on CTAs

lib/
└── data.ts               # All site content — projects, skills,
                          # experience, achievements

public/
├── hg-logo.svg           # Logo used as favicon + navbar
├── skills/               # Tech stack SVG icons (local, no CDN)
└── cv.pdf                # Resume (linked from navbar)
```

## Deploying

Push to GitHub, import on [vercel.com](https://vercel.com), add env variables in Vercel dashboard, deploy.

That's it.
