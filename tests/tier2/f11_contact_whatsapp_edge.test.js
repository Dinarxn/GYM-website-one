const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 2 - Feature 11: Contact Form & WhatsApp Boundary Cases', () => {
  test('T2-11-01: Empty Form Required Field Validation Rules in Source (Boundary)', () => {
    const formSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/forms/ContactForm.tsx'),
      'utf8'
    );

    // Genuinely inspect ContactForm.tsx validation logic for required field messages
    assert.includes(formSrc, "newErrors.fullName = 'Full name is required.'");
    assert.includes(formSrc, "newErrors.email = 'Email address is required.'");
    assert.includes(formSrc, "newErrors.phone = 'Phone number is required.'");
  });

  test('T2-11-02: Email Regex Pattern Validation Boundary in Source (Corner)', () => {
    const formSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/forms/ContactForm.tsx'),
      'utf8'
    );

    // Verify exact email validation regex from ContactForm component
    assert.includes(formSrc, 'const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;');
    assert.includes(formSrc, "newErrors.email = 'Please enter a valid email address.'");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    assert.equal(emailRegex.test('athlete@ironforgefitness.com'), true);
    assert.equal(emailRegex.test('invalid-email'), false);
    assert.equal(emailRegex.test('missing@domain'), false);
    assert.equal(emailRegex.test('@nodomain.com'), false);
  });

  test('T2-11-03: International Phone Regex Pattern Validation Boundary (Boundary)', () => {
    const formSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/forms/ContactForm.tsx'),
      'utf8'
    );

    // Verify phone validation regex and minimum length check
    assert.includes(formSrc, 'const phoneRegex = /^[+]?[0-9\\s().-]{7,50}$/;');
    assert.includes(formSrc, "newErrors.phone = 'Please provide a valid phone number (min 7 digits).'");

    const phoneRegex = /^[+]?[0-9\s().-]{7,50}$/;
    assert.equal(phoneRegex.test('+1 (800) 476-6367'), true);
    assert.equal(phoneRegex.test('+44 20 7946 0991'), true);
    assert.equal(phoneRegex.test('123'), false); // Too short
    assert.equal(phoneRegex.test('not-a-number'), false);
  });

  test('T2-11-04: Full Name Minimum Length Boundary Check (Corner)', () => {
    const formSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/forms/ContactForm.tsx'),
      'utf8'
    );

    // Verify 2-character minimum name constraint in ContactForm
    assert.includes(formSrc, 'values.fullName.trim().length < 2');
    assert.includes(formSrc, "newErrors.fullName = 'Name must be at least 2 characters.'");
  });

  test('T2-11-05: WhatsApp URL Builder and Parameter Sanitization in Source (Edge Case)', () => {
    const waSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/forms/WhatsAppButton.tsx'),
      'utf8'
    );

    // Verify phone sanitization and query parameter URI encoding
    assert.includes(waSrc, "siteConfig.whatsappNumber.replace(/[^0-9]/g, '')");
    assert.includes(waSrc, 'https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}');
    assert.includes(waSrc, 'fixed bottom-6 right-6 z-40');
  });
});
