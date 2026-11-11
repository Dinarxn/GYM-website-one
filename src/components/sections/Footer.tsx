import React from 'react';
import Link from 'next/link';
import { Zap, MapPin, Phone, Mail, Clock, ShieldAlert } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="relative z-10 w-full bg-[#070709] border-t border-white/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-xs sm:text-sm text-[#9E9EAF]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand Info (Span 2 cols) */}
          <div className="lg:col-span-2">
            <Link
              href="#hero"
              className="inline-flex items-center gap-2.5 mb-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33] rounded-lg"
            >
              <div className="w-8 h-8 rounded-lg bg-black border border-[#C6FF33]/60 flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#C6FF33] fill-[#C6FF33]" />
              </div>
              <span className="font-black text-xl tracking-wider text-white uppercase">
                IRONFORGE FITNESS
              </span>
            </Link>

            <p className="text-xs text-[#9E9EAF] leading-relaxed max-w-sm mb-6">
              {siteConfig.shortDescription}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-3.5 h-3.5 text-[#C6FF33] shrink-0" />
                <span>{siteConfig.address}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Phone className="w-3.5 h-3.5 text-[#7D39EB] shrink-0" />
                <span>{siteConfig.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Mail className="w-3.5 h-3.5 text-[#C6FF33] shrink-0" />
                <span>{siteConfig.email}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Compound Navigation
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="#programs" className="hover:text-[#C6FF33] transition-colors">
                  Training Programs
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-[#C6FF33] transition-colors">
                  About the Compound
                </Link>
              </li>
              <li>
                <Link href="#trainers" className="hover:text-[#C6FF33] transition-colors">
                  Master Coaches
                </Link>
              </li>
              <li>
                <Link href="#equipment" className="hover:text-[#C6FF33] transition-colors">
                  Calibrated Hardware
                </Link>
              </li>
              <li>
                <Link href="#membership" className="hover:text-[#C6FF33] transition-colors">
                  Membership Tiers
                </Link>
              </li>
              <li>
                <Link href="#gallery" className="hover:text-[#C6FF33] transition-colors">
                  Visual Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Operating Hours */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C6FF33]" />
              Compound Hours
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <strong className="text-white block font-semibold">Biometric Entry:</strong>
                <span>{siteConfig.hours.access}</span>
              </div>
              <div>
                <strong className="text-white block font-semibold">Staffed Coaching:</strong>
                <span>{siteConfig.hours.coaching}</span>
              </div>
              <div>
                <strong className="text-white block font-semibold">Contrast Recovery:</strong>
                <span>{siteConfig.hours.recovery}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Digital Showcase Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Digital Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C6FF33] transition-colors"
                >
                  Instagram Showcase
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C6FF33] transition-colors"
                >
                  YouTube Platform
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C6FF33] transition-colors"
                >
                  Twitter / X Channel
                </a>
              </li>
              <li>
                <Link href="#contact" className="hover:text-[#C6FF33] transition-colors text-[#C6FF33] font-bold">
                  Schedule Private Tour →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Demo Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-black border border-[#7D39EB]/30 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-[#C6FF33] shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-[11px] leading-relaxed text-[#9E9EAF]">
            <strong className="text-white">DEMONSTRATION NOTICE:</strong> IRONFORGE FITNESS is a fictional international fitness demonstration brand engineered to showcase high-performance 3D commercial web systems for gym and fitness enterprise owners. All athlete profiles, trainer testimonials, and booking flows operate in showcase simulation mode.
          </p>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9E9EAF]">
          <div>
            &copy; {currentYear} IRONFORGE FITNESS. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Next.js 15 · React 19 · Three.js 3D</span>
            <span className="text-[#C6FF33] font-mono font-bold">100% Calibrated</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
