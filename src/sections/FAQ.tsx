import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';

const FAQ_TEXT = {
  title: 'Частые вопросы',
} as const;

const faqs = [
  {
    question: 'Нужна ли предварительная запись в клуб?',
    answer:
      'Нет, для посещения тренажерного зала запись не обязательна. Если хотите персональную тренировку или массаж, лучше записаться заранее через форму на сайте.',
  },
  {
    question: 'Что взять с собой на первую тренировку?',
    answer:
      'Возьмите спортивную одежду, сменную чистую обувь, полотенце и воду. При необходимости тренер подскажет, как безопасно начать и подобрать нагрузку.',
  },
  {
    question: 'Есть ли пробное посещение?',
    answer:
      'Да, в клубе доступно разовое посещение. Это удобный формат, чтобы познакомиться с оборудованием, атмосферой и выбрать подходящий абонемент.',
  },
  {
    question: 'Можно ли заморозить абонемент?',
    answer:
      'Да, в отдельных случаях заморозка возможна. Условия и срок зависят от типа абонемента, уточните детали у администратора клуба.',
  },
  {
    question: 'Входит ли сауна в абонемент?',
    answer:
      'Да, сауна включена в основные форматы абонементов. Для дневного формата действует общее ограничение по времени посещения клуба.',
  },
  {
    question: 'Групповые тренировки входят в стоимость?',
    answer:
      'Групповые занятия доступны, но оплачиваются отдельно. Актуальные направления и расписание можно уточнить у администратора.',
  },
  {
    question: 'Подходит ли зал для новичков?',
    answer:
      'Да, клуб подходит для любого уровня подготовки. Можно начать с базовой программы и постепенно увеличивать нагрузку под контролем тренера.',
  },
  {
    question: 'Как оформить абонемент?',
    answer:
      'Оставьте заявку через кнопку "Приобрести абонемент", и администратор свяжется с вами, поможет выбрать тариф и ответит на все вопросы.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-14 md:py-24 relative overflow-hidden">
      <div className="hero-glow-layer">
        <div className="hero-glow-top-right" />
        <div className="hero-glow-bottom-left" />
        <div className="hero-glow-center" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BalancedHeading as="h2" className="section-title text-white mb-12 text-center">
          <HeadingAccent>{FAQ_TEXT.title}</HeadingAccent>
        </BalancedHeading>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-white/10 last:border-0"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-4 flex items-center justify-between text-left group"
              >
                <span className="text-white font-semibold text-lg pr-4 lg:group-hover:text-[#F5B800] transition-colors">
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 transition-all ${
                  openIndex === index ? 'bg-white/10 border-[#F5B800]' : ''
                }`}>
                  {openIndex === index ? (
                    <Minus className="w-4 h-4 text-[#F5B800]" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-[800px] pb-6' : 'max-h-0'
                }`}
              >
                <div className="text-gray-400 whitespace-pre-line leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
