import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  fullscreen?: boolean;
}

export function LoadingIndicator({ fullscreen = false }: LoadingIndicatorProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullscreen ? 'min-h-screen w-full px-4' : 'w-full py-14'
      )}
    >
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#F5B800]/20 bg-[#F5B800]/8">
        <Spinner className="h-7 w-7 text-[#F5B800]" />
      </span>
    </div>
  );
}
