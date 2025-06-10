import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';
import { TPropsWithClassName } from '@/types/react';

interface TProps extends TPropsWithClassName {
  count?: number;
  title?: string;
}

export function DemoList(props: TProps) {
  const { className, title, count = 10 } = props;
  const items = Array.from(Array(count)).map((_none, no) => {
    const key = String(no);
    return <li key={key}>Item {no + 1}</li>;
  });
  return (
    <div
      className={cn(
        isDev && '__DemoList', // DEBUG
        className,
        'flex flex-col',
        'layout-follow',
      )}
    >
      {!!title && <h3>{title}</h3>}
      <ul>{items}</ul>
    </div>
  );
}
