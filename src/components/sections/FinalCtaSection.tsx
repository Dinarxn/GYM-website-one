'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, MessageSquare, Zap } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { ContactForm } from '@/components/forms/ContactForm';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function FinalCtaSection() {
  const assurances = [
    'Zero Lock-In Long Term Contracts',
    'Instant Biometric Keycard Setup',
    'Complimentary Biomechanical Movement Screen',
    '350 Active Member Cap Guaranteed',
  ];

  return (
    <section
      id="contact"
      aria-label="Conversion and Contact Enquiry"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 w-full z-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Cinematic Header Block */}
        <div className="rounded-3xl bg-gradient-to-b from-[#12121A] to-[#070709] border border-[#7D39EB]/40 p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden mb-16 shadow-[0_0_50px_rgba(125,57,235,0.15)]">
          {/* Accent Glow Orbs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 bg-[#C6FF33]/15 rounded-full blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 bg-[#7D39EB]/25 rounded-full blur-3xl"
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <Badge variant="lime" size="md">
                <Zap className="w-3.5 h-3.5 fill-[#C6FF33]" />
                COMMENCE TRAINING
              </Badge>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-[1.05] mb-6">
              FORGE YOUR LEGACY.{' '}
              <span className="text-[#C6FF33] drop-shadow-[0_0_25px_rgba(198,255,51,0.4)]">
                STEP ONTO
              </span>{' '}
              THE PLATFORM.
            </h2>

            <p className="text-base sm:text-lg text-[#9E9EAF] max-w-2xl mx-auto mb-8 leading-relaxed">
              Membership is strictly capped at 350 active athletes to eliminate equipment waiting lines and maintain world-class coaching fidelity. Request your 3-day trial pass below.
            </p>

            {/* Direct WhatsApp CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button
                href={`https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  'Hello IRONFORGE FITNESS! I would like to schedule a private tour and claim my 3-day trial pass.'
                )}`}
                variant="secondary"
                size="lg"
                icon={<MessageSquare className="w-4 h-4" />}
                iconPosition="left"
              >
                Instant WhatsApp Inquiry
              </Button>
            </div>

            {/* Assurance Pills */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-6 border-t border-white/10 text-xs sm:text-sm text-white/90">
              {assurances.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C6FF33] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Validated Contact Enquiry Form */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mb-2">
              Claim Your 3-Day Complimentary Pass
            </h3>
            <p className="text-xs sm:text-sm text-[#9E9EAF]">
              Complete the registration below to schedule your orientation and access keycard.
            </p>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
