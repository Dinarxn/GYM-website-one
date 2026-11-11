'use client';

import React, { useState, useEffect } from 'react';
import { X, Clock, Flame, Users, CheckCircle2, BookOpen } from 'lucide-react';
import { programsData, ProgramItem } from '@/config/programs';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function ProgramsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProgram, setActiveModalProgram] = useState<ProgramItem | null>(null);

  useEffect(() => {
    if (!activeModalProgram) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalProgram(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModalProgram]);

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'strength', label: 'Strength' },
    { id: 'conditioning', label: 'Conditioning' },
    { id: 'personal', label: '1-on-1 Coaching' },
    { id: 'functional', label: 'Functional' },
  ];

  const filteredPrograms =
    selectedCategory === 'all'
      ? programsData
      : programsData.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="programs"
      aria-label="Training Programs"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 w-full z-10"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="ENGINEERED DISCIPLINES"
          badgeVariant="lime"
          title="PRECISION TRAINING"
          titleHighlight="SYSTEMS"
          description="Every program is built upon empirical sports science, biomechanical principles, and progressive overload periodization. Choose your discipline below."
          align="center"
        />

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 sm:mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33] ${
                selectedCategory === cat.id
                  ? 'bg-[#C6FF33] text-black shadow-[0_0_15px_rgba(198,255,51,0.35)]'
                  : 'bg-[#0E0E14] text-[#9E9EAF] border border-white/10 hover:text-white hover:border-white/25'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="group relative rounded-3xl bg-[#0E0E14] border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-[#7D39EB] transition-all duration-300 hover:shadow-[0_0_30px_rgba(125,57,235,0.2)]"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <Badge variant="violet" size="sm">
                    {program.categoryLabel}
                  </Badge>

                  {/* Intensity Meter (1 to 5) */}
                  <div
                    className="flex items-center gap-1.5"
                    title={`Intensity: ${program.intensity} / 5`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9EAF] mr-1">
                      INTENSITY
                    </span>
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < program.intensity
                            ? 'bg-[#C6FF33] shadow-[0_0_6px_#C6FF33]'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mb-2 group-hover:text-[#C6FF33] transition-colors">
                  {program.title}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#C6FF33] mb-4">
                  {program.tagline}
                </p>
                <p className="text-sm text-[#9E9EAF] leading-relaxed mb-6">
                  {program.description}
                </p>

                {/* Metrics Pill Row */}
                <div className="flex flex-wrap items-center gap-3 py-3 border-y border-white/10 mb-6 text-xs text-[#9E9EAF]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C6FF33]" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#7D39EB]" />
                    <span>{program.coachToMemberRatio}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#C6FF33]" />
                    <span>Level {program.intensity}/5 Load</span>
                  </div>
                </div>

                {/* Core Benefits */}
                <ul className="space-y-2.5 mb-8">
                  {program.keyBenefits.map((benefit, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#C6FF33] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  variant="glass"
                  size="sm"
                  icon={<BookOpen className="w-3.5 h-3.5" />}
                  iconPosition="left"
                  onClick={() => setActiveModalProgram(program)}
                  className="flex-1"
                >
                  View Syllabus
                </Button>

                <Button
                  href="#contact"
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  Enroll Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Syllabus Modal */}
      {activeModalProgram && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeModalProgram.title} Syllabus`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setActiveModalProgram(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#0E0E14] border border-[#7D39EB]/50 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveModalProgram(null)}
              aria-label="Close modal"
              className="absolute top-5 right-5 p-2 rounded-full text-[#9E9EAF] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <Badge variant="lime" size="sm" className="mb-2">
                {activeModalProgram.categoryLabel}
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
                {activeModalProgram.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#C6FF33] font-bold mt-1">
                {activeModalProgram.tagline}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9E9EAF] mb-3">
                  Curriculum Phases & Periodization
                </h4>
                <div className="space-y-4">
                  {activeModalProgram.syllabus.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-black border border-white/10"
                    >
                      <h5 className="text-sm font-bold text-white mb-1">
                        {item.phase}
                      </h5>
                      <p className="text-xs text-[#C6FF33] font-mono mb-2">
                        {item.focus}
                      </p>
                      <p className="text-xs text-[#9E9EAF] leading-relaxed">
                        {item.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9E9EAF] mb-2">
                  Key Equipment Utilized
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProgram.equipmentUsed.map((eq, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-medium"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveModalProgram(null)}
              >
                Close
              </Button>
              <Button
                href="#contact"
                variant="primary"
                size="sm"
                onClick={() => setActiveModalProgram(null)}
              >
                Inquire For This Program
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
