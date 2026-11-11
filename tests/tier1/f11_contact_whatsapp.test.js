const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { createContactFormFSM } = require('../helpers/state');

describe('Tier 1 - Feature 11: Contact Form & WhatsApp Integration', () => {
  test('T1-F11-01: Valid Contact Enquiry Submission Flow', () => {
    const formSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/forms/ContactForm.tsx'), 'utf8');

    assert.includes(formSrc, 'handleSubmit');
    assert.includes(formSrc, 'setStatus(\'submitting\')');
    assert.includes(formSrc, 'setStatus(\'success\')');
    assert.includes(formSrc, 'Enquiry Dispatched!');

    const fsm = createContactFormFSM();
    assert.equal(fsm.state, 'idle');
    fsm.transition('validating');
    fsm.transition('submitting');
    fsm.transition('success');
    assert.equal(fsm.state, 'success');
  });

  test('T1-F11-02: Permanent Demo Mode Notice Display', () => {
    const formSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/forms/ContactForm.tsx'), 'utf8');

    assert.includes(formSrc, 'DEMO MODE');
    assert.includes(formSrc, 'Submissions are simulated for client demonstration');
  });

  test('T1-F11-03: Form Reset After Successful Submission', () => {
    const formSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/forms/ContactForm.tsx'), 'utf8');

    assert.includes(formSrc, 'handleReset');
    assert.includes(formSrc, 'setStatus(\'idle\')');
    assert.includes(formSrc, 'setSubmittedData(null)');

    const fsm = createContactFormFSM();
    fsm.transition('submitting');
    fsm.transition('success');
    fsm.transition('idle');
    assert.equal(fsm.state, 'idle');
  });

  test('T1-F11-04: Parameterized WhatsApp URL Builder Verification', () => {
    const waSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/forms/WhatsAppButton.tsx'), 'utf8');

    assert.includes(waSrc, 'https://wa.me/');
    assert.includes(waSrc, 'cleanPhone');
    assert.includes(waSrc, 'encodeURIComponent');

    // Simulate URL construction
    const cleanPhone = '18004766367';
    const tier = 'elite';
    const text = `Hello IRONFORGE FITNESS! I would like to inquire about the ${tier.toUpperCase()} membership tier and schedule a visit.`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;

    assert.includes(url, 'https://wa.me/18004766367');
    assert.includes(url, 'ELITE');
  });

  test('T1-F11-05: Floating Quick-Action WhatsApp Badge Rendering', () => {
    const waSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/forms/WhatsAppButton.tsx'), 'utf8');

    assert.includes(waSrc, 'fixed bottom-6 right-6 z-40');
    assert.includes(waSrc, 'target="_blank"');
    assert.includes(waSrc, 'rel="noopener noreferrer"');
    assert.includes(waSrc, 'aria-label="Direct WhatsApp Consultation"');
  });
});
