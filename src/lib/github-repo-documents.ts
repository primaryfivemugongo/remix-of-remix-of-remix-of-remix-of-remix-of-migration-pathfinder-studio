import type { ResourceRecord } from './resources';
import { isDocumentFile } from './document-formats';

const OWNER = 'Fresh-Teacher';
const CACHE_PREFIX = 'repo-docs:v2:';
const CACHE_TTL = 24 * 60 * 60 * 1000;

/** GitHub Pages (Jekyll) hides files and folders starting with these characters. */
const HIDDEN_BY_PAGES = /^[_.#~]/;

/** Public URL for a file inside a Fresh-Teacher repository, with every path segment encoded. */
export function repoFileUrl(repo: string, path: string) {
  const segments = path.split('/');
  const encoded = segments.map(encodeURIComponent).join('/');
  if (segments.some(segment => HIDDEN_BY_PAGES.test(segment))) {
    return `https://raw.githubusercontent.com/${OWNER}/${encodeURIComponent(repo)}/HEAD/${encoded}`;
  }
  const base = repo.toLowerCase() === 'fresh-teacher.github.io' ? 'https://fresh-teacher.github.io' : `https://fresh-teacher.github.io/${repo}`;
  return `${base}/${encoded}`;
}

export function treeToDocuments(repo: string, tree: { path: string; type: string }[]): ResourceRecord[] {
  return tree
    .filter(entry => entry.type === 'blob')
    .map(entry => ({ title: '', description: '', price: '', pdfUrl: repoFileUrl(repo, entry.path) }))
    .filter(item => isDocumentFile(item.pdfUrl));
}

function readCache(repo: string, allowStale = false): ResourceRecord[] | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + repo);
    if (!raw) return null;
    const { at, items } = JSON.parse(raw) as { at: number; items: ResourceRecord[] };
    return allowStale || Date.now() - at < CACHE_TTL ? items : null;
  } catch { return null; }
}

/** Repos whose file lists are already saved in this browser. */
export function cachedRepos(): string[] {
  try {
    return Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX)).map(k => k.slice(CACHE_PREFIX.length));
  } catch { return []; }
}

export async function fetchRepoDocuments(repo: string): Promise<ResourceRecord[]> {
  const fresh = readCache(repo);
  if (fresh) return fresh;
  try {
    const response = await fetch(`https://api.github.com/repos/${OWNER}/${encodeURIComponent(repo)}/git/trees/HEAD?recursive=1`, { headers: { Accept: 'application/vnd.github+json', ...(typeof window === 'undefined' ? { 'User-Agent': 'fresh-teacher-library' } : {}) } });
    if (!response.ok) throw new Error(`GitHub responded ${response.status}`);
    const body = await response.json() as { tree?: { path: string; type: string }[] };
    const items = treeToDocuments(repo, body.tree ?? []);
    try { localStorage.setItem(CACHE_PREFIX + repo, JSON.stringify({ at: Date.now(), items })); } catch { /* quota */ }
    return items;
  } catch (error) {
    // Rate-limited or offline: fall back to an older saved copy when there is one.
    const stale = readCache(repo, true);
    if (stale) return stale;
    throw error;
  }
}
