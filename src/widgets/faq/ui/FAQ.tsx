import { useState } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus, Minus } from 'lucide-react';
import { BalancedHeading } from '@/components/typography/BalancedHeading';
import { FAQ_ITEMS } from '@/content/faq';

const FAQ_TEXT = {
  title: 'Частые вопросы',
} as const;

// Keeps first-visit questions available in the existing accessible accordion.
export default function FAQ() {
  const [openValue, setOpenValue] = useState('');

  return (
    <section id="faq" className="deferred-section relative overflow-hidden py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BalancedHeading as="h2" className="mb-8 text-3xl font-semibold tracking-tight text-white md:mb-12">
          <span>{FAQ_TEXT.title}</span>
        </BalancedHeading>
        <AccordionPrimitive.Root
          type="single"
          collapsible
          value={openValue}
          onValueChange={setOpenValue}
          className="w-full"
        >
          {FAQ_ITEMS.map((faq, index) => (
            <AccordionPrimitive.Item
              key={index}
              value={`faq-${index}`}
              className="border-b border-white/15 last:border-0"
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="group flex min-h-16 w-full items-start justify-between gap-5 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5B800] md:items-center md:py-6">
                  <span className="text-sm font-semibold leading-relaxed text-white transition-colors group-data-[state=open]:text-[#F5B800] motion-reduce:transition-none lg:group-hover:text-[#F5B800]">
                    {faq.question}
                  </span>
                  <div
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center md:mt-0"
                    aria-hidden="true"
                  >
                    {openValue === `faq-${index}` ? (
                      <Minus className="h-5 w-5 text-[#F5B800]" />
                    ) : (
                      <Plus className="h-5 w-5 text-white/60" />
                    )}
                  </div>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>

              <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none">
                <div className="max-w-3xl whitespace-pre-line pb-6 pr-10 text-sm leading-relaxed text-white/70 md:pb-7 md:text-base">
                  {faq.answer}
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </section>
  );
}
