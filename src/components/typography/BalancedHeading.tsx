import type { ReactNode } from 'react';
import Balancer from 'react-wrap-balancer';
import { cn } from '@/lib/utils';

type HeadingTag = 'h1' | 'h2' | 'h3';

interface BalancedHeadingProps {
  as: HeadingTag;
  className?: string;
  children: ReactNode;
}

interface HeadingAccentProps {
  className?: string;
  children: ReactNode;
}

export function BalancedHeading({ as: Tag, className, children }: BalancedHeadingProps) {
  return (
    <Tag className={cn('heading-balanced', className)}>
      <Balancer>{children}</Balancer>
    </Tag>
  );
}

export function HeadingAccent({ className, children }: HeadingAccentProps) {
  return <span className={cn('heading-accent', className)}>{children}</span>;
}
