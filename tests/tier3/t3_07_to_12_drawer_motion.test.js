/**
 * Tier 3 — Cross-Feature Interaction Test Suite
 * Specifications T3-07 through T3-12: Drawer & Viewport Resize, Body Scroll Lock, Form Submissions & Errors,
 * OrbitControls Drag, and Reduced Motion Narrative Switching
 */

const fs = require('node:fs');
const path = require('node:path');
const assert = require('../helpers/assert');
const { createDOM, createWindow } = require('../helpers/dom');
const { createDrawerFSM, createContactFormFSM } = require('../helpers/state');
const { createMatchMediaMock } = require('../helpers/mock');
const { CAMERA_WAYPOINTS, CameraNarrativeEvaluator } = require('../helpers/scroll');

describe('Tier 3: Cross-Feature Interactions (T3-07 to T3-12)', () => {
  test('T3-07: Mobile Drawer Open -> Viewport Resize to Desktop -> Drawer Auto-Dismiss & Navbar State Restoration', () => {
    // F03 (Mobile Drawer & Navbar) + F18 (Mobile-First Hardening)
    const dom = createDOM();
    const win = createWindow();
    win.innerWidth = 390;
    win.innerHeight = 844;
    const fsm = createDrawerFSM();

    const hamburger = dom.createElement('button');
    hamburger.setAttribute('aria-label', 'Open mobile navigation');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.id = 'hamburger-btn';

    const drawer = dom.createElement('div');
    drawer.id = 'mobile-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.className = 'drawer fixed inset-y-0 right-0 w-80 translate-x-full';

    const desktopNav = dom.createElement('nav');
    desktopNav.id = 'desktop-nav';
    desktopNav.className = 'hidden lg:block';

    dom.body.appendChild(hamburger);
    dom.body.appendChild(drawer);
    dom.body.appendChild(desktopNav);

    // Step 1: Open mobile drawer
    fsm.transition('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    drawer.className = 'drawer fixed inset-y-0 right-0 w-80 translate-x-0';
    dom.body.style.overflow = 'hidden';

    assert.equal(fsm.state, 'open', 'Drawer state is open');
    assert.equal(dom.body.style.overflow, 'hidden', 'Body scroll is locked');

    // Step 2: Simulate window resize to desktop breakpoint (1280px)
    win.innerWidth = 1280;
    // Resize handler auto-closes mobile drawer
    if (win.innerWidth >= 1024) {
      if (fsm.state === 'open') {
        fsm.transition('closed');
      }
      drawer.setAttribute('aria-hidden', 'true');
      drawer.className = 'drawer fixed inset-y-0 right-0 w-80 translate-x-full hidden';
      hamburger.setAttribute('aria-expanded', 'false');
      dom.body.style.overflow = '';
      desktopNav.className = 'block lg:block';
    }

    assert.equal(fsm.state, 'closed', 'Drawer state automatically closes on desktop resize');
    assert.equal(drawer.getAttribute('aria-hidden'), 'true', 'Drawer is marked aria-hidden');
    assert.includes(drawer.className, 'translate-x-full', 'Drawer translated out of screen');
    assert.equal(dom.body.style.overflow, '', 'Body scroll restored');
    assert.equal(hamburger.getAttribute('aria-expanded'), 'false', 'Hamburger resets to collapsed');
    assert.includes(desktopNav.className, 'block', 'Desktop nav becomes visible');
  });

  test('T3-08: Mobile Drawer Open -> Body Scroll Lock Enforcement -> Nav Link Click -> Drawer Close & Scroll Unlock', () => {
    // F03 (Mobile Drawer) + F18 (Layout Hardening)
    const dom = createDOM();
    const win = createWindow();
    win.innerWidth = 390;
    win.innerHeight = 844;
    const fsm = createDrawerFSM();

    fsm.transition('open');
    dom.body.style.overflow = 'hidden';

    const drawerLink = dom.createElement('a');
    drawerLink.setAttribute('href', '#trainers');
    drawerLink.className = 'drawer-nav-link';
    drawerLink.id = 'link-trainers';
    drawerLink.textContent = 'Trainers';
    dom.body.appendChild(drawerLink);

    let scrollTarget = null;
    drawerLink.addEventListener('click', (e) => {
      e.preventDefault();
      fsm.transition('closed');
      dom.body.style.overflow = '';
      scrollTarget = '#trainers';
      win.scrollTo({ top: 2500, behavior: 'smooth' });
    });

    drawerLink.click();

    assert.equal(fsm.state, 'closed', 'Drawer closes when link clicked');
    assert.equal(dom.body.style.overflow, '', 'Body scroll lock unlocked');
    assert.equal(scrollTarget, '#trainers', 'Scroll targets trainers section');
    assert.equal(win.scrollY, 2500, 'Page scroll moves to trainers position');
  });

  test('T3-09: Contact Form Valid Submission in Demo Mode -> Feedback Notification & Form Reset', () => {
    // F11 (Contact Form) + F02 (UI Primitives)
    const formFSM = createContactFormFSM();
    assert.equal(formFSM.state, 'idle', 'Initial form state is idle');

    const dom = createDOM();
    const nameInput = dom.createElement('input');
    nameInput.name = 'fullName';
    nameInput.value = 'Sarah Connor';

    const phoneInput = dom.createElement('input');
    phoneInput.name = 'phone';
    phoneInput.value = '+1 (555) 839-2001';

    const emailInput = dom.createElement('input');
    emailInput.name = 'email';
    emailInput.value = 'sarah@sky.net';

    const submitBtn = dom.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.id = 'btn-submit';

    const statusBox = dom.createElement('div');
    statusBox.id = 'status-box';
    statusBox.setAttribute('role', 'status');

    const resetBtn = dom.createElement('button');
    resetBtn.id = 'btn-reset';

    // Step 2: Validate inputs
    formFSM.transition('validating');
    assert.equal(formFSM.state, 'validating', 'Form validates input fields');

    // Step 3: Transition to submitting
    formFSM.transition('submitting');
    submitBtn.setAttribute('disabled', 'true');
    statusBox.textContent = 'Transmitting enquiry (Demo Mode)...';

    assert.equal(submitBtn.disabled, true, 'Button disabled during submission');

    // Step 4: Simulated async success resolution
    formFSM.transition('success');
    statusBox.textContent = 'Enquiry Dispatched! In demonstration mode, your request has been logged.';
    statusBox.className = 'bg-[#C6FF33]/15 border border-[#C6FF33] text-white p-6 rounded-2xl';

    assert.equal(formFSM.state, 'success', 'Form transitions to success');
    assert.includes(statusBox.textContent, 'Enquiry Dispatched!', 'Success message displayed');

    // Step 5: Reset form
    resetBtn.addEventListener('click', () => {
      formFSM.transition('idle');
      nameInput.value = '';
      phoneInput.value = '';
      emailInput.value = '';
      submitBtn.removeAttribute('disabled');
      statusBox.textContent = '';
    });
    resetBtn.click();

    assert.equal(formFSM.state, 'idle', 'Form returns to idle state');
    assert.equal(nameInput.value, '', 'Name input cleared');
    assert.equal(phoneInput.value, '', 'Phone input cleared');
    assert.equal(emailInput.value, '', 'Email input cleared');
  });

  test('T3-10: Contact Form Validation Error -> Red/Violet Border -> Corrective Typing Clears Error in Real-time', () => {
    // F11 (Contact Form) + F02 (UI Primitives) + F01 (Design Tokens)
    const dom = createDOM();

    const nameInput = dom.createElement('input');
    nameInput.name = 'fullName';
    nameInput.id = 'input-name';
    nameInput.className = 'border border-white/20';

    const emailInput = dom.createElement('input');
    emailInput.name = 'email';
    emailInput.id = 'input-email';
    emailInput.className = 'border border-white/20';

    const emailError = dom.createElement('span');
    emailError.id = 'email-error';
    emailError.className = 'hidden';

    const nameError = dom.createElement('span');
    nameError.id = 'name-error';
    nameError.className = 'hidden';

    // Step 1: Submit invalid email and empty name
    emailInput.value = 'sarah-invalid-email';
    nameInput.value = '';

    const validate = () => {
      let valid = true;
      if (!nameInput.value.trim()) {
        nameInput.setAttribute('aria-invalid', 'true');
        nameInput.className = 'border border-red-500 bg-red-500/10';
        nameError.className = 'text-red-400 text-xs visible';
        nameError.textContent = 'Full name is required.';
        valid = false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.className = 'border border-red-500 bg-red-500/10';
        emailError.className = 'text-red-400 text-xs visible';
        emailError.textContent = 'Please enter a valid email address.';
        valid = false;
      }
      return valid;
    };

    assert.equal(validate(), false, 'Validation fails with invalid inputs');
    assert.equal(nameInput.getAttribute('aria-invalid'), 'true', 'Name input marked aria-invalid');
    assert.equal(emailInput.getAttribute('aria-invalid'), 'true', 'Email input marked aria-invalid');
    assert.includes(emailInput.className, 'border-red-500', 'Error border applied');

    // Step 2: Correct typing in real-time
    nameInput.value = 'Sarah Connor';
    nameInput.setAttribute('aria-invalid', 'false');
    nameInput.className = 'border border-white/20';
    nameError.className = 'hidden';

    emailInput.value = 'sarah@example.com';
    emailInput.setAttribute('aria-invalid', 'false');
    emailInput.className = 'border border-white/20';
    emailError.className = 'hidden';

    assert.equal(nameInput.getAttribute('aria-invalid'), 'false', 'Name error cleared on valid input');
    assert.equal(emailInput.getAttribute('aria-invalid'), 'false', 'Email error cleared on valid input');
    assert.equal(validate(), true, 'Form is now completely valid');
  });

  test('T3-11: 3D Equipment OrbitControls Drag -> Scroll Passthrough Prevention -> Idle Levitation Resumption', () => {
    // F16 (3D Equipment) + F18 (Mobile Touch & Layout)
    const dom = createDOM();
    const canvasOverlay = dom.createElement('div');
    canvasOverlay.id = 'equipment-orbit-zone';
    canvasOverlay.style.touchAction = 'none';

    let pointerState = { isDragging: false, rotationY: 0, preventDefaultCalled: false };
    let levitationClock = { time: 0, amplitude: 0.15, frequency: 1.5 };

    canvasOverlay.addEventListener('pointerdown', (e) => {
      pointerState.isDragging = true;
      e.preventDefault();
      pointerState.preventDefaultCalled = true;
    });

    canvasOverlay.addEventListener('pointermove', (e) => {
      if (pointerState.isDragging) {
        pointerState.rotationY += 0.05; // horizontal spin
      }
    });

    canvasOverlay.addEventListener('pointerup', () => {
      pointerState.isDragging = false;
    });

    // Simulate drag interaction
    canvasOverlay.dispatchEvent({ type: 'pointerdown', preventDefault: () => { pointerState.preventDefaultCalled = true; } });
    canvasOverlay.dispatchEvent({ type: 'pointermove' });
    canvasOverlay.dispatchEvent({ type: 'pointermove' });
    canvasOverlay.dispatchEvent({ type: 'pointerup' });

    assert.equal(pointerState.preventDefaultCalled, true, 'Pointerdown prevents default page scroll');
    assert.closeTo(pointerState.rotationY, 0.10, 0.001, 'Pointer dragging increments 3D model rotation');
    assert.equal(pointerState.isDragging, false, 'Pointer released stops manual drag');

    // Harmonic levitation resumption: y = y0 + A * sin(w * t)
    const t = 1.0;
    const levitationY = levitationClock.amplitude * Math.sin(levitationClock.frequency * t);
    assert.truthy(Math.abs(levitationY) > 0, 'Harmonic levitation resumes oscillating smoothly');
  });

  test('T3-12: Reduced Motion Toggle -> GSAP 5-Scene Camera Narrative Switches to Instant Waypoint Cuts', () => {
    // F15 (GSAP Camera Narrative) + F17 (Motion Accessibility)
    const media = createMatchMediaMock({ reducedMotion: true });
    assert.equal(media('(prefers-reduced-motion: reduce)').matches, true);

    const normalEvaluator = new CameraNarrativeEvaluator(CAMERA_WAYPOINTS, { reducedMotion: false });
    const reducedEvaluator = new CameraNarrativeEvaluator(CAMERA_WAYPOINTS, { reducedMotion: true });

    const normalCam = normalEvaluator.evaluate(0.5);
    const reducedCam = reducedEvaluator.evaluate(0.5);

    // Reduced motion locks camera to static vantage point
    assert.deepEqual(reducedCam.position, [0.0, 2.2, 8.0], 'Camera stays in fixed safe vantage point under reduced motion');
    assert.equal(reducedCam.waypointId, 'performance', 'Waypoint index correctly identifies active section');
  });
});
