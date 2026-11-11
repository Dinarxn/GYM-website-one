'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface NavLinkItem {
  label: string;
  href: string;
  id: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: 'Programs', href: '#programs', id: 'programs' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Trainers', href: '#trainers', id: 'trainers' },
  { label: 'Equipment', href: '#equipment', id: 'equipment' },
  { label: 'Membership', href: '#membership', id: 'membership' },
  { label: 'Gallery', href: '#gallery', id: 'gallery' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export interface NavLinksProps {
  activeSection?: string;
  onLinkClick?: (id: string) => void;
  className?: string;
  itemClassName?: string;
}

export function NavLinks({
  activeSection,
  onLinkClick,
  className,
  itemClassName,
}: NavLinksProps) {
  return (
    <ul className={cn('flex items-center gap-1 sm:gap-2', className)}>
      {NAV_LINKS.map((link) => {
        const isActive = activeSection === link.id;
        return (
          <li key={link.id}>
            <Link
              href={link.href}
              onClick={() => onLinkClick?.(link.id)}
              className={cn(
                'relative px-3 py-1.5 text-xs md:text-sm font-semibold uppercase tracking-wider transition-colors duration-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33]',
                isActive
                  ? 'text-white'
                  : 'text-[#9E9EAF] hover:text-white hover:bg-white/5',
                itemClassName
              )}
            >
              {link.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#C6FF33] rounded-full shadow-[0_0_8px_#C6FF33]"
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
