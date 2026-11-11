const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 1 - Feature 05: About the Gym Bento Grid', () => {
  test('T1-F05-01: Bento Grid 4 Core Pillars', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/AboutSection.tsx'), 'utf8');

    assert.includes(secSrc, 'Calibrated Competition Platforms');
    assert.includes(secSrc, 'Master CSCS Coaching');
    assert.includes(secSrc, 'Contrast Therapy Suites');
    assert.includes(secSrc, 'Accountability. Discipline. Brotherhood.');
  });

  test('T1-F05-02: Asymmetrical Bento Grid Column Spanning (Desktop)', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/AboutSection.tsx'), 'utf8');

    assert.includes(secSrc, 'grid-cols-1 md:grid-cols-12');
    assert.includes(secSrc, 'md:col-span-8');
    assert.includes(secSrc, 'md:col-span-4');
  });

  test('T1-F05-03: Quantitative Metric Stat Callouts', () => {
    const heroSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/HeroOverlay.tsx'), 'utf8');
    const aboutSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/AboutSection.tsx'), 'utf8');

    // Metrics are distributed between hero specs and about bento grid:
    // 15,000 SQ FT, 24/7/365, 350 Member Cap, 1:6 Max Athlete-to-Coach Ratio
    assert.includes(heroSrc, '15,000');
    assert.includes(heroSrc, '24/7/365');
    assert.includes(aboutSrc, '1:6 Max Athlete-to-Coach Ratio');
    assert.includes(aboutSrc, '350 Member Maximum Cap');
  });

  test('T1-F05-04: Dark Industrial Surface & Border Tokens', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/AboutSection.tsx'), 'utf8');

    assert.includes(secSrc, 'bg-[#0E0E14]');
    assert.includes(secSrc, 'border-white/10');
    assert.includes(secSrc, 'hover:border-[#C6FF33]/50');
  });

  test('T1-F05-05: Mobile Responsive Single-Column Stacking', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/AboutSection.tsx'), 'utf8');

    // On mobile (<md), uses grid-cols-1
    assert.includes(secSrc, 'grid-cols-1');
    assert.includes(secSrc, 'gap-6');
  });
});
