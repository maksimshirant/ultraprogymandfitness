import type { ImgHTMLAttributes } from 'react';

type VariantExtension = 'avif' | 'webp' | 'png' | 'jpg' | 'jpeg';

type VariantRecord = Partial<Record<VariantExtension, string>>;

export interface PublicAssetImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  pictureClassName?: string;
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
    relativePath,
    search: parsedUrl.search,
  };
}

function toPublicAssetUrl(relativePath: string, search: string) {
  return `${BASE_URL}${relativePath}${search}`;
}

function getVariantSources(src: string) {
  const normalizedSrc = normalizeAssetSrc(src);

  if (!normalizedSrc) {
    return [];
  }

  const availableVariants = PUBLIC_ASSET_VARIANTS.get(normalizedSrc.assetStem);

  if (!availableVariants) {
    return [];
  }

  return [
    { extension: 'avif' as const, type: 'image/avif' },
    { extension: 'webp' as const, type: 'image/webp' },
  ].flatMap(({ extension, type }) => {
    const variantPath = availableVariants[extension];

    if (!variantPath || variantPath === normalizedSrc.relativePath) {
      return [];
    }

    return [
      {
        srcSet: toPublicAssetUrl(variantPath, normalizedSrc.search),
        type,
      },
    ];
  });
}

export default function PublicAssetImage({
  src,
  alt,
  pictureClassName,
  className,
  decoding = 'async',
  sizes,
  ...imgProps
}: PublicAssetImageProps) {
  const variantSources = getVariantSources(src);

  return (
    <picture className={pictureClassName}>
      {variantSources.map((source) => (
        <source key={source.type} srcSet={source.srcSet} type={source.type} sizes={sizes} />
      ))}
      <img {...imgProps} src={src} alt={alt} sizes={sizes} decoding={decoding} className={className} />
    </picture>
  );
}
