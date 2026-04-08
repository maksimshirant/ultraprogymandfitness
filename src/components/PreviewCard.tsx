import { Link } from 'react-router-dom';
import PublicAssetImage from '@/components/PublicAssetImage';
import { BalancedHeading } from '@/components/typography/BalancedHeading';
import { cn } from '@/lib/utils';

interface PreviewCardProps {
  imageSrc: string;
  title: string;
  description?: string;
  buttonLabel: string;
  route: string;
  reverse?: boolean;
}

export default function PreviewCard({
  imageSrc,
  title,
  description,
  buttonLabel,
  route,
  reverse = false,
}: PreviewCardProps) {
  return (
    <article className="glass-card border border-white/10 p-0 overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div
          className={cn(
            'p-7 sm:p-10 lg:p-14 flex flex-col justify-center',
            reverse && 'md:order-2',
          )}
        >
          <BalancedHeading as="h3" className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
            {title}
          </BalancedHeading>
          {description ? (
            <p className="mt-5 text-base md:text-lg text-gray-300 leading-relaxed max-w-xl">
              {description}
            </p>
          ) : null}

          <div className="mt-8">
            <Link
              to={route}
              className="btn-primary text-white inline-flex items-center justify-center px-7 py-4 text-base sm:px-8 sm:py-4 sm:text-lg"
            >
              {buttonLabel}
            </Link>
          </div>
        </div>

        <div
          className={cn(
            'relative min-h-[280px] sm:min-h-[360px] md:min-h-[460px] lg:min-h-[520px] bg-black/40 border-t md:border-t-0 border-white/10',
            reverse ? 'md:order-1 md:border-r' : 'md:border-l',
          )}
        >
          <PublicAssetImage
            src={imageSrc}
            alt={title}
            loading="lazy"
            fetchPriority="low"
            sizes="(max-width: 767px) 100vw, 50vw"
            variantSuffix="preview"
            deferUntilVisible
            pictureClassName="absolute inset-0 block h-full w-full"
            className="h-full w-full object-cover object-center"
          />
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-transparent md:via-transparent',
              reverse
                ? 'md:bg-gradient-to-l md:from-black/55 md:to-transparent'
                : 'md:bg-gradient-to-r md:from-black/55 md:to-transparent',
            )}
          />
        </div>
      </div>
    </article>
  );
}
