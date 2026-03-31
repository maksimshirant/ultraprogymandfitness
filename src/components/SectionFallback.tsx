import { LoadingIndicator } from '@/components/LoadingIndicator';

export function SectionFallback() {
  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          <LoadingIndicator />
        </div>
      </div>
    </section>
  );
}
