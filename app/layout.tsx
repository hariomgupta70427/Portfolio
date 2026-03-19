import type { Metadata, Viewport } from 'next'
import { Syne, JetBrains_Mono, Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hariomgupta.vercel.app'),
  title: 'Hariom Gupta — Flutter & Full-Stack Developer',
  description: 'B.Tech IT student at GGSIPU building AI-powered mobile apps and web platforms. Smart India Hackathon participant. Available for freelance.',
  keywords: ['Hariom Gupta', 'Flutter Developer', 'Full Stack Developer', 'AI Developer', 'React', 'Next.js', 'Mobile Development', 'Portfolio'],
  authors: [{ name: 'Hariom Gupta' }],
  creator: 'Hariom Gupta',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hariomgupta.vercel.app',
    title: 'Hariom Gupta — Flutter & Full-Stack Developer',
    description: 'B.Tech IT student at GGSIPU building AI-powered mobile apps and web platforms. Smart India Hackathon participant.',
    siteName: 'Hariom Gupta Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hariom Gupta — Flutter & Full-Stack Developer',
    description: 'B.Tech IT student at GGSIPU building AI-powered mobile apps and web platforms. Smart India Hackathon participant.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/hg-logo.svg',
    shortcut: '/hg-logo.svg',
    apple: '/hg-logo.svg',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f8fc' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a12' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/hg-logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/hg-logo.svg" />
      </head>
      <body className={`${syne.variable} ${jetbrainsMono.variable} ${outfit.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
