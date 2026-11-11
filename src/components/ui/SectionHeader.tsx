import React from 'react';
import { Badge } from './Badge';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  eyebrow?: string;
  badgeVariant?: 'lime' | 'violet' | 'dark' | 'demo';
  title: string;
  titleHighlight?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  badgeVariant = 'lime',
  title,
  titleHighlight,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'max-w-3xl mb-12 md:mb-16',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <div className="mb-4">
          <Badge variant={badgeVariant}>{eyebrow}</Badge>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08]">
        {title}{' '}
        {titleHighlight && (
          <span className="text-[#C6FF33] drop-shadow-[0_0_20px_rgba(198,255,51,0.3)]">
            {titleHighlight}
          </span>
        )}
      </h2>
      {description && (
        <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-[#9E9EAF] font-normal leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
