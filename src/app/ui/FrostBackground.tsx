import type { RefObject } from 'react';
import { zeroRightClassName } from 'react-remove-scroll-bar';

const FROST_BACKGROUND = {
  avif: `${import.meta.env.BASE_URL}frost-bg.avif`,
  webp: `${import.meta.env.BASE_URL}frost-bg.webp`,
  png: `${import.meta.env.BASE_URL}frost-bg.png`,
  avifSrcSet: [
    `${import.meta.env.BASE_URL}frost-bg-w480.avif 480w`,
    `${import.meta.env.BASE_URL}frost-bg-w768.avif 768w`,
    `${import.meta.env.BASE_URL}frost-bg-w1024.avif 1024w`,
    `${import.meta.env.BASE_URL}frost-bg-w1280.avif 1280w`,
    `${import.meta.env.BASE_URL}frost-bg.avif 1881w`,
  ].join(', '),
  webpSrcSet: [
    `${import.meta.env.BASE_URL}frost-bg-w480.webp 480w`,
    `${import.meta.env.BASE_URL}frost-bg-w768.webp 768w`,
    `${import.meta.env.BASE_URL}frost-bg-w1024.webp 1024w`,
    `${import.meta.env.BASE_URL}frost-bg-w1280.webp 1280w`,
    `${import.meta.env.BASE_URL}frost-bg.webp 1881w`,
  ].join(', '),
} as const;

interface FrostBackgroundProps {
  isRendered: boolean;
  initialOpacity: number;
  initialTintOpacity: number;
  layerRef: RefObject<HTMLDivElement | null>;
  tintLayerRef: RefObject<HTMLDivElement | null>;
}

export function FrostBackground({
  isRendered,
  initialOpacity,
  initialTintOpacity,
  layerRef,
  tintLayerRef,
}: FrostBackgroundProps) {
  return (
    <div className={`pointer-events-none fixed inset-0 z-0 ${zeroRightClassName}`}>
      {isRendered ? (
        <div
          ref={layerRef}
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: initialOpacity }}
        >
          <picture className="block h-full w-full">
            <source type="image/avif" srcSet={FROST_BACKGROUND.avifSrcSet} sizes="100vw" />
            <source type="image/webp" srcSet={FROST_BACKGROUND.webpSrcSet} sizes="100vw" />
            <img
              src={FROST_BACKGROUND.png}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />
          </picture>
        </div>
      ) : null}
      <div
        ref={tintLayerRef}
        className="absolute inset-0 bg-[#05060a] transition-opacity duration-700 ease-out"
        style={{ opacity: initialTintOpacity }}
      />
    </div>
  );
}
