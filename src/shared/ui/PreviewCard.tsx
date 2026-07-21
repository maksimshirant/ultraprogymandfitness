import { Link } from 'react-router-dom';
import PublicAssetImage from '@/components/PublicAssetImage';
import { BalancedHeading } from '@/components/typography/BalancedHeading';

interface PreviewCardProps {
  imageSrc: string;
  title: string;
  description?: string;
  buttonLabel: string;
  route: string;
}

export default function PreviewCard({
  imageSrc,
  title,
  description,
  buttonLabel,
  route,
}: PreviewCardProps) {
  return (
    <article className="glass-card relative isolate h-full overflow-hidden rounded-[1.75rem] border border-white/10 p-0">
      <div className="absolute inset-0">
        <PublicAssetImage
          src={imageSrc}
          alt={title}
          loading="lazy"
          fetchPriority="low"
          decoding="async"
          sizes="(max-width: 1023px) 100vw, 33vw"
          variantSuffix="preview"
          deferUntilVisible
          pictureClassName="absolute inset-0 block h-full w-full"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,12,0.24)_0%,rgba(5,7,12,0.42)_36%,rgba(5,7,12,0.76)_70%,rgba(5,7,12,0.94)_100%)] lg:bg-[linear-gradient(180deg,rgba(5,7,12,0.06)_0%,rgba(5,7,12,0.12)_42%,rgba(5,7,12,0.44)_72%,rgba(5,7,12,0.86)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,184,0,0.2),transparent_42%)] lg:bg-[radial-gradient(circle_at_top_right,rgba(245,184,0,0.12),transparent_40%)]" />
      </div>

      <div className="relative z-10 flex min-h-[320px] flex-col justify-end p-7 sm:min-h-[360px] sm:p-10 lg:min-h-[500px] lg:p-6 xl:min-h-[520px] xl:p-7">
        <div className="max-w-xl lg:max-w-none">
          <BalancedHeading as="h3" className="text-3xl font-extrabold leading-[1.05] text-white md:text-4xl lg:text-[1.85rem] xl:text-[2.1rem]">
            {title}
          </BalancedHeading>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-gray-300 md:text-lg lg:mt-3 lg:text-[0.92rem] lg:font-medium lg:leading-[1.55] lg:text-white/72 xl:text-[0.97rem]">
              {description}
            </p>
          ) : null}

          <div className="mt-7 lg:mt-5">
            <Link
              to={route}
              className="btn-primary inline-flex max-w-full items-center justify-center px-7 py-4 text-center text-base text-white sm:px-8 sm:py-4 sm:text-lg lg:px-5 lg:py-2.5 lg:text-sm xl:px-6"
            >
              {buttonLabel}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
