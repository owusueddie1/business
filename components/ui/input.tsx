import type { InputHTMLAttributes, DetailedHTMLProps } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex h-11 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-aura-navy outline-none transition placeholder:text-slate-400 focus:border-aura-gold focus:ring-2 focus:ring-aura-gold/20',
        className,
      )}
      {...props}
    />
  );
}
