import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-sm px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-aura-gold focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70',
        variant === 'default' && 'bg-aura-navy text-white hover:bg-slate-900',
        variant === 'outline' && 'border border-slate-300 bg-white text-aura-navy hover:bg-slate-50',
        variant === 'ghost' && 'bg-transparent text-aura-navy hover:bg-slate-100',
        className,
      )}
      {...props}
    />
  );
}
