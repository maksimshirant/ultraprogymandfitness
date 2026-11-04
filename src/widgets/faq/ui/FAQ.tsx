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
    <section id="faq" className="deferred-section relative overflow-hidden py-14 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BalancedHeading as="h2" className="mb-8 text-3xl font-semibold tracking-tight text-white md:mb-12">
          <span>{FAQ_TEXT.title}</span>
        </BalancedHeading>
        <AccordionPrimitive.Root
          type="single"
          collapsible
          value={openValue}
          onValueChange={setOpenValue}
          className="space-y-4"
        >
          {FAQ_ITEMS.map((faq, index) => (
            <AccordionPrimitive.Item
              key={index}
              value={`faq-${index}`}
              className="border-b border-white/10 last:border-0"
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="w-full py-4 flex items-center justify-between text-left group">
                  <span className="text-white font-semibold text-lg pr-4 lg:group-hover:text-[#F5B800] transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/20 transition-[background-color,border-color,color,transform] ${
                      openValue === `faq-${index}` ? 'bg-white/10 border-[#F5B800]' : ''
                    }`}
                  >
                    {openValue === `faq-${index}` ? (
                      <Minus className="w-4 h-4 text-[#F5B800]" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>

              <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="pb-6 text-gray-400 whitespace-pre-line leading-relaxed">
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
