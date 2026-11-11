import type { GroupDirection } from '@/content/groupDirections';
import PublicAssetImage from '@/components/PublicAssetImage';
import { CLUB_LOGO_SRC } from '@/features/group-trainings/model/constants';

interface TrainerAvatarProps {
  direction: GroupDirection;
}

// Uses a compact circular portrait beside the trainer name.
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
        sizes="48px"
        variantSuffix="thumb"
        deferUntilVisible
        pictureClassName="block h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/[0.04]"
        className="h-full w-full object-cover object-top"
        style={{ objectPosition: direction.trainerAvatarPosition ?? '50% 0%' }}
      />
    );
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/[0.04] p-2">
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

// Keeps the description in one reading column with distinct paragraphs and a short focus list.
export function DirectionDetails({ direction, unwrapped = false, centered = false }: DirectionDetailsProps) {
  return (
    <div className={`${unwrapped ? '' : 'py-5 sm:py-6'} ${centered ? 'text-center' : 'text-left'}`}>
      <div className="max-w-[65ch] space-y-4 text-base leading-[1.75] text-white/75">
        {direction.description.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => (
          <p key={`${direction.key}-${index}`} className={index === 0 ? 'text-white/90' : undefined}>{paragraph}</p>
        ))}
      </div>
      {direction.benefits.length > 0 ? (
        <section className="mt-7">
          <h3 className="text-base font-semibold text-white">На чём акцент</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-white/75 marker:text-white/45">
            {direction.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
