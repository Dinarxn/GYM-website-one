const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { CameraNarrativeEvaluator, CAMERA_WAYPOINTS } = require('../helpers/scroll');

describe('Tier 2 - Feature 17: Accessibility & Motion Boundary Cases', () => {
  test('T2-17-01: Accessible Skip-to-Content Link Landmark Contract (Boundary)', () => {
    const layoutSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');

    // Verify skip to main content accessible link and main landmark target
    assert.includes(layoutSrc, 'href="#main-content"');
    assert.includes(layoutSrc, 'sr-only focus:not-sr-only');
    assert.includes(layoutSrc, 'bg-[#C6FF33] text-black');
    assert.includes(layoutSrc, '<main id="main-content"');
  });

  test('T2-17-02: Global Accessible Focus Ring Theme Tokens in CSS (Boundary)', () => {
    const cssSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

    // Verify global :focus-visible rules with high contrast neon lime outline
    assert.includes(cssSrc, ':focus-visible {');
    assert.includes(cssSrc, 'outline: 2px solid #C6FF33;');
    assert.includes(cssSrc, 'outline-offset: 3px;');
  });

  test('T2-17-03: Navigation Links Complete Landmark Anchor Sequence (Corner)', () => {
    const navLinksSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/navigation/NavLinks.tsx'),
      'utf8'
    );

    // Verify all 7 section anchors defined in NAV_LINKS
    const expectedAnchors = [
      '#programs',
      '#about',
      '#trainers',
      '#equipment',
      '#membership',
      '#gallery',
      '#contact',
    ];

    for (const anchor of expectedAnchors) {
      assert.includes(navLinksSrc, `href: '${anchor}'`);
    }

    assert.includes(navLinksSrc, 'focus-visible:ring-2 focus-visible:ring-[#C6FF33]');
  });

  test('T2-17-04: Reduced Motion Camera Lock Contract in Evaluator (Boundary)', () => {
    // Genuinely test the CameraNarrativeEvaluator reduced-motion static lock
    const evaluator = new CameraNarrativeEvaluator(CAMERA_WAYPOINTS, { reducedMotion: true });

    const samples = [0.0, 0.25, 0.5, 0.75, 1.0];
    for (const p of samples) {
      const state = evaluator.evaluate(p);
      assert.deepEqual(state.position, [0.0, 2.2, 8.0], `Position must be locked at p=${p}`);
      assert.deepEqual(state.target, [0.0, 1.8, 0.0], `Target must be locked at p=${p}`);
    }
  });

  test('T2-17-05: Modal Dialog Accessibility Roles & Escape Key in Source (Edge Case)', () => {
    const drawerSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/navigation/MobileDrawer.tsx'),
      'utf8'
    );
    const modalSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/ui/LightboxModal.tsx'),
      'utf8'
    );

    // Verify WAI-ARIA dialog attributes and Escape key handling
    assert.includes(drawerSrc, 'role="dialog"');
    assert.includes(drawerSrc, 'aria-modal="true"');
    assert.includes(drawerSrc, "e.key === 'Escape'");

    assert.includes(modalSrc, "e.key === 'Escape'");
    assert.includes(modalSrc, "document.body.style.overflow = 'hidden'");
  });
});
