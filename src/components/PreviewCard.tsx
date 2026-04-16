import { Link } from 'react-router-dom';
import PublicAssetImage from '@/components/PublicAssetImage';
import { BalancedHeading } from '@/components/typography/BalancedHeading';
import { useViewportTier } from '@/hooks/useViewportTier';
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
  const viewportTier = useViewportTier();
  const isDesktopViewport = viewportTier === 'desktop';

  return (
    <article className="glass-card relative isolate overflow-hidden border border-white/10 p-0">
      <div className="absolute inset-0 md:hidden">
        <PublicAssetImage
          src={imageSrc}
          alt={title}
          loading="lazy"
          fetchPriority="low"
          decoding="async"
          sizes="100vw"
          variantSuffix={isDesktopViewport ? undefined : 'preview'}
          deferUntilVisible
          pictureClassName="absolute inset-0 block h-full w-full"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,12,0.34)_0%,rgba(5,7,12,0.58)_30%,rgba(5,7,12,0.82)_58%,rgba(5,7,12,0.94)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,184,0,0.26),transparent_42%)]" />
      </div>

      <div className="grid md:grid-cols-2">
        <div
          className={cn(
            'relative z-10 flex min-h-[320px] flex-col justify-end p-7 sm:min-h-[360px] sm:p-10 md:min-h-0 md:justify-center lg:p-14',
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
            'relative hidden min-h-[280px] border-white/10 bg-black/40 md:block md:min-h-[460px] md:border-t-0 lg:min-h-[520px]',
            reverse ? 'md:order-1 md:border-r' : 'md:border-l',
          )}
        >
          <PublicAssetImage
            src={imageSrc}
            alt={title}
            loading="lazy"
            fetchPriority="low"
            sizes="(max-width: 767px) 100vw, 50vw"
            variantSuffix={isDesktopViewport ? undefined : 'preview'}
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
