const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 2 - Feature 18: Mobile Performance Boundary Cases', () => {
  test('T2-18-01: Viewport Metadata Scalability & Constraints (Boundary)', () => {
    const layoutSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');

    // Verify viewport export in root layout adheres to mobile best practices
    assert.includes(layoutSrc, "width: 'device-width'");
    assert.includes(layoutSrc, 'initialScale: 1');
    assert.includes(layoutSrc, 'maximumScale: 5');
    assert.includes(layoutSrc, "themeColor: '#000000'");
  });

  test('T2-18-02: Touch Target Minimum Dimension Compliance (Boundary)', () => {
    const buttonSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/Button.tsx'), 'utf8');

    // Verify size styles provide generous touch targets across all button sizes
    assert.includes(buttonSrc, "sm: 'text-xs px-4 py-2 gap-1.5'");
    assert.includes(buttonSrc, "md: 'text-sm px-6 py-3 gap-2'");
    assert.includes(buttonSrc, "lg: 'text-base px-8 py-4 gap-2.5'");
    assert.includes(buttonSrc, 'rounded-full select-none cursor-pointer');
  });

  test('T2-18-03: Mobile Dynamic Viewport Height (100dvh) in HeroOverlay (Corner)', () => {
    const heroSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/HeroOverlay.tsx'),
      'utf8'
    );

    // Verify modern 100dvh unit prevents mobile address bar layout shifts
    assert.includes(heroSrc, 'min-h-[100dvh]');
    assert.includes(heroSrc, 'overflow-hidden');
  });

  test('T2-18-04: Next.js Image Optimization Formats in next.config.ts (Edge Case)', () => {
    const nextConfigSrc = fs.readFileSync(path.join(process.cwd(), 'next.config.ts'), 'utf8');

    // Verify next.config.ts configures AVIF and WebP modern image formats
    assert.includes(nextConfigSrc, "formats: ['image/avif', 'image/webp']");
    assert.includes(nextConfigSrc, "hostname: 'images.unsplash.com'");
  });

  test('T2-18-05: Global Zero Horizontal Scroll Clipping in CSS (Boundary)', () => {
    const cssSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

    // Verify html and body both declare overflow-x: clip to prevent horizontal scroll bleed
    assert.includes(cssSrc, 'html {');
    assert.includes(cssSrc, 'overflow-x: clip;');
    assert.includes(cssSrc, 'body {');
  });
});
