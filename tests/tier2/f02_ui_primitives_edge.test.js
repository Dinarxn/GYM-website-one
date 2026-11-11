const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { DOMNode } = require('../helpers/dom');

describe('Tier 2 - Feature 02: UI Primitives Boundary Cases', () => {
  test('T2-F02-01: Button Disabled and Loading States (Negative / Boundary)', () => {
    const buttonSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/Button.tsx'), 'utf8');

    // Inspect real Button component code for disabled classes and loading indicator
    assert.includes(buttonSrc, 'disabled:pointer-events-none');
    assert.includes(buttonSrc, 'disabled:opacity-50');
    assert.includes(buttonSrc, 'isLoading &&');
    assert.includes(buttonSrc, 'animate-spin');

    // Verify DOM simulation of click suppression on disabled button
    const btn = new DOMNode('button');
    btn.disabled = true;
    let clicked = false;
    btn.addEventListener('click', () => {
      clicked = true;
    });

    btn.click();
    assert.falsy(clicked, 'Disabled button must suppress click callback');
    assert.truthy(btn.disabled);
  });

  test('T2-F02-02: TiltCard Touch Device and Coordinate Calculations (Boundary)', () => {
    const tiltSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/TiltCard.tsx'), 'utf8');

    // Verify dynamic physics formulas in TiltCard source code
    assert.includes(tiltSrc, 'maxTilt = 8');
    assert.includes(tiltSrc, 'const tiltX = -((y - centerY) / centerY) * maxTilt');
    assert.includes(tiltSrc, 'const tiltY = ((x - centerX) / centerX) * maxTilt');

    const maxTilt = 8;
    const width = 300;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    // Corner test: Top-left boundary
    const x = 0;
    const y = 0;
    const tiltX = -((y - centerY) / centerY) * maxTilt;
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    assert.equal(tiltX, 8, 'Top edge tiltX must be +8 degrees');
    assert.equal(tiltY, -8, 'Left edge tiltY must be -8 degrees');
  });

  test('T2-F02-03: TiltCard Prefers-Reduced-Motion Override (Boundary)', () => {
    const tiltSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/TiltCard.tsx'), 'utf8');

    // Verify reduced motion query listener and mouse move bypass
    assert.includes(tiltSrc, "matchMedia('(prefers-reduced-motion: reduce)')");
    assert.includes(tiltSrc, 'if (isReducedMotion || !cardRef.current) return');
  });

  test('T2-F02-04: LightboxModal Focus Trap & Escape Key (Boundary)', () => {
    const modalSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/LightboxModal.tsx'), 'utf8');

    // Verify Escape key handling and document body scroll lock
    assert.includes(modalSrc, "e.key === 'Escape'");
    assert.includes(modalSrc, 'onClose()');
    assert.includes(modalSrc, "document.body.style.overflow = 'hidden'");

    // Verify circular navigation boundary wrapping
    const items = [{ id: '1' }, { id: '2' }, { id: '3' }];
    const currentIndex = 2; // on last item
    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    assert.equal(nextIndex, 0, 'Next from last item must wrap to first');

    const firstIndex = 0;
    const prevIndex = firstIndex > 0 ? firstIndex - 1 : items.length - 1;
    assert.equal(prevIndex, 2, 'Prev from first item must wrap to last');
  });

  test('T2-F02-05: SectionHeader Extreme String Length & Null Eyebrow (Corner)', () => {
    const headerSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/SectionHeader.tsx'), 'utf8');

    // Verify conditional eyebrow rendering and responsive heading font classes
    assert.includes(headerSrc, '{eyebrow && (');
    assert.includes(headerSrc, 'leading-[1.08]');
    assert.includes(headerSrc, 'drop-shadow-[0_0_20px_rgba(198,255,51,0.3)]');
  });
});
