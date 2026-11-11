'use client';

import React, { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, Sparkles, ShieldCheck } from 'lucide-react';
import { membershipPlans, amenityMatrix } from '@/config/membership';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function MembershipSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

  return (
    <section
      id="membership"
      aria-label="Membership Tiers and Pricing"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 w-full z-10"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="TIERED ACCESS"
          badgeVariant="lime"
          title="CHOOSE YOUR"
          titleHighlight="PLATFORM"
          description="Straightforward, transparent memberships. No hidden facility maintenance fees, no cancellation penalties, and no lock-in contracts."
          align="center"
        />

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12 sm:mb-16">
          <span
            className={`text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors ${
              !isAnnual ? 'text-white' : 'text-[#9E9EAF]'
            }`}
          >
            Monthly Billing
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={isAnnual}
            onClick={() => setIsAnnual(!isAnnual)}
            aria-label="Toggle annual billing discount"
            className="relative w-14 h-8 rounded-full bg-[#0E0E14] border border-white/20 p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33]"
          >
            <div
              className={`w-6 h-6 rounded-full bg-[#C6FF33] shadow-[0_0_10px_#C6FF33] transition-transform duration-200 ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors ${
                isAnnual ? 'text-white' : 'text-[#9E9EAF]'
              }`}
            >
              Annual Billing
            </span>
            <Badge variant="lime" size="sm">
              SAVE 20%
            </Badge>
          </div>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-12">
          {membershipPlans.map((plan) => {
            const currentPrice = isAnnual ? plan.priceAnnualMonthly : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? 'bg-[#0E0E14] border-2 border-[#C6FF33] shadow-[0_0_35px_rgba(198,255,51,0.25)] lg:-translate-y-2'
                    : plan.accentBorder === 'violet'
                    ? 'bg-[#0E0E14] border border-[#7D39EB] shadow-[0_0_25px_rgba(125,57,235,0.2)]'
                    : 'bg-[#0E0E14] border border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular Pill Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge variant="lime" size="md" className="shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 fill-[#C6FF33]" />
                      {plan.badgeText || 'MOST POPULAR'}
                    </Badge>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-black uppercase text-white">
                      {plan.name}
                    </h3>
                    {!plan.popular && plan.badgeText && (
                      <Badge variant="violet" size="sm">
                        {plan.badgeText}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-[#9E9EAF] mb-6">
                    {plan.tagline}
                  </p>

                  {/* Price Block */}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-black text-[#C6FF33]">$</span>
                    <span className="text-5xl font-black text-white tracking-tight">
                      {currentPrice}
                    </span>
                    <span className="text-xs uppercase text-[#9E9EAF] font-bold">
                      / month
                    </span>
                  </div>

                  <p className="text-[11px] text-[#9E9EAF] mb-6 font-mono">
                    {isAnnual ? 'Billed annually · Save $190+/yr' : 'Billed monthly · Cancel anytime'}
                  </p>

                  <p className="text-xs text-[#9E9EAF] leading-relaxed mb-6 pt-4 border-t border-white/10">
                    {plan.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9EAF] block">
                      Tier Inclusions:
                    </span>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-white/90">
                        <Check className="w-4 h-4 text-[#C6FF33] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <Button
                  href="#contact"
                  variant={plan.popular ? 'primary' : 'glass'}
                  size="md"
                  fullWidth
                >
                  {plan.ctaLabel}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Comparison Matrix Accordion Toggle */}
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            size="md"
            icon={showMatrix ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            onClick={() => setShowMatrix(!showMatrix)}
          >
            {showMatrix ? 'Hide Full Amenities Matrix' : 'Compare All 16 Amenities & Features'}
          </Button>
        </div>

        {/* Detailed Amenities Table */}
        {showMatrix && (
          <div className="mt-8 rounded-3xl bg-[#0E0E14] border border-white/10 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-6 bg-black border-b border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black uppercase text-white">
                  Comprehensive Amenities Comparison
                </h4>
                <p className="text-xs text-[#9E9EAF] mt-0.5">
                  Detailed feature breakdown across Starter, Pro, and Elite tiers
                </p>
              </div>
              <ShieldCheck className="w-6 h-6 text-[#C6FF33]" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-[#9E9EAF] uppercase tracking-wider font-bold">
                    <th className="py-4 px-6">Amenity / Privilege</th>
                    <th className="py-4 px-4 text-center">Starter Iron</th>
                    <th className="py-4 px-4 text-center text-[#C6FF33]">Pro Athlete</th>
                    <th className="py-4 px-4 text-center text-white">Elite Mastery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {amenityMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-white/90">
                        {row.feature}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {typeof row.starter === 'boolean' ? (
                          row.starter ? (
                            <Check className="w-4 h-4 text-[#C6FF33] mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-white/20 mx-auto" />
                          )
                        ) : (
                          <span className="text-[#9E9EAF] font-mono text-xs">{row.starter}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center bg-[#C6FF33]/5">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <Check className="w-4 h-4 text-[#C6FF33] mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-white/20 mx-auto" />
                          )
                        ) : (
                          <span className="text-[#C6FF33] font-mono text-xs font-bold">{row.pro}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {typeof row.elite === 'boolean' ? (
                          row.elite ? (
                            <Check className="w-4 h-4 text-[#C6FF33] mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-white/20 mx-auto" />
                          )
                        ) : (
                          <span className="text-white font-mono text-xs font-bold">{row.elite}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
