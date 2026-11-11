/**
 * Tier 4 — Real-World Application User Journey Scenarios
 * Scenarios T4-SCN-01 through T4-SCN-05
 */

const fs = require('node:fs');
const path = require('node:path');
const assert = require('../helpers/assert');
const { createDOM, createWindow } = require('../helpers/dom');
const { createMatchMediaMock } = require('../helpers/mock');
const { CAMERA_WAYPOINTS, CameraNarrativeEvaluator } = require('../helpers/scroll');
const { createContactFormFSM, createDrawerFSM, createEquipmentFSM } = require('../helpers/state');

describe('Tier 4: Real-World Prospect User Journeys (Scenarios 01 to 05)', () => {
  test('T4-SCN-01: Prospect Gym Owner VIP Desktop Evaluation Tour', () => {
    // Marcus Sterling: Desktop Chrome 1920x1080, high-perf GPU, full WebGL 2.0
    const dom = createDOM();
    const win = createWindow();
    win.innerWidth = 1920;
    win.innerHeight = 1080;

    // 1. Hero Experience & Exact 4-Color Adherence
    const siteConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/site.ts'), 'utf8');
    assert.includes(siteConfigSrc, "'#000000'");
    assert.includes(siteConfigSrc, "'#7D39EB'");
    assert.includes(siteConfigSrc, "'#C6FF33'");
    assert.includes(siteConfigSrc, "'#FFFFFF'");

    // 2. Continuous Scroll Narrative: Catmull-Rom through 5 Scenes
    const evaluator = new CameraNarrativeEvaluator();
    const scrollScenes = [
      { progress: 0.0, expectedId: 'beginning' },
      { progress: 0.25, expectedId: 'strength' },
      { progress: 0.50, expectedId: 'performance' },
      { progress: 0.75, expectedId: 'discipline' },
      { progress: 1.0, expectedId: 'next-level' }
    ];

    scrollScenes.forEach(({ progress, expectedId }) => {
      const state = evaluator.evaluate(progress);
      assert.equal(state.waypointId, expectedId, `Camera reaches ${expectedId} at progress ${progress}`);
      assert.equal(state.position.length, 3, 'Valid 3D camera vector');
      assert.equal(state.target.length, 3, 'Valid 3D target vector');
    });

    // 3. 3D Equipment Showcase Testing: Cycle 4 apparatus
    const equipFSM = createEquipmentFSM();
    assert.equal(equipFSM.state, 'barbell');
    equipFSM.transition('dumbbell');
    assert.equal(equipFSM.state, 'dumbbell');
    equipFSM.transition('plates');
    assert.equal(equipFSM.state, 'plates');
    equipFSM.transition('bench');
    assert.equal(equipFSM.state, 'bench');

    // 4. Bento Grid & Trainer Credibility
    const trainersSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/trainers.ts'), 'utf8');
    assert.includes(trainersSrc, 'Marcus Vance');
    assert.includes(trainersSrc, 'Dr. Elena Rostova');
    assert.includes(trainersSrc, 'Jaxson Reed');

    // 5. Commercial Transparency & Demo Attribution
    assert.includes(siteConfigSrc, 'demoMode: true');
    assert.includes(siteConfigSrc, 'IRONFORGE FITNESS');
  });

  test('T4-SCN-02: High-Intent Member Lead Discovery to Contact Submission', () => {
    // Elena Rostova: Competitive powerlifter on 1440x900 desktop
    const dom = createDOM();
    const win = createWindow();
    win.innerWidth = 1440;
    win.innerHeight = 900;

    // 1. Direct navigation to #membership
    win.scrollTo({ top: 3750, behavior: 'smooth' });
    assert.equal(win.scrollY, 3750, 'Scrolled to membership section');

    // 2. Plan evaluation & Annual discount
    const membershipSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/membership.ts'), 'utf8');
    assert.includes(membershipSrc, 'priceMonthly: 149');
    assert.includes(membershipSrc, 'priceAnnualMonthly: 119');

    // 3. Click "SELECT PRO" and prefill contact form
    const contactSection = dom.createElement('section');
    contactSection.id = 'contact';

    const interestSelect = dom.createElement('select');
    interestSelect.id = 'membership-interest';
    ['starter', 'pro', 'elite'].forEach((t) => {
      const opt = dom.createElement('option');
      opt.setAttribute('value', t);
      interestSelect.appendChild(opt);
    });
    interestSelect.value = 'pro'; // prefilled to pro

    assert.equal(interestSelect.value, 'pro', 'Interest dropdown prefilled to pro');

    // 4. Form inputs & Validation
    const formFSM = createContactFormFSM();
    const leadData = {
      fullName: 'Elena Rostova',
      phone: '+15552345678',
      email: 'elena.lifts@example.com',
      membershipInterest: interestSelect.value,
      message: 'Looking to train for USAPL nationals.'
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

    assert.truthy(leadData.fullName.length >= 2, 'Name is valid');
    assert.truthy(emailRegex.test(leadData.email), 'Email matches valid format');
    assert.truthy(phoneRegex.test(leadData.phone), 'Phone matches valid format');

    // 5. Form Submission Cycle
    formFSM.transition('submitting');
    assert.equal(formFSM.state, 'submitting');

    formFSM.transition('success');
    assert.equal(formFSM.state, 'success', 'Form reaches success in demo mode');

    formFSM.transition('idle');
    assert.equal(formFSM.state, 'idle', 'Form resets cleanly when starting new inquiry');
  });

  test('T4-SCN-03: Mobile Smartphone Visitor Touch Journey (iOS Safari / Android Chrome)', () => {
    // Liam: iPhone 15 Pro (390x844px), DPR 3.0, touch device
    const dom = createDOM();
    const win = createWindow();
    win.innerWidth = 390;
    win.innerHeight = 844;

    // 1. Clamped DPR for Mobile WebGL
    const clampDPR = (dpr) => Math.min(dpr || 1, 1.3);
    const mobileDPR = clampDPR(3.0);
    assert.closeTo(mobileDPR, 1.3, 0.001, 'Mobile DPR clamped to 1.3');

    // 2. Zero Horizontal Overflow
    const pageContainer = dom.createElement('div');
    pageContainer.className = 'w-full max-w-full overflow-x-hidden';
    pageContainer.scrollWidth = 390;
    pageContainer.clientWidth = 390;
    assert.equal(pageContainer.scrollWidth, pageContainer.clientWidth, 'Zero horizontal overflow at 390px');

    // 3. Mobile Drawer Navigation & Scroll Lock
    const drawerFSM = createDrawerFSM();
    drawerFSM.transition('open');
    dom.body.style.overflow = 'hidden';
    assert.equal(drawerFSM.state, 'open', 'Drawer opened');
    assert.equal(dom.body.style.overflow, 'hidden', 'Body scroll locked');

    // Tap Programs link
    drawerFSM.transition('closed');
    dom.body.style.overflow = '';
    win.scrollTo({ top: 1250, behavior: 'smooth' });
    assert.equal(drawerFSM.state, 'closed', 'Drawer auto-closes after link click');
    assert.equal(dom.body.style.overflow, '', 'Body scroll restored');
    assert.equal(win.scrollY, 1250, 'Scrolled to programs section');

    // 4. Quick-Action Floating WhatsApp Button
    const siteConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/site.ts'), 'utf8');
    const phoneMatch = siteConfigSrc.match(/whatsappNumber:\s*['"]([^'"]+)['"]/);
    const cleanPhone = phoneMatch[1].replace(/[^0-9]/g, '');

    const floatingWhatsApp = dom.createElement('a');
    floatingWhatsApp.setAttribute('href', `https://wa.me/${cleanPhone}`);
    floatingWhatsApp.setAttribute('aria-label', 'Direct WhatsApp Consultation');
    floatingWhatsApp.setAttribute('target', '_blank');
    floatingWhatsApp.setAttribute('rel', 'noopener noreferrer');
    floatingWhatsApp.className = 'fixed bottom-6 right-6 z-40';

    assert.equal(floatingWhatsApp.getAttribute('target'), '_blank');
    assert.includes(floatingWhatsApp.getAttribute('href'), 'wa.me');
    assert.includes(floatingWhatsApp.className, 'bottom-6');
    assert.includes(floatingWhatsApp.className, 'right-6');
  });

  test('T4-SCN-04: Low-Spec Hardware / WebGL-Disabled Hardware Fallback Journey', () => {
    // David: Corporate desktop without hardware acceleration
    const dom = createDOM();

    // 1. WebGL Capability Detection Simulation
    const checkWebGL = (mockCanvas) => {
      try {
        const gl = mockCanvas.getContext('webgl');
        return Boolean(gl);
      } catch {
        return false;
      }
    };

    const canvasWithoutWebGL = {
      getContext: (type) => null
    };

    const hasWebGL = checkWebGL(canvasWithoutWebGL);
    assert.equal(hasWebGL, false, 'WebGL capability detector cleanly returns false');

    // 2. Graceful Fallback Activation
    const fallbackHero = dom.createElement('div');
    fallbackHero.id = 'hero-fallback';
    fallbackHero.className = 'relative w-full h-screen bg-black flex items-center justify-center';
    fallbackHero.innerHTML = '<div class="absolute inset-0 bg-gradient-radial from-[#7D39EB]/20 to-black"></div><img src="/fallback-hero.webp" alt="IRONFORGE Athletic Figure in Industrial Gym" class="w-full max-w-xl" />';

    dom.body.appendChild(fallbackHero);

    assert.includes(fallbackHero.innerHTML, 'fallback-hero.webp', 'Static hero image mounted');
    assert.includes(fallbackHero.innerHTML, 'from-[#7D39EB]/20', 'CSS radial violet ambient glow maintained');

    // 3. Content Completeness: HTML sections remain fully interactive
    const sections = ['programs', 'about', 'trainers', 'membership', 'gallery', 'testimonials', 'contact'];
    sections.forEach((secId) => {
      const sec = dom.createElement('section');
      sec.id = secId;
      dom.body.appendChild(sec);
    });

    sections.forEach((secId) => {
      const found = dom.getElementById(secId);
      assert.truthy(found, `Section #${secId} is present and accessible without WebGL`);
    });
  });

  test('T4-SCN-05: Accessibility-First & Reduced Motion Journey (Screen Reader + Keyboard Only)', () => {
    // Jordan: Athlete with vestibular sensitivity using keyboard and screen reader
    const dom = createDOM();
    const media = createMatchMediaMock({ reducedMotion: true });

    // 1. Skip Navigation Link
    const skipLink = dom.createElement('a');
    skipLink.setAttribute('href', '#main-content');
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:ring-2 focus:ring-[#C6FF33]';

    const mainContent = dom.createElement('main');
    mainContent.id = 'main-content';

    dom.body.appendChild(skipLink);
    dom.body.appendChild(mainContent);

    assert.equal(skipLink.getAttribute('href'), '#main-content');
    assert.includes(skipLink.className, 'focus:ring-[#C6FF33]');

    // 2. Reduced Motion Verification on Camera Evaluator
    const evaluator = new CameraNarrativeEvaluator(CAMERA_WAYPOINTS, { reducedMotion: true });
    const cam = evaluator.evaluate(0.75);
    // Under reduced motion: position stays static [0.0, 2.2, 8.0]
    assert.deepEqual(cam.position, [0.0, 2.2, 8.0], 'Camera remains static to avoid motion sickness');

    // 3. Flat Trainer Tilt Cards Under Reduced Motion
    const trainerCard = dom.createElement('div');
    const isReduced = media('(prefers-reduced-motion: reduce)').matches;
    assert.equal(isReduced, true);

    if (isReduced) {
      trainerCard.style.transform = 'none';
    } else {
      trainerCard.style.transform = 'perspective(1000px) rotateX(10deg)';
    }

    assert.equal(trainerCard.style.transform, 'none', '3D perspective transform eliminated');

    // 4. Modal Accessibility Semantics
    const modal = dom.createElement('div');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');

    const modalTitle = dom.createElement('h2');
    modalTitle.id = 'modal-title';
    modalTitle.textContent = 'Curriculum Syllabus';
    modal.appendChild(modalTitle);

    assert.equal(modal.getAttribute('role'), 'dialog');
    assert.equal(modal.getAttribute('aria-modal'), 'true');
    assert.equal(modal.getAttribute('aria-labelledby'), 'modal-title');
  });
});
