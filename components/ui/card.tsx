import type { HTMLAttributes, DetailedHTMLProps } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return <div className={cn('rounded-sm border border-slate-200 bg-white p-6 shadow-soft', className)} {...props} />;
}
