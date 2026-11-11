const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 1 - Feature 09: Testimonials Section', () => {
  test('T1-F09-01: Render 3 Fictional Demo Testimonials', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/TestimonialsSection.tsx'), 'utf8');

    assert.includes(secSrc, 'David K.');
    assert.includes(secSrc, 'Dr. Samantha M.');
    assert.includes(secSrc, 'Liam T.');
  });

  test('T1-F09-02: Mandatory Fictional Demo Disclaimer Badge', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/TestimonialsSection.tsx'), 'utf8');

    assert.includes(secSrc, 'FICTIONAL DEMO MEMBER PROFILES');
    assert.includes(secSrc, 'SALES DEMONSTRATION PURPOSES');
  });

  test('T1-F09-03: Inline Demo Profile Labels', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/TestimonialsSection.tsx'), 'utf8');

    assert.includes(secSrc, 'DEMO CLIENT');
  });

  test('T1-F09-04: 5-Star Visual Rating in Acid Lime', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/TestimonialsSection.tsx'), 'utf8');

    assert.includes(secSrc, 'text-[#C6FF33] fill-[#C6FF33]');
  });

  test('T1-F09-05: Quantifiable Performance Metric Callouts', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/TestimonialsSection.tsx'), 'utf8');

    assert.includes(secSrc, '+55 LBS DEADLIFT PR');
    assert.includes(secSrc, 'SUB-3:15 MARATHON PR');
    assert.includes(secSrc, '12% VO2 MAX INCREASE');
  });
});
