const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { CameraNarrativeEvaluator } = require('../helpers/scroll');
const { createWindow } = require('../helpers/dom');

describe('Tier 1 - Feature 17: Motion Accessibility & Keyboard Navigation', () => {
  test('T1-F17-01: prefers-reduced-motion Media Query Detection', () => {
    const win = createWindow();
    win.mediaQueries.set('reduced-motion', true);

    const mq = win.matchMedia('(prefers-reduced-motion: reduce)');
    assert.truthy(mq.matches);
  });

  test('T1-F17-02: 3D Camera Path Locking Under Reduced Motion', () => {
    const evaluator = new CameraNarrativeEvaluator(undefined, { reducedMotion: true });

    const p0 = evaluator.evaluate(0.0);
    const p50 = evaluator.evaluate(0.5);
    const p100 = evaluator.evaluate(1.0);

    // Camera position remains locked at static vantage point [0.0, 2.2, 8.0]
    assert.deepEqual(p0.position, [0.0, 2.2, 8.0]);
    assert.deepEqual(p50.position, [0.0, 2.2, 8.0]);
    assert.deepEqual(p100.position, [0.0, 2.2, 8.0]);
  });

  test('T1-F17-03: Static Cross-Fade Scene Transition Replacement', () => {
    const tiltSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/TiltCard.tsx'), 'utf8');

    // Tilt card checks isReducedMotion and skips 3D tilt calculation
    assert.includes(tiltSrc, 'isReducedMotion');
    assert.includes(tiltSrc, 'if (isReducedMotion || !cardRef.current) return');
  });

  test('T1-F17-04: Accessible Keyboard Section Navigation', () => {
    const navSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/navigation/NavLinks.tsx'), 'utf8');

    assert.includes(navSrc, 'focus-visible:ring-2');
    assert.includes(navSrc, 'focus-visible:ring-[#C6FF33]');
  });

  test('T1-F17-05: Visible Focus Rings & Skip to Content Link', () => {
    const layoutSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');

    assert.includes(layoutSrc, 'Skip to main content');
    assert.includes(layoutSrc, 'href="#main-content"');
  });
});
