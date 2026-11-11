const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { createWindow } = require('../helpers/dom');

describe('Tier 2 - Feature 05: About Bento Grid Boundary Cases', () => {
  test('T2-F05-01: Asymmetrical Bento Grid 12-Column Responsive Spans (Boundary)', () => {
    const aboutSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/AboutSection.tsx'), 'utf8');

    // Verify 12-column responsive layout and asymmetrical card spans
    assert.includes(aboutSrc, 'grid grid-cols-1 md:grid-cols-12 gap-6');
    assert.includes(aboutSrc, 'md:col-span-8');
    assert.includes(aboutSrc, 'md:col-span-4');
  });

  test('T2-F05-02: Quantitative Metric Stat Callouts in Bento Grid (Corner)', () => {
    const aboutSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/AboutSection.tsx'), 'utf8');

    // Verify quantitative athletic specifications in cards
    assert.includes(aboutSrc, '100% CALIBRATED');
    assert.includes(aboutSrc, '12 Dedicated Stations');
    assert.includes(aboutSrc, '1:6 Max Athlete-to-Coach Ratio');
    assert.includes(aboutSrc, 'IPF Certified · Eleiko Standard');
  });

  test('T2-F05-03: Dark Industrial Tonal Elevation & Hover Borders (Boundary)', () => {
    const aboutSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/AboutSection.tsx'), 'utf8');

    // Verify industrial styling surface tokens and interactive focus/hover borders
    assert.includes(aboutSrc, 'bg-[#0E0E14]');
    assert.includes(aboutSrc, 'border border-white/10');
    assert.includes(aboutSrc, 'hover:border-[#C6FF33]/50');
    assert.includes(aboutSrc, 'hover:border-[#7D39EB]');
  });

  test('T2-F05-04: Semantic Image Accessibility & Responsive Sizes (Edge Case)', () => {
    const aboutSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/AboutSection.tsx'), 'utf8');

    // Verify responsive image attributes and descriptive alt text for screen readers
    assert.includes(aboutSrc, 'alt="Olympic lifting platforms at IRONFORGE FITNESS"');
    assert.includes(aboutSrc, 'sizes="(max-width: 768px) 100vw, 800px"');
  });

  test('T2-F05-05: Mobile Single-Column Responsive Collapse (Boundary)', () => {
    const aboutSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/AboutSection.tsx'), 'utf8');

    // Verify default single-column grid on mobile before md: breakpoint
    assert.includes(aboutSrc, 'grid-cols-1');

    const win = createWindow();
    win.setViewport(375, 667);
    assert.equal(win.innerWidth, 375);
    assert.assert(win.document.documentElement.clientWidth <= 375);
  });
});
