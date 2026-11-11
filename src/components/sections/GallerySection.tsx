'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
import { galleryItems, GalleryItem } from '@/config/gallery';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LightboxModal } from '@/components/ui/LightboxModal';

export function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Views' },
    { id: 'strength', label: 'Lifting Platforms' },
    { id: 'cardio', label: 'Cardio & Turf' },
    { id: 'recovery', label: 'Recovery Suite' },
    { id: 'community', label: 'Atmosphere' },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <section
      id="gallery"
      aria-label="Gym Compound Gallery"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 w-full z-10"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="COMPOUND VISUALS"
          badgeVariant="lime"
          title="THE IRON"
          titleHighlight="EXPERIENCE"
          description="A visual journey inside the dark industrial architecture, precision barbell stations, and contrast biohacking suites of IRONFORGE."
          align="center"
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 sm:mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33] ${
                selectedCategory === cat.id
                  ? 'bg-[#C6FF33] text-black shadow-[0_0_15px_rgba(198,255,51,0.35)]'
                  : 'bg-[#0E0E14] text-[#9E9EAF] border border-white/10 hover:text-white hover:border-[#7D39EB]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveLightboxItem(item);
                }
              }}
              aria-label={`Enlarge ${item.title}`}
              className="group relative h-80 rounded-3xl overflow-hidden bg-[#0E0E14] border border-white/10 hover:border-[#C6FF33] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33]"
            >
              <Image
                src={item.imageUrl}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Gradient Backdrop on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Expand Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200">
                <Maximize2 className="w-4 h-4 text-[#C6FF33]" />
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-0 inset-x-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C6FF33] block mb-1">
                  {item.categoryLabel}
                </span>
                <h3 className="text-lg font-bold uppercase text-white leading-tight">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={Boolean(activeLightboxItem)}
        item={activeLightboxItem}
        items={filteredItems}
        onClose={() => setActiveLightboxItem(null)}
        onNavigate={(newItem) => setActiveLightboxItem(newItem)}
      />
    </section>
  );
}
