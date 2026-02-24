import { Play } from 'lucide-react';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';

interface VideoSectionProps {
  onOpenVideo: () => void;
}

const VIDEO_SECTION_TEXT = {
  title: 'Видео',
  titleAccent: 'Ultra Pro',
  subtitle: 'Короткий клип о тренировках и атмосфере клуба.',
  cta: 'Смотреть видео',
} as const;

export default function VideoSection({ onOpenVideo }: VideoSectionProps) {
  return (
    <section id="video" className="py-10 md:py-14 relative overflow-hidden scroll-mt-24">
      <div className="hero-glow-layer">
        <div className="hero-glow-top-right" />
        <div className="hero-glow-bottom-left" />
        <div className="hero-glow-center" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <BalancedHeading as="h2" className="section-title text-white text-center">
          {VIDEO_SECTION_TEXT.title} <HeadingAccent>{VIDEO_SECTION_TEXT.titleAccent}</HeadingAccent>
        </BalancedHeading>
        <p className="section-subtitle mx-auto text-center">
          {VIDEO_SECTION_TEXT.subtitle}
        </p>

        <div className="mt-8 md:mt-10 mx-auto w-full max-w-[420px] lg:max-w-[460px]">
          <button
            type="button"
            onClick={onOpenVideo}
            className="group glass-card p-2 sm:p-3 border border-white/10 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800]"
            aria-label={VIDEO_SECTION_TEXT.cta}
          >
            <div
              className="relative w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#1A1A27] via-[#111117] to-[#0A0A0F]"
              style={{ aspectRatio: '9 / 16' }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(245,184,0,0.22),transparent_58%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-black font-semibold transition-all lg:group-hover:scale-105 lg:group-hover:bg-[#F5B800]">
                  <Play className="w-4 h-4 fill-black" />
                  {VIDEO_SECTION_TEXT.cta}
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
