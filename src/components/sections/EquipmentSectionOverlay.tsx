'use client';

import React, { useState } from 'react';
import { equipmentData, EquipmentItem } from '@/config/equipment';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { Check, Shield, Layers, Scale, Maximize2 } from 'lucide-react';

export function EquipmentSectionOverlay() {
  const [selectedItem, setSelectedItem] = useState<EquipmentItem>(equipmentData[0]);

  return (
    <section
      id="equipment"
      aria-label="Interactive Equipment Showcase"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 w-full z-10"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="MIL-SPEC HARDWARE"
          badgeVariant="violet"
          title="PRECISION"
          titleHighlight="EQUIPMENT"
          description="Every barbell, plate, and bench in our compound is calibrated to international competition standards. Explore the anatomy of our heavy iron below."
          align="center"
        />

        {/* Equipment Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {equipmentData.map((item) => {
            const isSelected = selectedItem.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33] ${
                  isSelected
                    ? 'bg-[#C6FF33] text-black shadow-[0_0_20px_rgba(198,255,51,0.4)]'
                    : 'bg-[#0E0E14] text-[#9E9EAF] border border-white/10 hover:text-white hover:border-[#7D39EB]'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Equipment Showcase Display Card */}
        <div className="rounded-3xl bg-[#0E0E14] border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          {/* Violet Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 bg-[#7D39EB]/15 rounded-full blur-3xl"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: 3D Showcase Placeholder / Interactive Graphic Container */}
            <div className="lg:col-span-5 relative w-full h-72 sm:h-96 rounded-2xl bg-black border border-white/15 flex flex-col items-center justify-center p-6 text-center overflow-hidden group">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(125,57,235,0.25)_0%,transparent_70%)]"
              />

              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#7D39EB]/20 border border-[#7D39EB] flex items-center justify-center text-[#C6FF33]">
                  <Scale className="w-8 h-8" />
                </div>
                <Badge variant="lime" size="sm" className="mb-2">
                  {selectedItem.category}
                </Badge>
                <h4 className="text-xl sm:text-2xl font-black uppercase text-white mb-2">
                  {selectedItem.name}
                </h4>
                <div className="text-lg font-mono font-bold text-[#C6FF33] mb-4">
                  {selectedItem.weight}
                </div>
                <p className="text-xs text-[#9E9EAF] max-w-xs mx-auto">
                  Interactive 3D model viewport. Drag to rotate model 360° in the live 3D showcase.
                </p>
              </div>

              {/* Hotspot indicator badge */}
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#9E9EAF] uppercase bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                3D SHOWCASE READY
              </div>
            </div>

            {/* Right: Technical Specifications & Features */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="violet" size="sm">
                  CALIBRATED SPECIFICATIONS
                </Badge>
                <span className="text-xs font-mono text-[#9E9EAF]">
                  IPF ±10g TOLERANCE
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white mb-3">
                {selectedItem.name}
              </h3>

              <p className="text-sm sm:text-base text-[#9E9EAF] leading-relaxed mb-6">
                {selectedItem.interactiveDescription}
              </p>

              {/* Specs Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-black border border-white/10 text-xs">
                <div className="flex items-start gap-2.5">
                  <Layers className="w-4 h-4 text-[#7D39EB] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#9E9EAF] block">Material Composition</span>
                    <strong className="text-white font-semibold">{selectedItem.material}</strong>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Maximize2 className="w-4 h-4 text-[#C6FF33] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#9E9EAF] block">Dimensions & Shaft</span>
                    <strong className="text-white font-semibold">{selectedItem.dimensions}</strong>
                  </div>
                </div>
              </div>

              {/* Bulleted Specifications */}
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#C6FF33]" />
                Engineering Specifications
              </h4>
              <ul className="space-y-2 mb-6">
                {selectedItem.specs.map((spec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#9E9EAF]">
                    <Check className="w-4 h-4 text-[#C6FF33] shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
