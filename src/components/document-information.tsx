import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { documentContent } from '@/lib/document-content';

export function DocumentInformation({ content }: { content: ReturnType<typeof documentContent> }) {
  return <>
    <section className="document-description" aria-label="About this document">
      <h2>About this document</h2>
      {content.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    </section>
    {content.questions.length > 0 && <section className="document-questions">
      <h2>Document questions</h2>
      <Accordion type="single" collapsible>
        {content.questions.map((item, index) => <AccordionItem value={`question-${index}`} key={item.question}>
          <AccordionTrigger className="document-question-trigger">{item.question}</AccordionTrigger>
          <AccordionContent className="document-question-answer">{item.answer}</AccordionContent>
        </AccordionItem>)}
      </Accordion>
    </section>}
  </>;
}