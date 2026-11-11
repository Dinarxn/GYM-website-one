const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 2 - Feature 09: Testimonials Boundary Cases', () => {
  test('T2-F09-01: Integrity Mode Mandatory Demo Disclaimer Banner (Boundary)', () => {
    const sectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/TestimonialsSection.tsx'),
      'utf8'
    );

    // Verify prominent fictional demo notice and per-card badges
    assert.includes(
      sectionSrc,
      'FICTIONAL DEMO MEMBER PROFILES — CREATED FOR SALES DEMONSTRATION PURPOSES'
    );
    assert.includes(sectionSrc, '<Badge variant="demo" size="sm">');
    assert.includes(sectionSrc, 'DEMO CLIENT');
  });

  test('T2-F09-02: 5-Star Visual Rating in Acid Lime (Corner)', () => {
    const sectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/TestimonialsSection.tsx'),
      'utf8'
    );

    // Verify 5-star loop and lime styling in source code
    assert.includes(sectionSrc, '[...Array(t.rating)].map');
    assert.includes(sectionSrc, 'text-[#C6FF33] fill-[#C6FF33]');
  });

  test('T2-F09-03: Card Height Equalization and Surface Layout (Boundary)', () => {
    const sectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/TestimonialsSection.tsx'),
      'utf8'
    );

    // Genuinely inspect TestimonialsSection.tsx to verify flex container classes
    assert.includes(sectionSrc, 'flex flex-col justify-between hover:border-[#7D39EB]');
    assert.includes(sectionSrc, 'bg-[#0E0E14]');
    assert.includes(sectionSrc, 'border border-white/10');
  });

  test('T2-F09-04: Quantifiable Performance Metric Callout Badges (Edge Case)', () => {
    const sectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/TestimonialsSection.tsx'),
      'utf8'
    );

    // Verify distinct athletic achievements in testimonials data
    assert.includes(sectionSrc, '+55 LBS DEADLIFT PR');
    assert.includes(sectionSrc, 'SUB-3:15 MARATHON PR');
    assert.includes(sectionSrc, '12% VO2 MAX INCREASE');
  });

  test('T2-F09-05: Author Credentials & Distinct Membership Tier Badges (Boundary)', () => {
    const sectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/TestimonialsSection.tsx'),
      'utf8'
    );

    // Verify author names and membership tier credentials
    assert.includes(sectionSrc, "author: 'David K.'");
    assert.includes(sectionSrc, "author: 'Dr. Samantha M.'");
    assert.includes(sectionSrc, "author: 'Liam T.'");
    assert.includes(sectionSrc, "membershipTier: 'Pro Athlete Member'");
    assert.includes(sectionSrc, "membershipTier: 'Elite Mastery Member'");
  });
});
