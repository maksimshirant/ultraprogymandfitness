import PreviewCard from '@/shared/ui/PreviewCard';
import { BalancedHeading, HeadingAccent } from '@/shared/ui/typography/BalancedHeading';

const previewCards = [
  {
    imageSrc: `${import.meta.env.BASE_URL}floors/floor2/crossfit-zone/5.jpg`,
    title: 'Тренеры',
    buttonLabel: 'Выбрать тренера',
    route: '/trainers',
    description: 'Команда специалистов, которые помогут выстроить программу и держать стабильный прогресс.',
    reverse: true,
  },
  {
    imageSrc: `${import.meta.env.BASE_URL}floors/floor2/group-workouts/5.jpg`,
    title: 'Групповые тренировки',
    buttonLabel: 'Выбрать направление',
    route: '/schedule',
    description:
      'Все направления клуба на одной странице: кому подходит формат, кто ведет занятия и как быстро записаться.',
  },
  {
    imageSrc: `${import.meta.env.BASE_URL}floors/floor1/RESEPTION/1.jpg?v=20260516`,
    title: 'Абонементы',
    buttonLabel: 'Выбрать абонемент',
    route: '/memberships',
    description: 'Подберите формат посещения: от быстрого старта до годового плана с понятными условиями.',
    reverse: true,
  },
] as const;

// Renders the reusable home navigation cards as a standalone page widget.
export default function HomePreviews() {
  return (
    <section id="home-previews" className="deferred-section relative overflow-hidden py-16 md:py-20 lg:py-24">
      <div className="hero-glow-layer">
        <div className="hero-glow-top-right" />
        <div className="hero-glow-bottom-left" />
        <div className="hero-glow-center" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-10 md:mb-12">
          <BalancedHeading as="h2" className="section-title text-white">
            <HeadingAccent>Разделы</HeadingAccent>
          </BalancedHeading>
        </div>

        <div className="space-y-8 md:space-y-12 lg:space-y-14">
          {previewCards.map((card) => (
            <PreviewCard key={card.route} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
