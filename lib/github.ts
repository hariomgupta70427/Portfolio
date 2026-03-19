// Map from project name → GitHub repo name
const REPO_MAP: Record<string, string> = {
  'QRail': 'QRail-Apk',
  'Medical AI Discovery Platform': 'medical-ai-platform',
  'HLedger': 'HLedger',
  'HariWave': 'HariWave',
  'HaRiverse': 'HaRiverse',
  'Jarvis-AI': 'Jarvis-AI',
}

export interface GitHubRepoData {
  stars: number
  forks: number
  language: string | null
  updatedAt: string
  openIssues: number
}

/**
 * Fetch live GitHub stats for a given project name.
 * Uses Next.js ISR cache (`revalidate: 3600` = 1 hour).
 * Falls back to provided defaults on error.
 */
export async function fetchRepoData(
  projectName: string,
  defaults: { stars: number; forks: number }
): Promise<GitHubRepoData> {
  const repoName = REPO_MAP[projectName]
  if (!repoName) return { ...defaults, language: null, updatedAt: '', openIssues: 0 }

  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    }
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const res = await fetch(
      `https://api.github.com/repos/hariomgupta70427/${repoName}`,
      {
        headers,
        next: { revalidate: 3600 }, // cache for 1 hour
      }
    )

    if (!res.ok) {
      console.warn(`GitHub API ${res.status} for ${repoName}`)
      return { ...defaults, language: null, updatedAt: '', openIssues: 0 }
    }

    const data = await res.json()
    return {
      stars: data.stargazers_count ?? defaults.stars,
      forks: data.forks_count ?? defaults.forks,
      language: data.language ?? null,
      updatedAt: data.pushed_at ?? '',
      openIssues: data.open_issues_count ?? 0,
    }
  } catch (error) {
    console.error(`Failed to fetch GitHub data for ${repoName}:`, error)
    return { ...defaults, language: null, updatedAt: '', openIssues: 0 }
  }
}

/**
 * Fetch live GitHub data for ALL projects at once.
 * Returns a Map keyed by project name.
 */
export async function fetchAllRepoData(
  projects: Array<{ name: string; stars: number; forks: number }>
): Promise<Map<string, GitHubRepoData>> {
  const entries = await Promise.all(
    projects.map(async (p) => {
      const data = await fetchRepoData(p.name, { stars: p.stars, forks: p.forks })
      return [p.name, data] as const
    })
  )
  return new Map(entries)
}
