import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'lime' | 'violet' | 'dark' | 'demo';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export function Badge({
  variant = 'lime',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    lime: 'bg-[#C6FF33]/10 text-[#C6FF33] border-[#C6FF33]/30',
    violet: 'bg-[#7D39EB]/15 text-[#FFFFFF] border-[#7D39EB]/40',
    dark: 'bg-white/5 text-white/90 border-white/10',
    demo: 'bg-[#7D39EB]/20 text-[#C6FF33] border-[#7D39EB]/50 font-mono tracking-wider',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 tracking-wide',
    md: 'text-xs md:text-sm px-3.5 py-1 tracking-wider',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold uppercase rounded-full border transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
