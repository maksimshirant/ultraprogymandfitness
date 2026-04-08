import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ImgHTMLAttributes,
  type SyntheticEvent,
} from 'react';
import { cn } from '@/lib/utils';

type VariantExtension = 'avif' | 'webp' | 'png' | 'jpg' | 'jpeg';
type AssetVariantKey = 'default' | 'preview' | 'thumb' | 'placeholder';

type ImageCandidate = {
  path: string;
  width: number | null;
};

type VariantGroup = {
  fallbackByExtension: Partial<Record<VariantExtension, string>>;
  sources: Partial<Record<'avif' | 'webp', ImageCandidate[]>>;
};

export interface PublicAssetImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  pictureClassName?: string;
  variantSuffix?: Exclude<AssetVariantKey, 'default' | 'placeholder'>;
  deferUntilVisible?: boolean;
  observerRootMargin?: string;
  showPlaceholder?: boolean;
}

const IMAGE_EXTENSIONS = new Set<VariantExtension>(['avif', 'webp', 'png', 'jpg', 'jpeg']);
const BASE_URL = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const PUBLIC_IMAGE_FILES = Object.keys(import.meta.glob('/public/**/*'));
const MASTER_WIDTH_BY_VARIANT: Partial<Record<Exclude<AssetVariantKey, 'default'>, number>> = {
  preview: 1200,
  thumb: 640,
  placeholder: 48,
};
const VARIANT_SUFFIX_PATTERN = /^(.*?)(?:-(preview|thumb|placeholder))?(?:-w(\d+))?$/;

function normalizeAssetSrc(src: string) {
  const parsedUrl = new URL(src, 'https://ultraprofitness.local');
  const relativePath = parsedUrl.pathname.startsWith(BASE_URL)
    ? parsedUrl.pathname.slice(BASE_URL.length)
    : parsedUrl.pathname.replace(/^\/+/, '');
  const extensionSeparatorIndex = relativePath.lastIndexOf('.');

  if (extensionSeparatorIndex < 0) {
    return null;
  }

  return {
    assetStem: relativePath.slice(0, extensionSeparatorIndex),
    extension: relativePath.slice(extensionSeparatorIndex + 1).toLowerCase() as VariantExtension,
    relativePath,
    search: parsedUrl.search,
  };
}

function toPublicAssetUrl(relativePath: string, search: string) {
  return `${BASE_URL}${relativePath}${search}`;
}

function createEmptyVariantGroup(): VariantGroup {
  return {
    fallbackByExtension: {},
    sources: {},
  };
}

