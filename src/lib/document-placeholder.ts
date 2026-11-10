import { archiveExtensions, documentExtension } from '@/lib/document-formats';
import pdf from '@/assets/file-types/pdf.png.asset.json';
import word from '@/assets/file-types/word.webp.asset.json';
import excel from '@/assets/file-types/excel.png.asset.json';
import powerpoint from '@/assets/file-types/powerpoint.png.asset.json';
import archive from '@/assets/file-types/archive.jpeg.asset.json';
import rtf from '@/assets/file-types/rtf.png.asset.json';
import txt from '@/assets/file-types/txt.png.asset.json';

const placeholders = { pdf, word, excel, powerpoint, archive, rtf, txt };

export function documentPlaceholder(url: string) {
  const extension = documentExtension(url);
  if (extension === 'pdf') return placeholders.pdf;
  if (['doc', 'docx'].includes(extension)) return placeholders.word;
  if (['xls', 'xlsx'].includes(extension)) return placeholders.excel;
  if (['ppt', 'pptx', 'pps', 'ppsx'].includes(extension)) return placeholders.powerpoint;
  if (extension === 'rtf') return placeholders.rtf;
  if (extension === 'txt') return placeholders.txt;
  if (archiveExtensions.includes(extension)) return placeholders.archive;
  return null;
}
