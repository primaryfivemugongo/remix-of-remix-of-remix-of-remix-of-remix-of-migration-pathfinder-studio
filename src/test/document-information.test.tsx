import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { DocumentInformation } from '@/components/document-information';
import { documentContent } from '@/lib/document-content';

afterEach(cleanup);
const content = documentContent({ pdfUrl: 'https://fresh-teacher.github.io/P.4_MTC_NOTES_2024.pdf', description: '', price: 5000 });

it('starts document information collapsed and lets visitors toggle it', () => {
  const { container } = render(<DocumentInformation content={content} bytes={1024} />);
  const triggers = screen.getAllByRole('button');
  expect(triggers).toHaveLength(2);
  const about = triggers[0];
  if (!about) throw new Error('Missing document information control');
  for (const trigger of triggers) expect(trigger.getAttribute('aria-expanded')).toBe('false');
  expect(container.querySelector('dl')).toBeNull();
  fireEvent.click(about);
  expect(about.getAttribute('aria-expanded')).toBe('true');
  expect(container.querySelector('dl')).not.toBeNull();
  fireEvent.click(about);
  expect(about.getAttribute('aria-expanded')).toBe('false');
});

it('keeps FAQs independently collapsed until requested', () => {
  render(<DocumentInformation content={content} bytes={null} />);
  const [about, faqs] = screen.getAllByRole('button');
  if (!about || !faqs) throw new Error('Missing information controls');
  fireEvent.click(faqs);
  expect(faqs.getAttribute('aria-expanded')).toBe('true');
  expect(about.getAttribute('aria-expanded')).toBe('false');
  const questions = screen.getAllByRole('button').slice(2);
  expect(questions.length).toBeGreaterThan(0);
  for (const question of questions) expect(question.getAttribute('aria-expanded')).toBe('false');
  const question = questions[0];
  if (!question) throw new Error('Missing FAQ control');
  fireEvent.click(question);
  expect(question.getAttribute('aria-expanded')).toBe('true');
  fireEvent.click(faqs);
  expect(faqs.getAttribute('aria-expanded')).toBe('false');
});