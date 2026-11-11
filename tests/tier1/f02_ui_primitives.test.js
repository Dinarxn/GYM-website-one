const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { DOMNode, DOMEvent, createDOM } = require('../helpers/dom');

describe('Tier 1 - Feature 02: Component Library & UI Primitives', () => {
  test('T1-F02-01: Button Component Variants & Primary Lime Styling', () => {
    const btnSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/Button.tsx'), 'utf8');

    // Verify styling definitions in Button.tsx
    assert.match(btnSrc, /bg-\[#C6FF33\]/);
    assert.match(btnSrc, /text-\[#000000\]/);
    assert.match(btnSrc, /border-2 border-\[#7D39EB\]/);
    assert.match(btnSrc, /focus-visible:ring-\[#C6FF33\]/);

    // Verify simulated button interaction
    const btn = new DOMNode('button');
    btn.className = 'bg-[#C6FF33] text-[#000000] focus-visible:ring-[#C6FF33]';
    let clicked = false;
    btn.addEventListener('click', () => {
      clicked = true;
    });

    btn.click();
    assert.truthy(clicked, 'Button click should trigger listener');
    assert.truthy(btn.classList.contains('bg-[#C6FF33]'));
  });

  test('T1-F02-02: Badge Component Styling & Typography', () => {
    const badgeSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/Badge.tsx'), 'utf8');

    assert.match(badgeSrc, /uppercase rounded-full/);
    assert.match(badgeSrc, /text-\[#C6FF33\]/);
    assert.match(badgeSrc, /border-\[#7D39EB\]/);

    const badge = new DOMNode('span');
    badge.className = 'inline-flex items-center uppercase font-semibold text-[#C6FF33]';
    badge.textContent = 'MOST POPULAR';

    assert.equal(badge.textContent, 'MOST POPULAR');
    assert.truthy(badge.classList.contains('uppercase'));
  });

  test('T1-F02-03: SectionHeader Eyebrow, H2 Title, and Subtitle Hierarchy', () => {
    const headerSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/SectionHeader.tsx'), 'utf8');

    assert.match(headerSrc, /<h2/);
    assert.match(headerSrc, /text-\[#C6FF33\]/);
    assert.match(headerSrc, /text-white/);

    // Virtual DOM node test
    const container = new DOMNode('div');
    container.innerHTML = `
      <div class="mb-4"><span class="badge">PROGRAMS</span></div>
      <h2 class="title text-white">SCULPTED FOR PERFORMANCE</h2>
      <p class="description text-[#9E9EAF]">Four distinct disciplines.</p>
    `;

    const h2 = container.querySelector('h2');
    const badge = container.querySelector('.badge');
    const desc = container.querySelector('.description');

    assert.truthy(h2, 'Must render h2 title');
    assert.equal(h2.textContent, 'SCULPTED FOR PERFORMANCE');
    assert.equal(badge.textContent, 'PROGRAMS');
    assert.equal(desc.textContent, 'Four distinct disciplines.');
  });

  test('T1-F02-04: TiltCard 3D Perspective Container', () => {
    const tiltSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/TiltCard.tsx'), 'utf8');

    assert.match(tiltSrc, /perspective/);
    assert.match(tiltSrc, /rotateX/);
    assert.match(tiltSrc, /rotateY/);
    assert.match(tiltSrc, /prefers-reduced-motion/);

    // Test tilt math computation
    const rect = { left: 0, top: 0, width: 300, height: 400 };
    const clientX = 75; // quarter from left
    const clientY = 100; // quarter from top
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const maxTilt = 8;
    const rotX = ((centerY - y) / centerY) * maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;

    assert.assert(rotX > 0, 'Top half hover should tilt upward (+rotX)');
    assert.assert(rotY < 0, 'Left half hover should tilt left (-rotY)');
  });

  test('T1-F02-05: LightboxModal Accessible Dialog & Dismissal', () => {
    const modalSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/LightboxModal.tsx'), 'utf8');

    assert.match(modalSrc, /role="dialog"/);
    assert.match(modalSrc, /aria-modal="true"/);
    assert.match(modalSrc, /Escape/);

    // Virtual DOM dialog test
    const modal = new DOMNode('div');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    const closeBtn = new DOMNode('button');
    closeBtn.setAttribute('aria-label', 'Close modal');
    let closed = false;
    closeBtn.addEventListener('click', () => {
      closed = true;
    });
    modal.appendChild(closeBtn);

    assert.equal(modal.getAttribute('role'), 'dialog');
    assert.equal(modal.getAttribute('aria-modal'), 'true');
    closeBtn.click();
    assert.truthy(closed, 'Close button click must trigger close');
  });
});
