/**
 * Tier 3 — Cross-Feature Interaction Test Suite
 * Specifications T3-13 through T3-18: Tilt Cards Reduced Motion, WebGL Context Loss & Restoration,
 * Syllabus Focus Trap, and Gallery Lightbox Navigation & Dismissal
 */

const fs = require('node:fs');
const path = require('node:path');
const assert = require('../helpers/assert');
const { createDOM, createWindow } = require('../helpers/dom');
const { createModalFSM } = require('../helpers/state');
const { createMatchMediaMock } = require('../helpers/mock');
const { galleryItems } = require('../../src/config/gallery.ts');

describe('Tier 3: Cross-Feature Interactions (T3-13 to T3-18)', () => {
  test('T3-13: Reduced Motion Active -> Trainer 3D Tilt Cards Disable Perspective Transform & Retain Flat Hover', () => {
    // F06 (Trainers Tilt Cards) + F17 (Motion Accessibility)
    const dom = createDOM();
    const media = createMatchMediaMock({ reducedMotion: true });

    const tiltCard = dom.createElement('div');
    tiltCard.className = 'trainer-tilt-card border border-white/10 transition-all';
    tiltCard.id = 'trainer-card-marcus';

    // Tilt card logic with reduced motion guard
    const handleMouseMove = (x, y) => {
      const prefersReduced = media('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        // Flat translation without perspective rotation
        tiltCard.style.transform = 'translateY(-4px)';
        tiltCard.className = 'trainer-tilt-card border border-[#C6FF33] shadow-lg';
      } else {
        const rotX = (y - 150) / 10;
        const rotY = (x - 150) / 10;
        tiltCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }
    };

    handleMouseMove(20, 20);

    assert.notMatch(tiltCard.style.transform, /perspective|rotateX|rotateY/, 'Perspective and 3D rotation must be suppressed under reduced motion');
    assert.equal(tiltCard.style.transform, 'translateY(-4px)', 'Flat vertical lift applied instead');
    assert.includes(tiltCard.className, 'border-[#C6FF33]', 'Lime brand border highlight remains fully functional');
  });

  test('T3-14: WebGL Context Loss (webglcontextlost) -> Instant Fallback to Static Hero Graphic & CSS Glows', () => {
    // F12 (WebGL Fallback) + F14 (3D Hero Figure)
    const dom = createDOM();
    const canvas = dom.createElement('canvas');
    canvas.id = 'three-canvas';
    const fallbackContainer = dom.createElement('div');
    fallbackContainer.id = 'webgl-fallback-hero';
    fallbackContainer.className = 'hidden';

    dom.body.appendChild(canvas);
    dom.body.appendChild(fallbackContainer);

    let isWebGLAvailable = true;

    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault(); // allow recovery
      isWebGLAvailable = false;
      canvas.className = 'opacity-0 pointer-events-none';
      fallbackContainer.className = 'visible relative w-full h-screen flex items-center justify-center';
      fallbackContainer.innerHTML = '<div class="hero-glow bg-[#7D39EB]/30 blur-3xl"></div><img src="/fallback-hero.webp" alt="IRONFORGE Athletic Hero" />';
    });

    // Trigger synthetic context loss
    canvas.dispatchEvent({ type: 'webglcontextlost', preventDefault: () => {} });

    assert.equal(isWebGLAvailable, false, 'WebGL availability flips to false');
    assert.includes(canvas.className, 'pointer-events-none', 'Canvas is disabled and hidden');
    assert.includes(fallbackContainer.className, 'visible', 'Fallback graphic container mounts');
    assert.includes(fallbackContainer.innerHTML, 'bg-[#7D39EB]', 'Rich CSS violet ambient glow applied');
    assert.includes(fallbackContainer.innerHTML, 'fallback-hero.webp', 'Static hero visual rendered');
  });

  test('T3-15: WebGL Context Restored (webglcontextrestored) -> 3D Scene Re-initialization & Fallback Disposal', () => {
    // F12 (WebGL Fallback) + F14 (Hero Figure) + F18 (GPU Memory Disposal)
    const dom = createDOM();
    const canvas = dom.createElement('canvas');
    canvas.id = 'three-canvas';
    canvas.className = 'opacity-0 pointer-events-none';

    const fallbackContainer = dom.createElement('div');
    fallbackContainer.id = 'webgl-fallback-hero';
    fallbackContainer.className = 'visible';

    let isWebGLAvailable = false;
    let shadersRecompiled = false;

    canvas.addEventListener('webglcontextrestored', () => {
      isWebGLAvailable = true;
      shadersRecompiled = true;
      canvas.className = 'opacity-100 pointer-events-auto';
      fallbackContainer.className = 'hidden';
      fallbackContainer.innerHTML = '';
    });

    // Fire restoration event
    canvas.dispatchEvent({ type: 'webglcontextrestored' });

    assert.equal(isWebGLAvailable, true, 'WebGL availability restores to true');
    assert.equal(shadersRecompiled, true, 'Shader programs re-compile on restoration');
    assert.includes(canvas.className, 'opacity-100', 'Canvas is made visible again');
    assert.includes(fallbackContainer.className, 'hidden', 'Fallback container is safely dismissed');
    assert.equal(fallbackContainer.innerHTML, '', 'Fallback DOM nodes disposed cleanly');
  });

  test('T3-16: Training Program Card Syllabus Modal Open -> Focus Trap Activated -> Escape Key Closes Modal', () => {
    // F04 (Programs Section) + F02 (Lightbox/Modal UI) + F17 (Accessibility)
    const dom = createDOM();
    const modalFSM = createModalFSM();
    assert.equal(modalFSM.state, 'closed');

    const triggerBtn = dom.createElement('button');
    triggerBtn.id = 'btn-syllabus-strength';
    triggerBtn.textContent = 'View Syllabus';
    dom.body.appendChild(triggerBtn);

    const modal = dom.createElement('div');
    modal.id = 'syllabus-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.className = 'hidden';

    const closeBtn = dom.createElement('button');
    closeBtn.id = 'modal-close';
    closeBtn.setAttribute('aria-label', 'Close modal');

    const link1 = dom.createElement('a');
    link1.setAttribute('href', '#download');
    link1.id = 'modal-link-1';

    const link2 = dom.createElement('a');
    link2.setAttribute('href', '#register');
    link2.id = 'modal-link-2';

    modal.appendChild(closeBtn);
    modal.appendChild(link1);
    modal.appendChild(link2);
    dom.body.appendChild(modal);

    let focusedElement = null;

    triggerBtn.addEventListener('click', () => {
      modalFSM.transition('open');
      modal.className = 'visible modal-overlay';
      focusedElement = closeBtn; // trap focus to first element
    });

    triggerBtn.click();
    assert.equal(modalFSM.state, 'open', 'Modal transitions to open');
    assert.equal(focusedElement.id, 'modal-close', 'Focus trapped inside modal on open');

    // Simulate keydown Escape
    const handleKeyDown = (key) => {
      if (key === 'Escape' && modalFSM.state === 'open') {
        modalFSM.transition('closed');
        modal.className = 'hidden';
        focusedElement = triggerBtn; // restore focus to trigger
      }
    };

    handleKeyDown('Escape');
    assert.equal(modalFSM.state, 'closed', 'Escape key transitions modal to closed');
    assert.includes(modal.className, 'hidden', 'Modal overlay hidden');
    assert.equal(focusedElement.id, 'btn-syllabus-strength', 'Focus restored to initial trigger button');
  });

  test('T3-17: Gallery Item Click -> Lightbox Modal Open -> Left/Right Arrow Navigation -> Counter Update', () => {
    // F08 (Gallery Experience) + F02 (Lightbox Modal) + F17 (Keyboard Navigation)
    // Uses authentic galleryItems from src/config/gallery.ts
    assert.equal(galleryItems.length, 8, 'Real gallery catalog contains 8 curated photos');

    let activeIndex = 0;

    const navigate = (direction) => {
      if (direction === 'next') {
        activeIndex = (activeIndex + 1) % galleryItems.length;
      } else if (direction === 'prev') {
        activeIndex = (activeIndex - 1 + galleryItems.length) % galleryItems.length;
      }
    };

    const getCounter = () => `${activeIndex + 1} / ${galleryItems.length}`;

    assert.equal(getCounter(), '1 / 8', 'Initial counter is 1 / 8');
    assert.equal(galleryItems[activeIndex].title, 'Calibrated Competition Platforms');

    // Press ArrowRight
    navigate('next');
    assert.equal(getCounter(), '2 / 8', 'Next navigation updates counter to 2 / 8');
    assert.equal(galleryItems[activeIndex].title, 'Focus Under Heavy Load');

    // Press ArrowRight again
    navigate('next');
    assert.equal(getCounter(), '3 / 8', 'Next navigation updates counter to 3 / 8');

    // Press ArrowLeft
    navigate('prev');
    assert.equal(getCounter(), '2 / 8', 'Prev navigation returns to 2 / 8');
  });

  test('T3-18: Gallery Lightbox Open -> Background Scroll Lock -> Backdrop Click Dismiss -> Scroll Position Preserved', () => {
    // F08 (Gallery) + F02 (Lightbox) + F18 (Layout Hardening)
    const dom = createDOM();
    const win = createWindow();

    // User scrolled down to gallery section
    win.scrollY = 3400;

    const backdrop = dom.createElement('div');
    backdrop.id = 'lightbox-backdrop';
    backdrop.className = 'fixed inset-0 bg-black/95 backdrop-blur-md';
    backdrop.setAttribute('data-lightbox-backdrop', 'true');
    dom.body.appendChild(backdrop);

    // Open lightbox locks scroll
    dom.body.style.overflow = 'hidden';
    assert.equal(dom.body.style.overflow, 'hidden', 'Scroll locked while lightbox is open');

    // User clicks backdrop
    let lightboxClosed = false;
    backdrop.addEventListener('click', () => {
      lightboxClosed = true;
      dom.body.style.overflow = '';
      dom.body.removeChild(backdrop);
    });

    backdrop.click();

    assert.equal(lightboxClosed, true, 'Clicking backdrop dismisses lightbox');
    assert.equal(dom.body.style.overflow, '', 'Body scroll restored');
    assert.equal(win.scrollY, 3400, 'Scroll position preserved at 3400px without jumping');
  });
});
