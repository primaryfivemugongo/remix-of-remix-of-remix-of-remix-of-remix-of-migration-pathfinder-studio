import { describe, expect, it } from 'vitest';
import { MORE_DOCUMENTS, moreDocumentsClass } from '@/data/more-documents';
import { treeToDocuments } from '@/lib/github-repo-documents';

describe('More Documents menu', () => {
  it('names P5 repo as Mixed P5 Documents', () => {
    expect(MORE_DOCUMENTS['p5']).toContainEqual({ repo: 'p5', label: 'Mixed P5 Documents' });
  });
  it('names s5-past-papers as Mixed S5 Past Papers', () => {
    expect(MORE_DOCUMENTS['s5']).toContainEqual({ repo: 's5-past-papers', label: 'Mixed S5 Past Papers' });
  });
  it('maps class pages to their class', () => {
    expect(moreDocumentsClass('p5.html')).toBe('p5');
    expect(moreDocumentsClass('p.6.html')).toBe('p6');
    expect(moreDocumentsClass('PrimaryFiveMTCPastPapers.html')).toBeNull();
  });
  it('builds document links from the repo files', () => {
    const docs = treeToDocuments('s5-past-papers', [{ path: 'BIO 1.pdf', type: 'blob' }, { path: 'README.md', type: 'blob' }]);
    expect(docs.map(d => d.pdfUrl)).toEqual(['https://fresh-teacher.github.io/s5-past-papers/BIO%201.pdf']);
  });
  it('serves files hidden by GitHub Pages from raw GitHub with # encoded', () => {
    const docs = treeToDocuments('p5', [{ path: '#CREATIVE P5.pdf', type: 'blob' }]);
    expect(docs[0]?.pdfUrl).toBe('https://raw.githubusercontent.com/Fresh-Teacher/p5/HEAD/%23CREATIVE%20P5.pdf');
  });
});
