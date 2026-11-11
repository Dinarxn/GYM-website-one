import React from 'react';
import { HeroOverlay } from '@/components/sections/HeroOverlay';
import { ProgramsSection } from '@/components/sections/ProgramsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TrainersSection } from '@/components/sections/TrainersSection';
import { EquipmentSectionOverlay } from '@/components/sections/EquipmentSectionOverlay';
import { MembershipSection } from '@/components/sections/MembershipSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FinalCtaSection } from '@/components/sections/FinalCtaSection';

export default function HomePage() {
  return (
    <div className="relative w-full overflow-x-clip">
      {/* 1. Hero Section Layer */}
      <HeroOverlay />

      {/* 2. Training Programs Section */}
      <ProgramsSection />

      {/* 3. About the Gym Bento Grid */}
      <AboutSection />

      {/* 4. Trainers Section with 3D Tilt Cards */}
      <TrainersSection />

      {/* 5. Calibrated Equipment Showcase Overlay */}
      <EquipmentSectionOverlay />

      {/* 6. Membership Tiers & Amenities Matrix */}
      <MembershipSection />

      {/* 7. Gallery Experience & Lightbox */}
      <GallerySection />

      {/* 8. Testimonials Section */}
      <TestimonialsSection />

      {/* 9. Final Conversion CTA & Contact Form */}
      <FinalCtaSection />
    </div>
  );
}
