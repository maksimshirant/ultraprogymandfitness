
import { useMemo, useState } from 'react';
import { ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';
import PublicAssetImage from '@/components/PublicAssetImage';
import { trainerCategories, trainers, type TrainerCategory, type TrainerProfile } from '@/content/trainers';
import { BalancedHeading } from '@/components/typography/BalancedHeading';
import { cn } from '@/lib/utils';
import type { OpenModalHandler } from '@/types/modal';

interface PersonalProps {
  onOpenModal: OpenModalHandler;
}

const PERSONAL_TEXT = {
  heroTitle: 'Тренеры',
  heroAccent: 'Ultra Pro',
  heroSubtitle:
    'Команда специалистов по силовому тренингу, восстановлению и единоборствам. Подберите тренера под цель, уровень подготовки и удобный формат занятий.',
  heroPrimaryCta: 'Я выбрал тренера',
  heroSecondaryCta: 'Выбрать тренера',
  heroScrollHintAria: 'Прокрутить к списку тренеров',
  sectionTitle: 'Наши',
  sectionTitleAccent: 'тренеры',
  sectionSubtitle: 'Выберите специалиста по направлению и запишитесь на персональную тренировку.',
  showMore: 'Подробнее о тренере',
  showLess: 'Скрыть',
  cta: 'Записаться на тренировку',
  prevAria: 'Предыдущий тренер',
  nextAria: 'Следующий тренер',
  selectAriaPrefix: 'Выбрать тренера',
  selectCategoryAria: 'Выбрать категорию тренеров',
} as const;

const CLUB_LOGO_SRC = `${import.meta.env.BASE_URL}logo.webp`;

// Formats existing qualifications as plain text, retaining specialization labels.
function renderAchievement(achievement: string, index: number) {
  const trimmedAchievement = achievement.trim();
  return (
    <li key={index} className={cn(
      'text-sm leading-relaxed text-white/70',
      trimmedAchievement.startsWith('-') && 'pl-4',
      trimmedAchievement.endsWith(':') && 'pt-2 font-semibold text-white',
    )}>{achievement}</li>
  );
}

// Keeps the team photos, booking actions and expandable qualifications in a readable catalog.
export default function Personal({ onOpenModal }: PersonalProps) {
  const [activeCategory, setActiveCategory] = useState<TrainerCategory>('personal');
  const [expandedTrainerId, setExpandedTrainerId] = useState<number | null>(null);
  const filteredTrainers = useMemo(
    () => trainers.filter((trainer) => trainer.category === activeCategory),
    [activeCategory]
  );

  // Resets the open biography when switching between the existing trainer categories.
  const selectCategory = (category: TrainerCategory) => {
    setExpandedTrainerId(null);
    setActiveCategory(category);
  };

  // Moves directly to the team while respecting reduced-motion preferences.
  const scrollToTrainers = () => {
    document.getElementById('trainers')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
  };

  // Keeps the name and actions on the photo while details fade into its upper area.
  const renderTrainerCard = (trainer: TrainerProfile) => {
    const isExpanded = expandedTrainerId === trainer.id;
    return (
      <article key={trainer.id} data-expanded={isExpanded} className="trainer-photo-card relative aspect-[3/4] min-w-0 self-start overflow-hidden rounded-sm bg-[#101114]">
        {trainer.image ? (
          <PublicAssetImage src={trainer.image} alt={trainer.name} loading="lazy" fetchPriority="low"
            sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw" variantSuffix="preview" deferUntilVisible
            pictureClassName="absolute inset-0 block h-full w-full"
            className={cn('h-full w-full object-cover object-top', trainer.imageClassName)} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <img src={CLUB_LOGO_SRC} alt="Логотип Ultra Pro Gym & Fitness" loading="lazy" decoding="async" className="h-auto w-full max-w-48 object-contain brightness-0 invert opacity-70" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_25%,rgba(0,0,0,0.65)_62%,rgba(0,0,0,0.95)_100%)]" aria-hidden="true" />
        <div className="trainer-photo-details-shade pointer-events-none absolute inset-0 bg-[#08090c]/95" aria-hidden="true" />
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
          <div id={`trainer-details-${trainer.id}`} className="trainer-photo-details" aria-hidden={!isExpanded} inert={!isExpanded}>
            <div className="trainer-photo-details-scroll h-full min-h-0 overflow-y-auto overscroll-contain pr-2" tabIndex={isExpanded ? 0 : -1} role="region" aria-label={`О тренере ${trainer.name}`}>
              <p className="text-sm leading-relaxed text-white/85">{trainer.summary}</p>
              <h4 className="mb-3 mt-5 text-sm font-semibold text-white">Образование и квалификация</h4>
              <ul className="space-y-3">
                {trainer.achievements.map((achievement, index) => renderAchievement(achievement, index))}
              </ul>
            </div>
          </div>
          <div className="relative shrink-0">
            {trainer.role ? <p className="mb-2 text-xs font-medium text-white/80">{trainer.role}</p> : null}
            <h3 className="text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl">{trainer.name}</h3>
            <p className="mt-2 text-sm text-white/75">{trainer.experience}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <button type="button" onClick={() => onOpenModal({ topic: 'personal', trainer: trainer.name })} className="home-secondary-action gap-2 px-3 py-3">
                Запись
              </button>
              <button type="button" onClick={() => setExpandedTrainerId((prev) => prev === trainer.id ? null : trainer.id)}
                aria-expanded={isExpanded} aria-controls={`trainer-details-${trainer.id}`}
                aria-label={`${isExpanded ? 'Скрыть информацию о тренере' : PERSONAL_TEXT.showMore} ${trainer.name}`}
                className="home-text-link inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-white">
                {isExpanded ? PERSONAL_TEXT.showLess : 'Подробнее'}
                {isExpanded ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="club-page relative overflow-x-clip">
      <header className="club-page-hero">
        <div className="club-page-header mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BalancedHeading as="h1" className="club-page-title"><span>{PERSONAL_TEXT.heroTitle}</span></BalancedHeading>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">{PERSONAL_TEXT.heroSubtitle}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <button type="button" onClick={() => onOpenModal({ topic: 'personal' })} className="home-secondary-action w-full gap-3 px-5 py-3.5 sm:w-auto">
              Запись
            </button>
            <button type="button" onClick={scrollToTrainers} className="home-text-link home-mobile-action w-full gap-3 px-5 py-3.5 sm:w-auto">
              {PERSONAL_TEXT.heroSecondaryCta}<ArrowDown className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/60">* Запись на индивидуальную тренировку необходимо производить заранее. Индивидуальные тренировки оплачиваются отдельно.</p>
        </div>
      </header>

      <section id="trainers" className="scroll-mt-28 pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-white/15" role="group" aria-label="Категории тренеров">
            {trainerCategories.map((category) => (
              <button key={category.id} type="button" onClick={() => selectCategory(category.id)} aria-pressed={category.id === activeCategory} aria-label={category.label}
                className={cn('home-text-link min-h-12 border-b-2 py-3 text-left text-sm font-medium md:text-base',
                  category.id === activeCategory ? 'border-[#F5B800] text-white' : 'border-transparent text-white/60')}>
                <span className="sm:hidden">{category.id === 'personal' ? 'Персональные' : 'Групповые'}</span>
                <span className="hidden sm:inline">{category.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-10">
            {filteredTrainers.map((trainer) => renderTrainerCard(trainer))}
          </div>
        </div>
      </section>
    </div>
  );
}