const PUBLIC_ASSET_VARIANTS = PUBLIC_IMAGE_FILES.reduce((variants, filePath) => {
  const relativePath = filePath.replace(/^\/public\//, '');
  const extensionSeparatorIndex = relativePath.lastIndexOf('.');

  if (extensionSeparatorIndex < 0) {
    return variants;
  }

  const extension = relativePath.slice(extensionSeparatorIndex + 1).toLowerCase() as VariantExtension;

  if (!IMAGE_EXTENSIONS.has(extension)) {
    return variants;
  }

  const stemWithoutExtension = relativePath.slice(0, extensionSeparatorIndex);
  const match = stemWithoutExtension.match(VARIANT_SUFFIX_PATTERN);

  if (!match) {
    return variants;
  }

  const [, assetStem, variantSuffix, widthToken] = match;
  const variantKey = (variantSuffix ?? 'default') as AssetVariantKey;
  const variantRecord = variants.get(assetStem) ?? {
    default: createEmptyVariantGroup(),
    preview: createEmptyVariantGroup(),
    thumb: createEmptyVariantGroup(),
    placeholder: createEmptyVariantGroup(),
  };
  const variantGroup = variantRecord[variantKey];
  const parsedWidth =
    typeof widthToken === 'string' && widthToken.length > 0
      ? Number.parseInt(widthToken, 10)
      : variantKey === 'default'
        ? null
        : (MASTER_WIDTH_BY_VARIANT[variantKey] ?? null);

  if (!widthToken) {
    variantGroup.fallbackByExtension[extension] = relativePath;
  }

  if ((extension === 'avif' || extension === 'webp') && Number.isFinite(parsedWidth)) {
    const candidateList = variantGroup.sources[extension] ?? [];
    candidateList.push({
      path: relativePath,
      width: parsedWidth,
    });
    variantGroup.sources[extension] = candidateList.sort((left, right) => (left.width ?? 0) - (right.width ?? 0));
  }

  variants.set(assetStem, variantRecord);
  return variants;
}, new Map<string, Record<AssetVariantKey, VariantGroup>>());

function buildResponsiveSrcSet(candidates: ImageCandidate[] | undefined, search: string) {
  if (!candidates?.length) {
    return null;
  }

  const widthQualifiedCandidates = candidates.filter((candidate) => typeof candidate.width === 'number');

  if (!widthQualifiedCandidates.length) {
    return null;
  }

  return widthQualifiedCandidates
    .map((candidate) => `${toPublicAssetUrl(candidate.path, search)} ${candidate.width}w`)
    .join(', ');
}

function getResolvedAssetPaths(src: string, variantSuffix?: Exclude<AssetVariantKey, 'default' | 'placeholder'>) {
  const normalizedSrc = normalizeAssetSrc(src);

  if (!normalizedSrc) {
    return null;
  }

  const entry = PUBLIC_ASSET_VARIANTS.get(normalizedSrc.assetStem);

  if (!entry) {
    return {
      fallbackSrc: src,
      placeholderSrc: null,
      sources: [],
    };
  }

  const requestedVariant = variantSuffix ?? 'default';
  const activeVariant = entry[requestedVariant];
  const placeholderVariant = entry.placeholder;
  const fallbackRelativePath =
    activeVariant.fallbackByExtension[normalizedSrc.extension] ??
    activeVariant.fallbackByExtension.webp ??
    activeVariant.fallbackByExtension.jpg ??
    activeVariant.fallbackByExtension.jpeg ??
    normalizedSrc.relativePath;
  const placeholderRelativePath =
    placeholderVariant.fallbackByExtension[normalizedSrc.extension] ??
    placeholderVariant.fallbackByExtension.png ??
    placeholderVariant.fallbackByExtension.jpg ??
    placeholderVariant.fallbackByExtension.jpeg ??
    placeholderVariant.fallbackByExtension.webp ??
    null;

  const sources = [
    { extension: 'avif' as const, type: 'image/avif' },
    { extension: 'webp' as const, type: 'image/webp' },
  ].flatMap(({ extension, type }) => {
    const srcSet = buildResponsiveSrcSet(activeVariant.sources[extension], normalizedSrc.search);

    if (!srcSet) {
      return [];
    }

    return [{ srcSet, type }];
  });

  return {
    fallbackSrc: toPublicAssetUrl(fallbackRelativePath, normalizedSrc.search),
    placeholderSrc: placeholderRelativePath
      ? toPublicAssetUrl(placeholderRelativePath, normalizedSrc.search)
      : null,
    sources,
  };
}

export default function PublicAssetImage({
  src,
  alt,
  pictureClassName,
  className,
  decoding = 'async',
  sizes,
  variantSuffix,
  deferUntilVisible = false,
  observerRootMargin = '180px 0px',
  showPlaceholder = true,
  onLoad,
  ...imgProps
}: PublicAssetImageProps) {
  const [isVisible, setIsVisible] = useState(!deferUntilVisible);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const placeholderRef = useRef<HTMLSpanElement | null>(null);
  const resolvedAssetPaths = useMemo(
    () => getResolvedAssetPaths(src, variantSuffix),
    [src, variantSuffix],
  );
  const activeLoadKey = resolvedAssetPaths?.fallbackSrc ?? src;
  const hasPlaceholder = showPlaceholder && Boolean(resolvedAssetPaths?.placeholderSrc);
  const isLoaded = !hasPlaceholder || loadedSrc === activeLoadKey;

  useEffect(() => {
    if (!deferUntilVisible || isVisible) {
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      const frameId = requestAnimationFrame(() => {
        setIsVisible(true);
      });

      return () => cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: observerRootMargin }
    );

    const placeholder = placeholderRef.current;

    if (placeholder) {
      observer.observe(placeholder);
    }

    return () => observer.disconnect();
  }, [deferUntilVisible, isVisible, observerRootMargin]);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    setLoadedSrc(activeLoadKey);
    onLoad?.(event);
  };

  if (!isVisible) {
    return <span ref={placeholderRef} aria-hidden="true" className={pictureClassName} />;
  }

  return (
    <picture className={cn('relative block', pictureClassName)}>
      {hasPlaceholder ? (
        <img
          src={resolvedAssetPaths?.placeholderSrc ?? undefined}
          alt=""
          aria-hidden="true"
          className={cn(
            'absolute inset-0 h-full w-full scale-105 object-cover object-center blur-2xl saturate-125 transition-opacity duration-500 ease-out',
            isLoaded ? 'opacity-0' : 'opacity-100',
          )}
        />
      ) : null}
      {resolvedAssetPaths?.sources.map((source) => (
        <source key={source.type} srcSet={source.srcSet} type={source.type} sizes={sizes} />
      ))}
      <img
        {...imgProps}
        src={resolvedAssetPaths?.fallbackSrc ?? src}
        alt={alt}
        sizes={sizes}
        decoding={decoding}
        onLoad={handleLoad}
        className={cn(
          className,
          hasPlaceholder && 'transition-opacity duration-500 ease-out',
          hasPlaceholder && (isLoaded ? 'opacity-100' : 'opacity-0'),
        )}
      />
    </picture>
  );
}
