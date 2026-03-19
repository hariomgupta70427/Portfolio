'use client'

import { useState, useEffect } from 'react'

interface GitHubRepoData {
  stars: number
  forks: number
  language: string | null
  updatedAt: string
  openIssues: number
}

// Map from project name → GitHub repo name
const REPO_MAP: Record<string, string> = {
  'QRail': 'QRail-Apk',
  'Medical AI Discovery Platform': 'medical-ai-platform',
  'HLedger': 'HLedger',
  'HariWave': 'HariWave',
  'HaRiverse': 'HaRiverse',
  'Jarvis-AI': 'Jarvis-AI',
}

// Simple in-memory cache to avoid refetching on re-renders
const cache = new Map<string, { data: GitHubRepoData; fetchedAt: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export function useGitHubStats(
  projectName: string,
  defaults: { stars: number; forks: number }
) {
  const [data, setData] = useState<GitHubRepoData>({
    ...defaults,
    language: null,
    updatedAt: '',
    openIssues: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const repoName = REPO_MAP[projectName]
    if (!repoName) {
      setLoading(false)
      return
    }

    // Check cache
    const cached = cache.get(repoName)
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      setData(cached.data)
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchData() {
      try {
        const res = await fetch(
          `https://api.github.com/repos/hariomgupta70427/${repoName}`,
          {
            headers: { Accept: 'application/vnd.github.v3+json' },
          }
        )

        if (!res.ok) {
          setLoading(false)
          return
        }

        const json = await res.json()
        const repoData: GitHubRepoData = {
          stars: json.stargazers_count ?? defaults.stars,
          forks: json.forks_count ?? defaults.forks,
          language: json.language ?? null,
          updatedAt: json.pushed_at ?? '',
          openIssues: json.open_issues_count ?? 0,
        }

        cache.set(repoName!, { data: repoData, fetchedAt: Date.now() })

        if (!cancelled) {
          setData(repoData)
        }
      } catch {
        // Silently fall through — use defaults
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [projectName, defaults.stars, defaults.forks])

  return { data, loading }
}
