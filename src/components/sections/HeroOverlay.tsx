'use client';

import React from 'react';
import { ArrowRight, ChevronDown, ShieldCheck, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function HeroOverlay() {
  const metrics = [
    { value: '15,000', unit: 'SQ FT', label: 'Engineered Compound' },
    { value: '100%', unit: 'IPF', label: 'Calibrated Competition Iron' },
    { value: '24/7/365', unit: 'ACCESS', label: 'Biometric Encrypted Entry' },
    { value: '1:6', unit: 'RATIO', label: 'Max Athlete-Coach Cap' },
  ];

  return (
    <section
      id="hero"
      aria-label="Welcome to IRONFORGE FITNESS"
      className="relative min-h-[100dvh] w-full flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 z-10 pointer-events-auto overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-[#7D39EB]/15 rounded-full blur-[120px] -z-10"
      />

      {/* Top Eyebrow & Hero Copy */}
      <div className="max-w-4xl mx-auto text-center mt-6 sm:mt-12">
        <div className="inline-flex items-center gap-2 mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <Badge variant="lime" size="md">
            <Flame className="w-3.5 h-3.5 fill-[#C6FF33]" />
            INTERNATIONAL STANDARD GYM
          </Badge>
          <Badge variant="violet" size="md" className="hidden sm:inline-flex">
            <ShieldCheck className="w-3.5 h-3.5" />
            CALIBRATED IRON PLATFORMS
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.95] drop-shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          FORGE YOUR <br className="hidden sm:inline" />
          <span className="text-[#C6FF33] drop-shadow-[0_0_35px_rgba(198,255,51,0.4)]">
            ULTIMATE
          </span>{' '}
          PHYSIQUE
        </h1>

        <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-[#9E9EAF] max-w-2xl mx-auto font-normal leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700">
          An elite strength and conditioning sanctuary engineered for those who refuse compromise. Calibrated competition barbells, biomechanical coaching, and sub-zero contrast recovery.
        </p>

        {/* CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <Button
            href="#contact"
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Claim Free Trial
          </Button>

          <Button
            href="#programs"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            Explore Programs
          </Button>
        </div>
      </div>

      {/* Bottom Gym Metrics Bar */}
      <div className="max-w-5xl mx-auto w-full mt-12 sm:mt-16 pt-8 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {metrics.map((m, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  {m.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#C6FF33] font-mono">
                  {m.unit}
                </span>
              </div>
              <span className="text-xs uppercase tracking-wider text-[#9E9EAF] mt-1 font-semibold">
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Scroll Prompt */}
        <div className="mt-8 flex justify-center">
          <a
            href="#programs"
            aria-label="Scroll to Programs section"
            className="inline-flex flex-col items-center gap-1 text-[#9E9EAF] hover:text-[#C6FF33] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33] rounded-full p-2"
          >
            <span className="text-[10px] font-bold tracking-widest uppercase">
              SCROLL TO EXPLORE
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
