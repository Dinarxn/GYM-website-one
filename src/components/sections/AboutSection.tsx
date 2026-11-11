'use client';

import React from 'react';
import Image from 'next/image';
import { Dumbbell, Award, Activity, Users, Shield, Zap } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';

export function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About IRONFORGE FITNESS"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 w-full z-10"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="SANCTUARY OF IRON"
          badgeVariant="violet"
          title="ENGINEERED WITHOUT"
          titleHighlight="COMPROMISE"
          description="IRONFORGE was founded on a simple truth: real physical transformation demands uncompromising equipment, certified coaching, and recovery protocols built for high-performance longevity."
          align="center"
        />

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Calibrated Competition Iron (Span 8 cols) */}
          <div className="md:col-span-8 rounded-3xl bg-[#0E0E14] border border-white/10 p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between group hover:border-[#C6FF33]/50 transition-all duration-300">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-black border border-[#C6FF33]/40 flex items-center justify-center text-[#C6FF33]">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <Badge variant="lime" size="sm">
                  100% CALIBRATED
                </Badge>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mb-3">
                Calibrated Competition Platforms
              </h3>
              <p className="text-sm sm:text-base text-[#9E9EAF] max-w-xl leading-relaxed mb-6">
                Equipped with IPF-certified Eleiko competition barbells, calibrated steel discs within ±10g precision, custom monolifts, and 12 dedicated Olympic lifting stations with inset hardwood platforms. Zero wait times. Zero compromised knurling.
              </p>
            </div>

            {/* Inset Visual */}
            <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-white/10 mt-4">
              <Image
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop"
                alt="Olympic lifting platforms at IRONFORGE FITNESS"
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#C6FF33] font-bold">
                  IPF Certified · Eleiko Standard
                </span>
                <span className="text-xs text-white/80 font-mono">
                  12 Dedicated Stations
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Certified Performance Coaching (Span 4 cols) */}
          <div className="md:col-span-4 rounded-3xl bg-[#0E0E14] border border-white/10 p-6 sm:p-8 flex flex-col justify-between group hover:border-[#7D39EB] transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-black border border-[#7D39EB]/40 flex items-center justify-center text-[#7D39EB] mb-6">
                <Award className="w-6 h-6" />
              </div>
              <Badge variant="violet" size="sm" className="mb-3">
                MASTERY
              </Badge>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white mb-3">
                Master CSCS Coaching
              </h3>
              <p className="text-xs sm:text-sm text-[#9E9EAF] leading-relaxed mb-6">
                Our staff coaches hold Certified Strength and Conditioning Specialist (CSCS) credentials and national competitive backgrounds. Every repetition is audited for biomechanical safety and kinetic efficiency.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Shield className="w-4 h-4 text-[#C6FF33]" />
                <span>1:6 Max Athlete-to-Coach Ratio</span>
              </div>
            </div>
          </div>

          {/* Card 3: 24/7 Biohacking & Contrast Recovery (Span 4 cols) */}
          <div className="md:col-span-4 rounded-3xl bg-[#0E0E14] border border-white/10 p-6 sm:p-8 flex flex-col justify-between group hover:border-[#7D39EB] transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-black border border-[#7D39EB]/40 flex items-center justify-center text-[#7D39EB] mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <Badge variant="violet" size="sm" className="mb-3">
                BIOHACKING
              </Badge>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white mb-3">
                Contrast Therapy Suites
              </h3>
              <p className="text-xs sm:text-sm text-[#9E9EAF] leading-relaxed mb-6">
                Sub-zero 38°F cold plunge immersion tubs, Finnish dry cedar saunas at 195°F, and Normatec 3 dynamic compression systems to accelerate lymphatic drainage and eliminate systemic inflammation.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Zap className="w-4 h-4 text-[#C6FF33]" />
                <span>Zero Systemic Inflammation Protocol</span>
              </div>
            </div>
          </div>

          {/* Card 4: Iron Community & Uncompromising Culture (Span 8 cols) */}
          <div className="md:col-span-8 rounded-3xl bg-[#0E0E14] border border-white/10 p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between group hover:border-[#C6FF33]/50 transition-all duration-300">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-black border border-[#C6FF33]/40 flex items-center justify-center text-[#C6FF33]">
                  <Users className="w-6 h-6" />
                </div>
                <Badge variant="lime" size="sm">
                  CULTURE OF EXCELLENCE
                </Badge>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mb-3">
                Accountability. Discipline. Brotherhood.
              </h3>
              <p className="text-sm sm:text-base text-[#9E9EAF] max-w-xl leading-relaxed mb-6">
                No tripods. No social media vanity. No crowded waiting lines. IRONFORGE is limited to 350 committed athletes who train with relentless focus. Every PR is celebrated; every standard is upheld.
              </p>
            </div>

            {/* Inset Community Image */}
            <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-white/10 mt-4">
              <Image
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop"
                alt="Athletes training at IRONFORGE FITNESS"
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#C6FF33] font-bold">
                  350 Member Maximum Cap
                </span>
                <span className="text-xs text-white/80 font-mono">
                  Zero Waiting Times
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
