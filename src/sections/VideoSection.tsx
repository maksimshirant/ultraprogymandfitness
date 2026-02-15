import { Play } from 'lucide-react';

interface VideoSectionProps {
  onOpenVideo: () => void;
}

const VIDEO_SECTION_TEXT = {
  title: 'Узнайте больше о том, как работает Brain.fm',
  tags: ['Resistance', 'Interruption', 'Distraction', 'Fatigue'] as const,
  cta: 'Смотреть видео',
  duration: '0:58',
} as const;

export default function VideoSection({ onOpenVideo }: VideoSectionProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E2A700]/10 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Title */}
        <h2 className="section-title text-white text-center mb-12">
          {VIDEO_SECTION_TEXT.title}
        </h2>

        {/* Video Container */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5B800] via-[#F5B800] to-[#D89B00]">
            {/* Animated waves */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F5B800" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#F5B800" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#F5B800" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F5B800" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#F5B800" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              
              {/* Wave 1 */}
              <path
                d="M0,100 Q100,50 200,100 T400,100 T600,100 T800,100 T1000,100 T1200,100"
                fill="none"
                stroke="url(#waveGrad1)"
                strokeWidth="3"
                className="wave-animation"
                style={{ animationDelay: '0s' }}
              />
              
              {/* Wave 2 */}
              <path
                d="M0,120 Q100,70 200,120 T400,120 T600,120 T800,120 T1000,120 T1200,120"
                fill="none"
                stroke="url(#waveGrad2)"
                strokeWidth="3"
                className="wave-animation"
                style={{ animationDelay: '0.5s' }}
              />
              
              {/* Wave 3 */}
              <path
                d="M0,140 Q100,90 200,140 T400,140 T600,140 T800,140 T1000,140 T1200,140"
                fill="none"
                stroke="url(#waveGrad1)"
                strokeWidth="3"
                className="wave-animation"
                style={{ animationDelay: '1s' }}
              />
              
              {/* Wave 4 */}
              <path
                d="M0,160 Q100,110 200,160 T400,160 T600,160 T800,160 T1000,160 T1200,160"
                fill="none"
                stroke="url(#waveGrad2)"
                strokeWidth="3"
                className="wave-animation"
                style={{ animationDelay: '1.5s' }}
              />
            </svg>

            {/* Floating labels */}
            <div className="absolute top-1/4 left-1/4 glass-card px-4 py-2 float-animation" style={{ animationDelay: '0s' }}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#F5B800]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                </svg>
                <span className="text-white text-sm">{VIDEO_SECTION_TEXT.tags[0]}</span>
              </div>
            </div>

            <div className="absolute top-1/3 right-1/4 glass-card px-4 py-2 float-animation" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#FFD247]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-white text-sm">{VIDEO_SECTION_TEXT.tags[1]}</span>
              </div>
            </div>

            <div className="absolute bottom-1/3 left-1/3 glass-card px-4 py-2 float-animation" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#F5B800]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <span className="text-white text-sm">{VIDEO_SECTION_TEXT.tags[2]}</span>
              </div>
            </div>

            <div className="absolute bottom-1/4 right-1/3 glass-card px-4 py-2 float-animation" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-white text-sm">{VIDEO_SECTION_TEXT.tags[3]}</span>
              </div>
            </div>
          </div>

          {/* Video overlay */}
          <div className="relative aspect-video flex items-center justify-center">
            {/* Play button */}
            <button
              onClick={onOpenVideo}
              className="group flex items-center gap-3 px-6 py-3 bg-white rounded-full hover:bg-[#F5B800] hover:scale-105 transition-all"
            >
              <Play className="w-5 h-5 text-black fill-black" />
              <span className="text-black font-semibold">{VIDEO_SECTION_TEXT.cta}</span>
              <span className="text-gray-500 text-sm">{VIDEO_SECTION_TEXT.duration}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
