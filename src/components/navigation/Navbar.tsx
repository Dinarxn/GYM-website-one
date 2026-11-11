'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Zap } from 'lucide-react';
import { NavLinks } from './NavLinks';
import { MobileDrawer } from './MobileDrawer';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // ScrollSpy section detection
      const sectionIds = [
        'hero',
        'programs',
        'about',
        'trainers',
        'equipment',
        'membership',
        'gallery',
        'testimonials',
        'contact',
      ];

      const scrollPosition = window.scrollY + 250;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        role="banner"
        className="fixed top-4 sm:top-5 inset-x-0 z-40 mx-auto w-[94%] max-w-6xl transition-all duration-300"
      >
        <div
          className={cn(
            'flex items-center justify-between px-4 sm:px-6 rounded-full border transition-all duration-300 backdrop-blur-xl',
            isScrolled
              ? 'py-2.5 sm:py-3 bg-black/90 border-[#7D39EB]/40 shadow-[0_10px_35px_rgba(0,0,0,0.9)]'
              : 'py-3.5 sm:py-4 bg-black/60 border-white/10 shadow-[0_5px_20px_rgba(0,0,0,0.5)]'
          )}
        >
          {/* Brand Logo */}
          <Link
            href="#hero"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33] rounded-lg"
          >
            <div className="w-8 h-8 rounded-lg bg-black border border-[#C6FF33]/60 flex items-center justify-center group-hover:shadow-[0_0_15px_#C6FF33] transition-shadow">
              <Zap className="w-4 h-4 text-[#C6FF33] fill-[#C6FF33]" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base sm:text-lg tracking-wider text-white uppercase leading-none">
                IRONFORGE
              </span>
              <span className="text-[9px] tracking-widest text-[#9E9EAF] font-bold uppercase leading-tight">
                FITNESS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:block" aria-label="Main Navigation">
            <NavLinks activeSection={activeSection} />
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              href="#membership"
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Join Now
            </Button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open mobile navigation"
              aria-expanded={isMobileOpen}
              className="lg:hidden p-2.5 rounded-full text-white/90 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33]"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out mobile drawer */}
      <MobileDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        activeSection={activeSection}
        onNavigate={(id) => setActiveSection(id)}
      />
    </>
  );
}
