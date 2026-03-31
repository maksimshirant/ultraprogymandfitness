import { Link } from 'react-router-dom';
import { Seo } from '@/seo/Seo';
import { pageSeo } from '@/seo/pageSeo';

export default function NotFoundPage() {
  return (
    <>
      <Seo {...pageSeo.notFound} />
      <section className="py-20 relative">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="section-title text-white">404</h1>
          <p className="section-subtitle mx-auto">Страница не найдена.</p>
          <div className="mt-10">
            <Link to="/" className="btn-primary text-white">
              На главную
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
