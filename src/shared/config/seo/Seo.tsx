import { useEffect } from 'react';
import { siteConfig } from '@/seo/siteConfig';
import type { PageSeoConfig } from '@/seo/pageSeo';

const upsertMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let meta = document.head.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }

  meta.content = content;
};

const upsertCanonical = (href: string) => {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }

  link.href = href;
};

const toAbsoluteUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${siteConfig.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

export function Seo({
  title,
  description,
  path,
  robots = 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1',
  ogType = 'website',
}: PageSeoConfig) {
  useEffect(() => {
    const canonicalUrl = toAbsoluteUrl(path);
    const imageUrl = toAbsoluteUrl(siteConfig.ogImage);

    document.title = title;

    upsertCanonical(canonicalUrl);
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', robots);
    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:site_name', siteConfig.siteName);
    upsertMeta('property', 'og:locale', siteConfig.locale);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', imageUrl);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', imageUrl);
  }, [description, ogType, path, robots, title]);

  return null;
}
