const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 2 - Feature 10: Final CTA & Footer Boundary Cases', () => {
  test('T2-F10-01: Final CTA Conversion Section & Contact Anchor Target (Boundary)', () => {
    const ctaSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/FinalCtaSection.tsx'),
      'utf8'
    );

    // Verify contact section ID, aria label, and embedded ContactForm component
    assert.includes(ctaSrc, 'id="contact"');
    assert.includes(ctaSrc, 'aria-label="Conversion and Contact Enquiry"');
    assert.includes(ctaSrc, '<ContactForm />');
    assert.includes(ctaSrc, '350 Active Member Cap Guaranteed');
  });

  test('T2-F10-02: Real WhatsApp URL Builder in FinalCtaSection (Boundary)', () => {
    const ctaSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/FinalCtaSection.tsx'),
      'utf8'
    );

    // Verify dynamic sanitized WhatsApp link construction in FinalCtaSection
    assert.includes(
      ctaSrc,
      "https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text="
    );
    assert.includes(ctaSrc, 'encodeURIComponent');
  });

  test('T2-F10-03: Footer Responsive Multi-Column Stacking in Source (Boundary)', () => {
    const footerSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/Footer.tsx'),
      'utf8'
    );

    // Genuinely inspect Footer.tsx to verify responsive 5-column grid layout
    assert.includes(footerSrc, 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12');
    assert.includes(footerSrc, 'lg:col-span-2');
  });

  test('T2-F10-04: Footer Operational Hours & Contact Information Mapping (Edge Case)', () => {
    const footerSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/Footer.tsx'),
      'utf8'
    );

    // Verify siteConfig data bindings in footer columns
    assert.includes(footerSrc, '{siteConfig.address}');
    assert.includes(footerSrc, '{siteConfig.phone}');
    assert.includes(footerSrc, '{siteConfig.email}');
    assert.includes(footerSrc, '{siteConfig.hours.access}');
  });

  test('T2-F10-05: Accessible Focus Rings & Legal Demo Notice Across Footer (Boundary)', () => {
    const footerSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/Footer.tsx'),
      'utf8'
    );

    // Genuinely inspect Footer.tsx to verify accessible focus rings and demo notice
    assert.includes(footerSrc, 'focus-visible:ring-2 focus-visible:ring-[#C6FF33]');
    assert.includes(footerSrc, '<strong className="text-white">DEMONSTRATION NOTICE:</strong>');
  });
});
