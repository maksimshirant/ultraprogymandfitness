import type { GroupDirection } from '@/content/groupDirections';
import PublicAssetImage from '@/components/PublicAssetImage';
import { Check } from 'lucide-react';
import { CLUB_LOGO_SRC, GROUP_TRAININGS_TEXT } from '@/features/group-trainings/model/constants';

interface TrainerAvatarProps {
  direction: GroupDirection;
}

export function TrainerAvatar({ direction }: TrainerAvatarProps) {
  const trainerAvatar = direction.trainerAvatar;
  const isPlaceholderAvatar = Boolean(trainerAvatar?.includes('placeholder'));

  if (trainerAvatar && !isPlaceholderAvatar) {
    return (
      <PublicAssetImage
        src={trainerAvatar}
        alt={direction.trainer}
        loading="lazy"
        fetchPriority="low"
        decoding="async"
        sizes="(max-width: 639px) 76px, (max-width: 1023px) 80px, 88px"
        variantSuffix="thumb"
        deferUntilVisible
        pictureClassName="block h-[4.75rem] w-[4.75rem] shrink-0 overflow-hidden rounded-[1.45rem] border border-white/15 bg-white/[0.06] p-0.5 shadow-[0_18px_40px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] ring-1 ring-white/[0.06] backdrop-blur-xl md:h-20 md:w-20 md:rounded-[1.55rem] lg:h-[5.5rem] lg:w-[5.5rem] lg:rounded-[1.65rem]"
        className="h-full w-full rounded-[1.2rem] object-cover object-top md:rounded-[1.3rem] lg:rounded-[1.4rem]"
        style={{ objectPosition: direction.trainerAvatarPosition ?? '50% 0%' }}
      />
    );
  }

  return (
    <div className="flex h-[4.75rem] w-[4.75rem] shrink-0 items-center justify-center overflow-hidden rounded-[1.45rem] border border-white/15 bg-white/[0.06] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] ring-1 ring-white/[0.06] backdrop-blur-xl md:h-20 md:w-20 md:rounded-[1.55rem] md:p-4 lg:h-[5.5rem] lg:w-[5.5rem] lg:rounded-[1.65rem] lg:p-5">
      <img
        src={CLUB_LOGO_SRC}
        alt="Логотип Ultra Pro Gym & Fitness"
        loading="lazy"
        decoding="async"
        className="h-full w-full object-contain brightness-0 invert opacity-85"
      />
    </div>
  );
}

interface DirectionDetailsProps {
  direction: GroupDirection;
  unwrapped?: boolean;
  centered?: boolean;
}

export function DirectionDetails({ direction, unwrapped = false, centered = false }: DirectionDetailsProps) {
  return (
    <div className={unwrapped ? '' : 'rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6'}>
      <div className="grid gap-6 lg:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] lg:gap-8">
        <div>
          <p className={centered ? 'text-center text-xs uppercase tracking-[0.18em] text-gray-500' : 'text-xs uppercase tracking-[0.18em] text-gray-500'}>{GROUP_TRAININGS_TEXT.benefitsTitle}</p>
          <ul className="mt-4 space-y-3">
            {direction.benefits.map((benefit) => (
              <li
                key={benefit}
                className={centered
                  ? 'flex items-start justify-center gap-3 border-b border-white/8 pb-3 text-center text-sm leading-relaxed text-gray-100 last:border-b-0 last:pb-0'
                  : 'flex items-start gap-3 border-b border-white/8 pb-3 text-sm leading-relaxed text-gray-100 last:border-b-0 last:pb-0'}
              >
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#F5B800]" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={centered ? 'lg:border-l lg:border-white/10 lg:pl-8' : 'lg:border-l lg:border-white/10 lg:pl-8'}>
          <p className={centered ? 'text-center text-xs uppercase tracking-[0.18em] text-gray-500' : 'text-xs uppercase tracking-[0.18em] text-gray-500'}>О направлении</p>
          <p className={centered ? 'mt-4 whitespace-pre-line text-center text-sm leading-relaxed text-gray-300 sm:text-base' : 'mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-300 sm:text-base'}>
            {direction.description}
          </p>
        </div>
      </div>
    </div>
  );
}
