import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { documentContent } from '@/lib/document-content';
import { formatSize } from '@/lib/file-sizes';

export function DocumentInformation({ content, bytes }: { content: ReturnType<typeof documentContent>; bytes: number | null }) {
  const facts = [
    { label: 'Document Name', value: content.title },
    { label: 'Resource Type', value: content.metadata.kind },
    { label: 'Size', value: bytes != null ? formatSize(bytes) : undefined },
    { label: 'File Format', value: content.format || undefined },
    { label: 'Subject', value: content.metadata.subject },
    { label: 'Class level', value: content.facts.find(fact => fact.label === 'Class')?.value },
    { label: 'Year', value: content.metadata.year },
    { label: 'Term', value: content.metadata.term },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));
  return <Accordion type="multiple" className="document-information">
    <AccordionItem value="about" className="document-information-section">
      <AccordionTrigger className="document-section-trigger">About this document</AccordionTrigger>
      <AccordionContent>
        <dl className="document-facts" aria-label="Document details">
          {facts.map(({ label, value }) => <div key={label}><dt>{label}:</dt><dd>{value}</dd></div>)}
        </dl>
      </AccordionContent>
    </AccordionItem>
    {content.questions.length > 0 && <AccordionItem value="faqs" className="document-information-section">
      <AccordionTrigger className="document-section-trigger">FAQs</AccordionTrigger>
      <AccordionContent>
        <Accordion type="single" collapsible>
          {content.questions.map((item, index) => <AccordionItem value={`question-${index}`} key={item.question}>
            <AccordionTrigger className="document-question-trigger">{item.question}</AccordionTrigger>
            <AccordionContent className="document-question-answer">{item.answer}</AccordionContent>
          </AccordionItem>)}
        </Accordion>
      </AccordionContent>
    </AccordionItem>}
  </Accordion>;
}