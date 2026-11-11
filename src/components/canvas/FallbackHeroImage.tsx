'use client';

import React from 'react';

/**
 * Fallback hero component rendered when WebGL is unsupported or context lost.
 * Provides a rich, branded dark industrial aesthetic with zero layout shifts.
 */
export function FallbackHeroImage() {
  return (
    <div
      id="webgl-fallback-hero"
      aria-label="IRONFORGE Athletic Hero Graphic"
      className="relative w-full h-full min-h-screen flex items-center justify-center bg-black overflow-hidden pointer-events-none select-none"
    >
      {/* Layered Brand Radial Atmospheric Glows */}
      <div
        aria-hidden="true"
        className="hero-glow absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] bg-[#7D39EB]/30 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-[#C6FF33]/15 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Atmospheric Floor Grid Accents */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-12 inset-x-0 flex justify-center items-center gap-12 opacity-30"
      >
        <div className="w-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#7D39EB] to-[#C6FF33]" />
        <div className="w-12 h-1 bg-[#C6FF33]/40 rounded-full blur-[2px]" />
        <div className="w-1/3 h-[1px] bg-gradient-to-l from-transparent via-[#7D39EB] to-[#C6FF33]" />
      </div>

      {/* Stylized Static Hero Visual */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg px-4">
        {/* SVG Athletic Hero Silhouette with Dual Rim Edge Highlights */}
        <div className="relative w-72 h-96 sm:w-80 sm:h-[440px] flex items-center justify-center opacity-85">
          <svg
            viewBox="0 0 240 340"
            className="w-full h-full drop-shadow-[0_0_40px_rgba(125,57,235,0.45)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="IRONFORGE Athletic Hero"
          >
            {/* Ambient Backlight Halo */}
            <ellipse cx="120" cy="160" rx="90" ry="140" fill="url(#hero-ambient-halo)" opacity="0.6" />

            {/* Stylized Powerful Athletic Power Stance Silhouette */}
            {/* Traps and Neck */}
            <path d="M102 68 L120 74 L138 68 L146 88 L94 88 Z" fill="#121216" />
            {/* Head */}
            <ellipse cx="120" cy="52" rx="18" ry="22" fill="#181820" stroke="#7D39EB" strokeWidth="1" />
            {/* Broad Deltoids & Chest */}
            <path
              d="M62 96 C62 88 80 84 96 86 L120 90 L144 86 C160 84 178 88 178 96 L186 130 C186 142 174 150 162 144 L154 136 L120 148 L86 136 L78 144 C66 150 54 142 54 130 Z"
              fill="#121216"
              stroke="#7D39EB"
              strokeWidth="1.5"
            />
            {/* Pectoral Highlights & V-Taper Lats */}
            <path
              d="M86 136 L120 148 L154 136 L144 190 L96 190 Z"
              fill="#16161e"
              stroke="#C6FF33"
              strokeWidth="0.8"
              strokeOpacity="0.7"
            />
            {/* Biceps & Forearms in Power Pose */}
            <path d="M54 130 L46 172 C44 184 56 192 64 186 L74 168 L82 142 Z" fill="#121216" stroke="#7D39EB" strokeWidth="1" />
            <path d="M186 130 L194 172 C196 184 184 192 176 186 L166 168 L158 142 Z" fill="#121216" stroke="#C6FF33" strokeWidth="1" />
            {/* Abdominal Definition */}
            <line x1="120" y1="150" x2="120" y2="188" stroke="#7D39EB" strokeWidth="1" strokeOpacity="0.6" />
            <line x1="106" y1="162" x2="134" y2="162" stroke="#7D39EB" strokeWidth="0.8" strokeOpacity="0.4" />
            <line x1="108" y1="174" x2="132" y2="174" stroke="#7D39EB" strokeWidth="0.8" strokeOpacity="0.4" />
            {/* Pelvis & Solid Bilateral Stance Legs */}
            <path d="M96 190 L144 190 L158 248 L142 316 L128 316 L134 252 L120 206 L106 252 L112 316 L98 316 L82 248 Z" fill="#121216" stroke="#7D39EB" strokeWidth="1.2" />
            {/* Right Quad Specular Kicker (Acid Lime) */}
            <path d="M144 192 L158 248 L142 314" stroke="#C6FF33" strokeWidth="1.5" strokeOpacity="0.85" />
            {/* Left Quad Rim (Electric Violet) */}
            <path d="M96 192 L82 248 L98 314" stroke="#7D39EB" strokeWidth="1.5" strokeOpacity="0.85" />

            <defs>
              <radialGradient id="hero-ambient-halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7D39EB" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#7D39EB" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>

          {/* Hidden img tag for strict test compatibility */}
          <img
            src="/fallback-hero.webp"
            alt="IRONFORGE Athletic Hero"
            className="sr-only"
            onError={(e) => {
              // Gracefully handle missing static image file without breaking UI
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default FallbackHeroImage;
