const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { CameraNarrativeEvaluator } = require('../helpers/scroll');

describe('Tier 2 - Feature 14: 3D Athletic Hero Figure Boundary Cases', () => {
  test('T2-14-01: Initial Hero Camera Vantage Point Continuity (Boundary)', () => {
    const evaluator = new CameraNarrativeEvaluator();

    // Verify initial camera evaluate at p=0.0 matches exact spatial waypoint
    const initial = evaluator.evaluate(0.0);
    assert.deepEqual(initial.position, [0.0, 2.2, 7.5], 'Initial position must be [0, 2.2, 7.5]');
    assert.deepEqual(initial.target, [0.0, 1.8, 0.0], 'Initial focal target must be [0, 1.8, 0]');
    assert.equal(initial.waypointId, 'beginning');
  });

  test('T2-14-02: HeroOverlay Responsive Padding & Viewport Constraints (Boundary)', () => {
    const heroSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/HeroOverlay.tsx'),
      'utf8'
    );

    // Verify dynamic viewport height and responsive padding classes
    assert.includes(heroSrc, 'min-h-[100dvh]');
    assert.includes(heroSrc, 'pt-28 sm:pt-36 pb-12 sm:pb-16');
    assert.includes(heroSrc, 'px-4 sm:px-6 lg:px-8');
  });

  test('T2-14-03: Atmospheric Radial Glow Backdrop Layering (Edge Case)', () => {
    const heroSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/HeroOverlay.tsx'),
      'utf8'
    );

    // Verify deep atmospheric glow blur and pointer-events-none styling
    assert.includes(heroSrc, 'bg-[#7D39EB]/15');
    assert.includes(heroSrc, 'blur-[120px]');
    assert.includes(heroSrc, 'pointer-events-none');
    assert.includes(heroSrc, '-z-10');
  });

  test('T2-14-04: Call-to-Action Dual Button Responsiveness (Corner)', () => {
    const heroSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/HeroOverlay.tsx'),
      'utf8'
    );

    // Verify mobile column stacking and desktop row alignment for CTAs
    assert.includes(heroSrc, 'flex flex-col sm:flex-row items-center justify-center gap-4');
    assert.includes(heroSrc, 'w-full sm:w-auto');
  });

  test('T2-14-05: Accessible Section Semantics and Skip-To-Content Link (Boundary)', () => {
    const layoutSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');
    const heroSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/HeroOverlay.tsx'),
      'utf8'
    );

    // Verify accessible skip link in layout and hero section landmark
    assert.includes(layoutSrc, 'href="#main-content"');
    assert.includes(layoutSrc, 'Skip to main content');
    assert.includes(heroSrc, 'id="hero"');
    assert.includes(heroSrc, 'aria-label="Welcome to IRONFORGE FITNESS"');
  });
});
