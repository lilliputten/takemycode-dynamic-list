import { LoaderCircle } from 'lucide-react';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';

interface TProps {
  isPending: boolean;
}

export function LoadingSplash(props: TProps) {
  const { isPending } = props;
  return (
    <div
      className={cn(
        isDev && '__LoadingSplash', // DEBUG
        'absolute inset-0 overflow-hidden',
        'bg-(--backgroundColor)',
        'transition-all duration-500',
        'flex flex-col items-center justify-center',
        !isPending && 'pointer-events-none opacity-0',
      )}
    >
      <LoaderCircle className="animate-spin opacity-10" size={64} />
    </div>
  );
}
