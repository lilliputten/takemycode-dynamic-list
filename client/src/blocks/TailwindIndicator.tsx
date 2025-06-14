import { cn } from '@/lib/utils';
import { isDev } from '@/config';

export function TailwindIndicator() {
  if (!isDev) {
    return null;
  }

  return (
    <div
      role="status"
      className={cn(
        isDev && '__TailwindIndicator', // DEBUG
        'fixed',
        'bottom-[3px]',
        'left-[3px]',
        'opacity-75',
        'pointer-events-none',
        'z-50 size-6 p-3.5',
        'flex items-center justify-center',
        'rounded-full',
        'bg-[rgb(28,28,30)]/75',
        // 'border border-white/15',
        'font-mono text-xs text-white',
      )}
    >
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:max-md:block">sm</div>
      <div className="hidden md:max-lg:block">md</div>
      <div className="hidden lg:max-xl:block">lg</div>
      <div className="hidden xl:max-2xl:block">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
}
