export const SECTION_ROUTE_PATHS = {
  home: '/',
  flors: '/flors/',
  schedule: '/schedule/',
  trainers: '/trainers/',
  subscriptions: '/subscriptions/',
  tryfree: '/tryfree/',
  faq: '/faq/',
  contacts: '/contacts/',
} as const;

type SectionId =
  | 'flors'
  | 'schedule'
  | 'trainers'
  | 'subscriptions'
  | 'tryfree'
  | 'faq'
  | 'contacts';

const PATH_TO_SECTION: Record<string, SectionId> = {
  '/flors': 'flors',
  '/schedule': 'schedule',
  '/trainers': 'trainers',
  '/subscriptions': 'subscriptions',
  '/tryfree': 'tryfree',
  '/faq': 'faq',
  '/contacts': 'contacts',
};

const normalizePath = (pathname: string) => {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
};

export const getSectionIdFromPathname = (pathname: string): SectionId | null => {
  const normalized = normalizePath(pathname);
  return PATH_TO_SECTION[normalized] ?? null;
};
