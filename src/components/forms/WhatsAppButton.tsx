'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export interface WhatsAppButtonProps {
  floating?: boolean;
  tier?: string;
  customMessage?: string;
  className?: string;
  children?: React.ReactNode;
}

export function WhatsAppButton({
  floating = false,
  tier,
  customMessage,
  className,
  children,
}: WhatsAppButtonProps) {
  const cleanPhone = siteConfig.whatsappNumber.replace(/[^0-9]/g, '');

  let text = customMessage;
  if (!text) {
    if (tier) {
      text = `Hello IRONFORGE FITNESS! I would like to inquire about the ${tier.toUpperCase()} membership tier and schedule a visit.`;
    } else {
      text = `Hello IRONFORGE FITNESS! I am interested in training programs and membership details.`;
    }
  }

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;

  if (floating) {
    return (
      <aside aria-label="Quick WhatsApp Consultation">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Direct WhatsApp Consultation"
          className={cn(
            'fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0E0E14] border border-[#C6FF33] text-[#C6FF33] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(198,255,51,0.35)] hover:shadow-[0_0_30px_rgba(198,255,51,0.6)] hover:bg-[#C6FF33] hover:text-black transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33]',
            className
          )}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 fill-current" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C6FF33] group-hover:bg-black rounded-full animate-ping" />
          </div>
          <span className="hidden sm:inline">WhatsApp Inquiries</span>
        </a>
      </aside>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-transparent border-2 border-[#C6FF33] text-[#C6FF33] font-bold text-sm uppercase tracking-wider hover:bg-[#C6FF33] hover:text-black shadow-[0_0_15px_rgba(198,255,51,0.2)] hover:shadow-[0_0_25px_rgba(198,255,51,0.5)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33]',
        className
      )}
    >
      <MessageSquare className="w-4 h-4 fill-current shrink-0" />
      <span>{children || 'Chat on WhatsApp'}</span>
    </a>
  );
}
