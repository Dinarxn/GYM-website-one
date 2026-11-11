'use client';

import React from 'react';
import { Star, ShieldAlert, TrendingUp } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';

export interface TestimonialItem {
  id: string;
  author: string;
  title: string;
  membershipTier: string;
  metric: string;
  quote: string;
  rating: number;
}

const testimonials: TestimonialItem[] = [
  {
    id: 'test-1',
    author: 'David K.',
    title: 'Competitive Powerlifter & Software Architect',
    membershipTier: 'Pro Athlete Member',
    metric: '+55 LBS DEADLIFT PR',
    quote:
      'IRONFORGE eliminated every excuse I ever made. The atmosphere is quiet, intense, and relentless. In 8 months under Marcus Vance’s periodization, I added 55 lbs to my deadlift while dropping 14 lbs of body fat. There is no comparable gym in the country.',
    rating: 5,
  },
  {
    id: 'test-2',
    author: 'Dr. Samantha M.',
    title: 'Orthopedic Surgeon & Endurance Athlete',
    membershipTier: 'Elite Mastery Member',
    metric: 'SUB-3:15 MARATHON PR',
    quote:
      'Between 14-hour surgery shifts and marathon training, recovery is my lifeline. The contrast therapy suite—sub-zero plunges followed by infrared heat—keeps my systemic inflammation at absolute zero. Elena’s mobility coaching kept me completely injury-free.',
    rating: 5,
  },
  {
    id: 'test-3',
    author: 'Liam T.',
    title: 'Tech Founder & Amateur Boxer',
    membershipTier: 'Pro Athlete Member',
    metric: '12% VO2 MAX INCREASE',
    quote:
      'Most commercial gyms are crowded social clubs with broken cables. IRONFORGE is an engineered temple of performance. Jaxson’s conditioning sessions pushed my anaerobic threshold further than collegiate athletics ever did.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      aria-label="Member Testimonials"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 w-full z-10"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="PROOF OF PERFORMANCE"
          badgeVariant="violet"
          title="ATHLETE"
          titleHighlight="BREAKTHROUGHS"
          description="Real transformations achieved through dedicated coaching, calibrated iron, and consistent discipline."
          align="center"
        />

        {/* Demo Disclaimer Banner */}
        <div className="max-w-3xl mx-auto mb-10 p-3.5 rounded-2xl bg-[#7D39EB]/10 border border-[#7D39EB]/40 flex items-center justify-center gap-3 text-center">
          <ShieldAlert className="w-4 h-4 text-[#C6FF33] shrink-0" />
          <span className="text-xs font-mono text-white/90 uppercase tracking-wider">
            FICTIONAL DEMO MEMBER PROFILES — CREATED FOR SALES DEMONSTRATION PURPOSES
          </span>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-3xl bg-[#0E0E14] border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-[#7D39EB] transition-all duration-300 relative group"
            >
              <div>
                {/* Header: Stars & Demo Pill */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-[#C6FF33] fill-[#C6FF33]"
                      />
                    ))}
                  </div>
                  <Badge variant="demo" size="sm">
                    DEMO CLIENT
                  </Badge>
                </div>

                {/* Metric Breakthrough Callout */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C6FF33]/10 border border-[#C6FF33]/30 text-[#C6FF33] font-mono text-xs font-bold mb-4">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{t.metric}</span>
                </div>

                {/* Quote */}
                <p className="text-sm text-[#9E9EAF] leading-relaxed italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author & Discipline */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold uppercase text-white">
                    {t.author}
                  </h4>
                  <p className="text-xs text-[#9E9EAF] mt-0.5">
                    {t.title}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[#7D39EB] font-bold uppercase">
                  {t.membershipTier}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
