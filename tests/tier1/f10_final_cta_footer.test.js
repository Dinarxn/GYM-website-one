const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 1 - Feature 10: Final Conversion CTA & Footer', () => {
  test('T1-F10-01: Cinematic Conversion Banner Headline & Styling', () => {
    const ctaSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/FinalCtaSection.tsx'), 'utf8');

    assert.includes(ctaSrc, 'FORGE YOUR LEGACY.');
    assert.includes(ctaSrc, 'STEP ONTO');
    assert.includes(ctaSrc, 'THE PLATFORM.');
  });

  test('T1-F10-02: Dual Action Conversion Buttons', () => {
    const ctaSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/FinalCtaSection.tsx'), 'utf8');

    assert.includes(ctaSrc, 'COMMENCE TRAINING');
    assert.includes(ctaSrc, 'ContactForm');
  });

  test('T1-F10-03: Three Trust Assurance Pills', () => {
    const ctaSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/FinalCtaSection.tsx'), 'utf8');

    assert.includes(ctaSrc, 'Zero Lock-In Long Term Contracts');
    assert.includes(ctaSrc, 'Instant Biometric Keycard Setup');
    assert.includes(ctaSrc, 'Complimentary Biomechanical Movement Screen');
    assert.includes(ctaSrc, '350 Active Member Cap Guaranteed');
  });

  test('T1-F10-04: Comprehensive Footer Operational Hours & Contacts', () => {
    const footerSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/Footer.tsx'), 'utf8');

    assert.includes(footerSrc, 'Compound Hours');
    assert.includes(footerSrc, 'Biometric Entry:');
    assert.includes(footerSrc, 'Staffed Coaching:');
    assert.includes(footerSrc, 'Contrast Recovery:');
    assert.includes(footerSrc, 'siteConfig.address');
    assert.includes(footerSrc, 'siteConfig.phone');
    assert.includes(footerSrc, 'siteConfig.email');
  });

  test('T1-F10-05: Mandatory Demo Mode Footer Disclaimer', () => {
    const footerSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/Footer.tsx'), 'utf8');

    assert.includes(footerSrc, 'DEMONSTRATION NOTICE:');
    assert.includes(footerSrc, 'IRONFORGE FITNESS is a fictional international fitness demonstration brand');
  });
});
