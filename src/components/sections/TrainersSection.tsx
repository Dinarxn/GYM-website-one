'use client';

import React from 'react';
import Image from 'next/image';
import { Award, ArrowRight, Quote } from 'lucide-react';
import { trainersData } from '@/config/trainers';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TiltCard } from '@/components/ui/TiltCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function TrainersSection() {
  return (
    <section
      id="trainers"
      aria-label="Master Coaching Staff"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 w-full z-10"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="WORLD-CLASS PEDIGREE"
          badgeVariant="lime"
          title="MASTER COACHING"
          titleHighlight="CADRE"
          description="Our coaches do not count reps from the sidelines. They hold national titles, doctoral degrees in sports medicine, and elite military conditioning credentials."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {trainersData.map((trainer) => (
            <TiltCard
              key={trainer.id}
              glowColor="lime"
              className="h-full"
            >
              <div className="flex flex-col h-full justify-between p-6 sm:p-8">
                <div>
                  {/* Photo with Overlay Badge */}
                  <div className="relative w-full h-72 rounded-2xl overflow-hidden mb-6 bg-black border border-white/10">
                    <Image
                      src={trainer.imageUrl}
                      alt={`${trainer.name} - ${trainer.role} at IRONFORGE FITNESS`}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover object-top hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E14] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="violet" size="sm">
                        {trainer.moniker}
                      </Badge>
                    </div>
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-2xl font-black uppercase text-white mb-1">
                    {trainer.name}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#C6FF33] mb-4">
                    {trainer.role}
                  </p>

                  {/* Quote */}
                  <div className="relative p-3.5 rounded-xl bg-black/60 border border-white/5 mb-4 text-xs text-[#9E9EAF] italic flex gap-2">
                    <Quote className="w-4 h-4 text-[#7D39EB] shrink-0" />
                    <span>&ldquo;{trainer.quote}&rdquo;</span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs sm:text-sm text-[#9E9EAF] leading-relaxed mb-6">
                    {trainer.bio}
                  </p>

                  {/* Certifications */}
                  <div className="mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9EAF] block mb-2">
                      Credentials & Certifications
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {trainer.certifications.map((cert, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white/5 text-white/90 border border-white/10"
                        >
                          <Award className="w-3 h-3 text-[#C6FF33]" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Stats Callout */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-black border border-white/10 mb-6 text-center">
                    <div>
                      <div className="text-lg font-black text-white">
                        {trainer.stats.experience}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-[#9E9EAF]">
                        Experience
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-black text-[#C6FF33]">
                        {trainer.stats.specialtyMetric}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-[#9E9EAF]">
                        {trainer.stats.metricLabel}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Action */}
                <Button
                  href="#contact"
                  variant="glass"
                  size="sm"
                  fullWidth
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Book Consultation
                </Button>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
