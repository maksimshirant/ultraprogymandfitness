import { Dumbbell, Smile, HeartPulse } from 'lucide-react';

const PROFIT_TEXT = {
  title: 'А еще...',
  titleAccent: 'тренировки способствуют',
} as const;

const profit = [
  {
    id: 1,
    title: 'Укреплению мышц и суставов',
    description:
      'Регулярные силовые тренировки повышают мышечную силу, улучшают стабильность суставов и помогают легче переносить бытовые и рабочие нагрузки.',
    icon: Dumbbell,
  },
  {
    id: 2,
    title: 'Повышению настроения и энергии',
    description:
      'Физическая активность улучшает эмоциональный фон за счёт нейрохимических изменений, снижает уровень стресса и помогает сохранять продуктивность в течение дня.',
    icon: Smile,
  },
  {
    id: 3,
    title: 'Лучшей работе сердца и выносливости',
    description:
      'Тренировки развивают кардиореспираторную выносливость: сердцу и лёгким проще справляться с нагрузкой, а восстановление после активности происходит быстрее.',
    icon: HeartPulse,
  },
];

export default function Profit() {
  return (
    <section className="py-14 relative overflow-hidden">
      <div className="hero-glow-layer">
        <div className="hero-glow-top-right" />
        <div className="hero-glow-bottom-left" />
        <div className="hero-glow-center" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="section-title text-white">
            {PROFIT_TEXT.title}
            <span className="relative inline-block">
              <span className="relative z-10">{PROFIT_TEXT.titleAccent}</span>
              <span className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 md:h-2.5 lg:h-3 bg-gradient-to-r from-[#F5B800] to-[#D89B00] -z-0" />
            </span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {profit.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.id}
                className="glass-card border border-white/10 hover:bg-white/5 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F5B800] to-[#D89B00] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
