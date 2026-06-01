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
        sizes="(max-width: 639px) 128px, 192px"
        variantSuffix="thumb"
        deferUntilVisible
        pictureClassName="block h-32 w-32 overflow-hidden rounded-full border border-white/10 sm:h-36 sm:w-36"
        className="h-full w-full object-cover object-top"
        style={{ objectPosition: direction.trainerAvatarPosition ?? '50% 0%' }}
      />
    );
  }

  return (
    <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] p-4 sm:h-36 sm:w-36 sm:p-5">
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
}

export function DirectionDetails({ direction }: DirectionDetailsProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] lg:gap-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{GROUP_TRAININGS_TEXT.benefitsTitle}</p>
          <ul className="mt-4 space-y-3">
            {direction.benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 border-b border-white/8 pb-3 text-sm leading-relaxed text-gray-100 last:border-b-0 last:pb-0"
              >
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#F5B800]" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:border-l lg:border-white/10 lg:pl-8">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500">О направлении</p>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-300 sm:text-base">
            {direction.description}
          </p>
        </div>
      </div>
    </div>
  );
}
