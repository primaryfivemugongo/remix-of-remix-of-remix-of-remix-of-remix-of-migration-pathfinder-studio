import { convertedPdfUrl } from '@/lib/converted-documents';
import { downloadFile } from '@/lib/file-download';
import { useState } from 'react';
import { Download, LoaderCircle, Check, Share2, Link2, Mail, Facebook, Twitter, Send } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { resourceTitle, type ResourceRecord } from '@/lib/resources';
import { documentSlug } from '@/lib/document-metadata';

// Official WhatsApp glyph in its brand green.
function WhatsAppIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
}

export function DocumentShare({ item }: { item: ResourceRecord }) {
  const [copied, setCopied] = useState(false);
  const title = resourceTitle(item);
  const link = () => {
    const url = new URL(`/doc/${documentSlug(item)}`, window.location.origin);
    const here = window.location.pathname.replace(/^\//, '');
    const source = here.startsWith('more/') ? here : new URLSearchParams(window.location.search).get('source');
    if (source?.startsWith('more/')) url.searchParams.set('source', source);
    return url.href;
  };
  const open = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');
  const enc = encodeURIComponent;
  const copy = async () => {
    try { await navigator.clipboard.writeText(link()); setCopied(true); toast.success('Link copied'); window.setTimeout(() => setCopied(false), 2000); }
    catch { toast.error('Could not copy link'); }
  };
  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="source" size="source" className="dg-action dg-share" aria-label={`Share ${title}`} title="Share"><Share2 size={16} /></Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-52">
      <DropdownMenuItem onSelect={() => void copy()}>{copied ? <Check size={16} /> : <Link2 size={16} />} Copy link</DropdownMenuItem>
      <DropdownMenuItem onSelect={() => open(`https://wa.me/?text=${enc(`${title}\n${link()}`)}`)}><WhatsAppIcon /> WhatsApp</DropdownMenuItem>
      <DropdownMenuItem onSelect={() => { window.location.href = `mailto:?subject=${enc(title)}&body=${enc(`${title}\n${link()}`)}`; }}><Mail size={16} /> Email</DropdownMenuItem>
      <DropdownMenuItem onSelect={() => open(`https://www.facebook.com/sharer/sharer.php?u=${enc(link())}`)}><Facebook size={16} /> Facebook</DropdownMenuItem>
      <DropdownMenuItem onSelect={() => open(`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(link())}`)}><Twitter size={16} /> X (Twitter)</DropdownMenuItem>
      <DropdownMenuItem onSelect={() => open(`https://t.me/share/url?url=${enc(link())}&text=${enc(title)}`)}><Send size={16} /> Telegram</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
}

export function DocumentDownload({ item }: { item: ResourceRecord }) {
  const pdf = convertedPdfUrl(item.pdfUrl);
  if (!pdf) return <FileDownload item={item} url={item.pdfUrl} />;
  return <><FileDownload item={item} url={pdf} label="PDF" /><FileDownload item={item} url={item.pdfUrl} label={(item.pdfUrl.split('.').pop() ?? 'Original').toUpperCase()} /></>;
}

function FileDownload({ item, url: fileUrl, label }: { item: ResourceRecord; url: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const download = async () => {
    setState('loading');
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('File unavailable');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = decodeURIComponent(fileUrl.split('/').pop() ?? '') || 'document';
      document.body.appendChild(anchor); anchor.click(); anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      setState('done');
    } catch { setState('error'); }
  };
  return <><Button variant="source" size="source" className="dg-action dg-download" disabled={state === 'loading'} onClick={() => void download()} aria-label={`Download ${resourceTitle(item)}${label ? ` as ${label}` : ''}`}>
    {state === 'loading' ? <LoaderCircle className="dg-spin" size={16} /> : state === 'done' ? <Check size={16} /> : <Download size={16} />}{state === 'loading' ? 'Downloading…' : state === 'done' ? 'Downloaded' : label ? `Download ${label}` : 'Download'}
  </Button>{state === 'error' && <span role="alert" className="dg-download-error">Download unavailable. <a href={fileUrl} target="_blank" rel="noopener noreferrer">Open original file</a></span>}</>;
}