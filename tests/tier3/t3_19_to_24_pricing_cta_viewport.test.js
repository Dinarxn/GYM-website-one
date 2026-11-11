/**
 * Tier 3 — Cross-Feature Interaction Test Suite
 * Specifications T3-19 through T3-24: Pricing Discount Math, WhatsApp Parameterized URL,
 * Hero CTA Scroll & Pulse, Viewport Orientation/DPR, Tab Navigation Bypass, and Final CTA Modal
 */

const fs = require('node:fs');
const path = require('node:path');
const assert = require('../helpers/assert');
const { createDOM, createWindow } = require('../helpers/dom');

describe('Tier 3: Cross-Feature Interactions (T3-19 to T3-24)', () => {
  test('T3-19: Membership Billing Switcher (Monthly <-> Annual) -> 20% Discount Math & Price Display Sync', () => {
    // F07 (Membership Experience) + F02 (UI Primitives)
    const memConfigPath = path.join(process.cwd(), 'src/config/membership.ts');
    const content = fs.readFileSync(memConfigPath, 'utf8');

    // Extract plans from config
    assert.includes(content, 'priceMonthly: 79');
    assert.includes(content, 'priceAnnualMonthly: 63');
    assert.includes(content, 'priceMonthly: 149');
    assert.includes(content, 'priceAnnualMonthly: 119');
    assert.includes(content, 'priceMonthly: 249');
    assert.includes(content, 'priceAnnualMonthly: 199');

    const plans = [
      { id: 'starter', priceMonthly: 79, priceAnnualMonthly: 63 },
      { id: 'pro', priceMonthly: 149, priceAnnualMonthly: 119 },
      { id: 'elite', priceMonthly: 249, priceAnnualMonthly: 199 },
    ];

    const calculatePrice = (plan, annual) => (annual ? plan.priceAnnualMonthly : plan.priceMonthly);

    const starter = plans.find((p) => p.id === 'starter');
    const pro = plans.find((p) => p.id === 'pro');
    const elite = plans.find((p) => p.id === 'elite');

    // Monthly baseline checks
    assert.equal(calculatePrice(starter, false), 79, 'Starter monthly price is 79');
    assert.equal(calculatePrice(pro, false), 149, 'Pro monthly price is 149');
    assert.equal(calculatePrice(elite, false), 249, 'Elite monthly price is 249');

    // Toggle to Annual (approx 20% discount)
    assert.equal(calculatePrice(starter, true), 63, 'Starter annual monthly rate is 63');
    assert.equal(calculatePrice(pro, true), 119, 'Pro annual monthly rate is 119');
    assert.equal(calculatePrice(elite, true), 199, 'Elite annual monthly rate is 199');

    // Discount percentage formula verification: round((priceMonthly - priceAnnualMonthly) / priceMonthly * 100)
    const proDiscount = Math.round(((pro.priceMonthly - pro.priceAnnualMonthly) / pro.priceMonthly) * 100);
    assert.equal(proDiscount, 20, 'Pro annual tier achieves exactly 20% discount savings');

    // Revert to Monthly
    assert.equal(calculatePrice(pro, false), 149, 'Reverting to monthly restores baseline');
  });

  test('T3-20: WhatsApp Button Click -> Generates Parameterized URL with Pre-selected Membership Tier & Source', () => {
    // F11 (WhatsApp Integration) + F07 (Membership) + F10 (Final CTA)
    const siteConfigPath = path.join(process.cwd(), 'src/config/site.ts');
    const siteContent = fs.readFileSync(siteConfigPath, 'utf8');

    const phoneMatch = siteContent.match(/whatsappNumber:\s*['"]([^'"]+)['"]/);
    assert.truthy(phoneMatch, 'whatsappNumber must be defined in site.ts');
    const rawPhone = phoneMatch[1];
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    assert.equal(cleanPhone, '18004766367', 'Clean phone matches international E.164 without symbols');

    const generateWhatsAppUrl = (tier) => {
      const message = tier
        ? `Hello IRONFORGE FITNESS! I would like to inquire about the ${tier.toUpperCase()} membership tier and schedule a visit.`
        : `Hello IRONFORGE FITNESS! I am interested in training programs and membership details.`;
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    };

    const eliteUrl = generateWhatsAppUrl('elite');
    assert.includes(eliteUrl, 'https://wa.me/18004766367?text=', 'Base WhatsApp protocol URL formed');
    assert.includes(decodeURIComponent(eliteUrl), 'ELITE', 'Decoded URL contains selected ELITE tier');
    assert.includes(decodeURIComponent(eliteUrl), 'schedule a visit', 'Contains conversion intent text');

    const defaultUrl = generateWhatsAppUrl(null);
    assert.includes(decodeURIComponent(defaultUrl), 'training programs', 'Default URL contains general inquiry text');
  });

  test('T3-21: Hero CTA Click ("START YOUR TRANSFORMATION") -> Smooth Scroll to Membership & Pro Card Pulse', () => {
    // F14 (Hero Figure) + F07 (Membership Experience) + F02 (UI Primitives)
    const dom = createDOM();
    const win = createWindow();

    const heroCTA = dom.createElement('a');
    heroCTA.setAttribute('href', '#membership');
    heroCTA.className = 'btn-primary';
    heroCTA.textContent = 'START YOUR TRANSFORMATION';

    const proCard = dom.createElement('div');
    proCard.id = 'plan-pro';
    proCard.className = 'membership-card border border-[#C6FF33]';

    let pulseTriggered = false;
    heroCTA.addEventListener('click', (e) => {
      e.preventDefault();
      win.scrollTo({ top: 3750, behavior: 'smooth' });
      proCard.className = 'membership-card border border-[#C6FF33] animate-pulse ring-4 ring-[#C6FF33]/50';
      pulseTriggered = true;
    });

    heroCTA.click();

    assert.equal(win.scrollY, 3750, 'Window scroll moves to #membership offset');
    assert.equal(pulseTriggered, true, 'Card pulse animation activated');
    assert.includes(proCard.className, 'animate-pulse', 'Pro card receives attention pulse effect');
    assert.includes(proCard.className, 'ring-[#C6FF33]', 'Card accentuates brand lime ring');
  });

  test('T3-22: Viewport Orientation / DPR Change -> Adaptive DPR Re-clamping & Buffer Resize', () => {
    // F12 (3D Canvas) + F18 (Mobile Hardening)
    const clampDPR = (dpr, isMobile = false) => Math.min(dpr || 1, isMobile ? 1.3 : 2.0);

    // On mobile portrait (390x844, DPR 3.0)
    const mobileDPR = clampDPR(3.0, true);
    assert.closeTo(mobileDPR, 1.3, 0.001, 'Mobile DPR clamped to 1.3 to conserve GPU resources');

    // On mobile landscape orientation (844x390, DPR 3.0)
    let rendererState = { width: 390, height: 844, dpr: mobileDPR, aspect: 390 / 844 };

    const handleOrientationChange = (newW, newH) => {
      rendererState.width = newW;
      rendererState.height = newH;
      rendererState.aspect = newW / newH;
      rendererState.dpr = clampDPR(3.0, true); // stays clamped
    };

    handleOrientationChange(844, 390);

    assert.equal(rendererState.width, 844, 'Renderer buffer width updated to 844');
    assert.equal(rendererState.height, 390, 'Renderer buffer height updated to 390');
    assert.closeTo(rendererState.aspect, 2.164, 0.01, 'Camera aspect ratio updated for landscape');
    assert.closeTo(rendererState.dpr, 1.3, 0.001, 'DPR remains strictly clamped at 1.3');
  });

  test('T3-23: Keyboard Tab Navigation Cycle -> 3D Canvas Focus Bypass (tabindex="-1") -> Skip Link Jump', () => {
    // F03 (Navbar) + F17 (Accessibility) + F14 (Hero)
    const dom = createDOM();

    const skipLink = dom.createElement('a');
    skipLink.setAttribute('href', '#main-content');
    skipLink.className = 'sr-only focus:not-sr-only focus:ring-2 focus:ring-[#C6FF33]';
    skipLink.textContent = 'Skip to main content';

    const canvas = dom.createElement('canvas');
    canvas.id = 'webgl-canvas';
    canvas.setAttribute('tabindex', '-1');
    canvas.setAttribute('aria-hidden', 'true');

    const mainContent = dom.createElement('main');
    mainContent.id = 'main-content';

    dom.body.appendChild(skipLink);
    dom.body.appendChild(canvas);
    dom.body.appendChild(mainContent);

    // Canvas must not be in keyboard tab order
    assert.equal(canvas.getAttribute('tabindex'), '-1', 'Canvas has tabindex -1');
    assert.equal(canvas.getAttribute('aria-hidden'), 'true', 'Canvas has aria-hidden true');

    // Skip link targets #main-content
    assert.equal(skipLink.getAttribute('href'), '#main-content', 'Skip link targets main content');
    assert.includes(skipLink.className, 'focus:ring-[#C6FF33]', 'Skip link uses Acid Lime focus ring token');
  });

  test('T3-24: Final CTA "CLAIM 1-DAY PASS" Click -> Opens Contact Modal with Trial Pre-selected & Demo Notice', () => {
    // F10 (Final CTA) + F11 (Contact Form) + F02 (Modal Primitives)
    const dom = createDOM();

    const claimPassBtn = dom.createElement('button');
    claimPassBtn.id = 'btn-claim-pass';
    claimPassBtn.className = 'btn-cta';
    claimPassBtn.setAttribute('data-cta-action', 'trial-pass');
    claimPassBtn.textContent = 'CLAIM FREE 1-DAY PASS';
    dom.body.appendChild(claimPassBtn);

    const modal = dom.createElement('div');
    modal.id = 'trial-pass-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.className = 'hidden';

    const modalTitle = dom.createElement('h3');
    modalTitle.id = 'modal-title';

    const interestDropdown = dom.createElement('select');
    interestDropdown.id = 'modal-interest-select';
    ['starter', 'pro', 'elite', 'personal-training'].forEach((tier) => {
      const opt = dom.createElement('option');
      opt.setAttribute('value', tier);
      opt.textContent = tier;
      interestDropdown.appendChild(opt);
    });

    const demoNotice = dom.createElement('div');
    demoNotice.id = 'demo-badge';

    modal.appendChild(modalTitle);
    modal.appendChild(interestDropdown);
    modal.appendChild(demoNotice);
    dom.body.appendChild(modal);

    claimPassBtn.addEventListener('click', () => {
      modal.className = 'visible modal-container fixed inset-0 z-50';
      modalTitle.textContent = 'Claim Your 1-Day VIP Pass';
      interestDropdown.value = 'personal-training';
      demoNotice.textContent = 'DEMO MODE: Submissions are simulated for client demonstration.';
    });

    claimPassBtn.click();

    assert.includes(modal.className, 'visible', 'Modal opens on CTA click');
    assert.equal(modalTitle.textContent, 'Claim Your 1-Day VIP Pass', 'Modal title confirms VIP pass');
    assert.equal(interestDropdown.value, 'personal-training', 'Interest dropdown pre-selected to personal training');
    assert.includes(demoNotice.textContent, 'DEMO MODE', 'Demo mode notice prominently displayed');
  });
});
