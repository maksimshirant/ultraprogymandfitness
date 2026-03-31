import fs from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve('dist');
const siteUrl = 'https://ultraprofitness.ru';
const defaultRobots = 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1';
const faqScriptPattern = /<script id="ld-json-faq"[\s\S]*?<\/script>\s*/;

const pages = [
  {
    output: 'index.html',
    title: 'Ultra Pro Gym & Fitness - фитнес клуб в Волжском',
    description:
      'Современное оборудование. Профессиональные тренеры. Сауна. Фитнес-бар. Групповые тренировки. Бесплатное пробное занятие.',
    canonical: `${siteUrl}/`,
    robots: defaultRobots,
    includeFaq: true,
  },
  {
    output: path.join('schedule', 'index.html'),
    title: 'Расписание групповых занятий | Ultra Pro Gym & Fitness',
    description:
      'Актуальное расписание групповых занятий Ultra Pro Gym & Fitness в Волжском. Выберите направление и удобное время для тренировок.',
    canonical: `${siteUrl}/schedule`,
    robots: defaultRobots,
    includeFaq: false,
  },
  {
    output: path.join('trainers', 'index.html'),
    title: 'Тренеры фитнес-клуба | Ultra Pro Gym & Fitness',
    description:
      'Тренеры Ultra Pro Gym & Fitness в Волжском. Выберите специалиста для персональных тренировок, силовой подготовки, кроссфита и единоборств.',
    canonical: `${siteUrl}/trainers`,
    robots: defaultRobots,
    includeFaq: false,
  },
  {
    output: path.join('memberships', 'index.html'),
    title: 'Абонементы в фитнес-клуб | Ultra Pro Gym & Fitness',
    description:
      'Абонементы Ultra Pro Gym & Fitness в Волжском. Сравните форматы посещения, цены и выберите подходящий вариант для тренировок.',
    canonical: `${siteUrl}/memberships`,
    robots: defaultRobots,
    includeFaq: false,
  },
  {
    output: path.join('contacts', 'index.html'),
    title: 'О нас, отзывы и контакты | Ultra Pro Gym & Fitness',
    description:
      'Отзывы гостей, контакты, график работы и способы быстро связаться с фитнес-клубом Ultra Pro Gym & Fitness в Волжском.',
    canonical: `${siteUrl}/contacts`,
    robots: defaultRobots,
    includeFaq: false,
  },
  {
    output: '404.html',
    title: 'Страница не найдена | Ultra Pro Gym & Fitness',
    description:
      'Запрашиваемая страница не найдена. Перейдите на главную страницу Ultra Pro Gym & Fitness и выберите нужный раздел.',
    canonical: `${siteUrl}/`,
    robots: 'noindex,nofollow',
    includeFaq: false,
  },
];

const replaceTitle = (html, title) => html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

const replaceMeta = (html, selector, content) => {
  const escaped = content.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return html.replace(selector, (_, prefix, suffix) => `${prefix}${escaped}${suffix}`);
};

const replaceCanonical = (html, href) =>
  html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${href}" />`);

const prepareHtml = (template, page) => {
  let html = template;

  html = replaceTitle(html, page.title);
  html = replaceMeta(html, /(<meta\s+name="description"\s+content=")[\s\S]*?("\s*\/>)/, page.description);
  html = replaceMeta(html, /(<meta\s+name="robots"\s+content=")[\s\S]*?("\s*\/>)/, page.robots);
  html = replaceCanonical(html, page.canonical);
  html = replaceMeta(html, /(<meta\s+property="og:title"\s+content=")[\s\S]*?("\s*\/>)/, page.title);
  html = replaceMeta(html, /(<meta\s+property="og:description"\s+content=")[\s\S]*?("\s*\/>)/, page.description);
  html = replaceMeta(html, /(<meta\s+property="og:url"\s+content=")[\s\S]*?("\s*\/>)/, page.canonical);
  html = replaceMeta(html, /(<meta\s+name="twitter:title"\s+content=")[\s\S]*?("\s*\/>)/, page.title);
  html = replaceMeta(html, /(<meta\s+name="twitter:description"\s+content=")[\s\S]*?("\s*\/>)/, page.description);

  if (!page.includeFaq) {
    html = html.replace(faqScriptPattern, '');
  }

  return html;
};

const main = async () => {
  const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');

  await Promise.all(
    pages.map(async (page) => {
      const html = prepareHtml(template, page);
      const outputPath = path.join(distDir, page.output);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, html, 'utf8');
    })
  );
};

main().catch((error) => {
  console.error('Prerender failed');
  console.error(error);
  process.exit(1);
});
