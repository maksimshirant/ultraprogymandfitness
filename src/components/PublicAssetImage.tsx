import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react';

type VariantExtension = 'avif' | 'webp' | 'png' | 'jpg' | 'jpeg';

type VariantRecord = Partial<Record<VariantExtension, string>>;

export interface PublicAssetImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  pictureClassName?: string;
  variantSuffix?: string;
  deferUntilVisible?: boolean;
  observerRootMargin?: string;
}

const IMAGE_EXTENSIONS = new Set<VariantExtension>(['avif', 'webp', 'png', 'jpg', 'jpeg']);
const BASE_URL = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const PUBLIC_IMAGE_FILES = Object.keys(import.meta.glob('/public/{trainers,floors}/**/*'));

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

  const assetStem = relativePath.slice(0, extensionSeparatorIndex);
  const nextVariants = variants.get(assetStem) ?? {};

  nextVariants[extension] = relativePath;
  variants.set(assetStem, nextVariants);

  return variants;
}, new Map<string, VariantRecord>());

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

function getResolvedAssetPaths(src: string, variantSuffix?: string) {
  const normalizedSrc = normalizeAssetSrc(src);

  if (!normalizedSrc) {
    return null;
  }

  const preferredAssetStem = variantSuffix ? `${normalizedSrc.assetStem}-${variantSuffix}` : normalizedSrc.assetStem;
  const preferredVariants = PUBLIC_ASSET_VARIANTS.get(preferredAssetStem);
  const baseVariants = PUBLIC_ASSET_VARIANTS.get(normalizedSrc.assetStem);
  const activeAssetStem = preferredVariants ? preferredAssetStem : normalizedSrc.assetStem;
  const activeVariants = preferredVariants ?? baseVariants;

  if (!activeVariants) {
    return {
      fallbackSrc: src,
      sources: [],
    };
  }

  const fallbackRelativePath =
    activeVariants[normalizedSrc.extension] ?? activeVariants.webp ?? activeVariants.jpg ?? activeVariants.jpeg ?? normalizedSrc.relativePath;

  const sources = [
    { extension: 'avif' as const, type: 'image/avif' },
    { extension: 'webp' as const, type: 'image/webp' },
  ].flatMap(({ extension, type }) => {
    const variantPath = activeVariants[extension];

    if (!variantPath) {
      return [];
    }

    return [
      {
        srcSet: toPublicAssetUrl(variantPath, normalizedSrc.search),
        type,
      },
    ];
  });

  return {
    fallbackSrc: toPublicAssetUrl(fallbackRelativePath, normalizedSrc.search),
    sources,
    activeAssetStem,
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
  ...imgProps
}: PublicAssetImageProps) {
  const [isVisible, setIsVisible] = useState(!deferUntilVisible);
  const placeholderRef = useRef<HTMLSpanElement | null>(null);
  const resolvedAssetPaths = getResolvedAssetPaths(src, variantSuffix);

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

  if (!isVisible) {
    return <span ref={placeholderRef} aria-hidden="true" className={pictureClassName} />;
  }

  return (
    <picture className={pictureClassName}>
      {resolvedAssetPaths?.sources.map((source) => (
        <source key={source.type} srcSet={source.srcSet} type={source.type} sizes={sizes} />
      ))}
      <img
        {...imgProps}
        src={resolvedAssetPaths?.fallbackSrc ?? src}
        alt={alt}
        sizes={sizes}
        decoding={decoding}
        className={className}
      />
    </picture>
  );
}
