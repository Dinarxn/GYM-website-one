'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, MessageSquare, ArrowRight } from 'lucide-react';
import { NAV_LINKS } from './NavLinks';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/Button';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection?: string;
  onNavigate?: (id: string) => void;
}

export function MobileDrawer({
  isOpen,
  onClose,
  activeSection,
  onNavigate,
}: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open
    closeButtonRef.current?.focus();

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 flex justify-end md:hidden animate-in fade-in duration-300"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative z-10 w-4/5 max-w-sm h-full bg-[#070709] border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C6FF33] shadow-[0_0_8px_#C6FF33]" />
              <span className="font-black tracking-widest text-white text-base">
                IRONFORGE
              </span>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 rounded-full text-[#9E9EAF] hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8">
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      onClick={() => {
                        onNavigate?.(link.id);
                        onClose();
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold uppercase tracking-wider transition-all duration-200 ${
                        isActive
                          ? 'bg-[#7D39EB]/20 text-[#C6FF33] border border-[#7D39EB]/40'
                          : 'text-[#9E9EAF] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-4 h-4 opacity-50" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
          <Button
            href="#membership"
            variant="primary"
            size="md"
            fullWidth
            onClick={onClose}
          >
            Join Now
          </Button>

          <Button
            href={`https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              'Hello IRONFORGE FITNESS, I would like to inquire about membership and training programs.'
            )}`}
            variant="secondary"
            size="md"
            fullWidth
            icon={<MessageSquare className="w-4 h-4" />}
            iconPosition="left"
            onClick={onClose}
          >
            WhatsApp Chat
          </Button>

          <div className="text-center mt-2">
            <p className="text-xs text-[#9E9EAF]">
              {siteConfig.hours.access}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
