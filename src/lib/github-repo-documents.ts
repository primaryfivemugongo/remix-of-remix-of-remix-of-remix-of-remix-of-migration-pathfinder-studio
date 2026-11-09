import type { ResourceRecord } from './resources';
import { isDocumentFile } from './document-formats';

const OWNER = 'Fresh-Teacher';

/** Public GitHub Pages URL for a file inside a Fresh-Teacher repository. */
export function repoFileUrl(repo: string, path: string) {
  const base = repo.toLowerCase() === 'fresh-teacher.github.io' ? 'https://fresh-teacher.github.io' : `https://fresh-teacher.github.io/${repo}`;
  return `${base}/${path}`;
}

export function treeToDocuments(repo: string, tree: { path: string; type: string }[]): ResourceRecord[] {
  return tree
    .filter(entry => entry.type === 'blob')
    .map(entry => ({ title: '', description: '', price: '', pdfUrl: repoFileUrl(repo, entry.path) }))
    .filter(item => isDocumentFile(item.pdfUrl));
}

export async function fetchRepoDocuments(repo: string): Promise<ResourceRecord[]> {
  const cacheKey = `repo-docs:${repo}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as ResourceRecord[];
  } catch { /* storage unavailable */ }
  const response = await fetch(`https://api.github.com/repos/${OWNER}/${encodeURIComponent(repo)}/git/trees/HEAD?recursive=1`, { headers: { Accept: 'application/vnd.github+json', ...(typeof window === 'undefined' ? { 'User-Agent': 'fresh-teacher-library' } : {}) } });
  if (!response.ok) throw new Error(`GitHub responded ${response.status}`);
  const body = await response.json() as { tree?: { path: string; type: string }[] };
  const items = treeToDocuments(repo, body.tree ?? []);
  try { sessionStorage.setItem(cacheKey, JSON.stringify(items)); } catch { /* quota */ }
  return items;
}
