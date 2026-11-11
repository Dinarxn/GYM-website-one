const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { CAMERA_WAYPOINTS } = require('../helpers/scroll');

describe('Tier 1 - Feature 14: 3D Athletic Hero Figure & Reveal', () => {
  test('T1-F14-01: Initial Hero Camera Waypoint & Stance Orientation', () => {
    // Verify initial camera waypoint coordinates in the camera narrative evaluator
    const initialWaypoint = CAMERA_WAYPOINTS.find((w) => w.id === 'beginning');
    assert.truthy(initialWaypoint, 'Initial waypoint "beginning" must exist');
    assert.deepEqual(initialWaypoint.position, [0.0, 2.2, 7.5], 'Initial position must be [0, 2.2, 7.5]');
    assert.deepEqual(initialWaypoint.target, [0.0, 1.8, 0.0], 'Initial focal target must be [0, 1.8, 0]');
    assert.equal(initialWaypoint.fov, 45, 'Initial FOV must be 45 degrees');
  });

  test('T1-F14-02: Brand Configuration Alignment with Hero Headline', () => {
    const siteConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/site.ts'), 'utf8');

    // Verify site configuration exports match hero narrative tagline
    assert.includes(siteConfigSrc, "name: 'IRONFORGE FITNESS'");
    assert.includes(siteConfigSrc, "tagline: 'FORGE YOUR ULTIMATE PHYSIQUE'");
  });

  test('T1-F14-03: Accessible Semantic Hero Headline & Overlay Copy', () => {
    const heroSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/HeroOverlay.tsx'), 'utf8');

    // Semantic H1 headline with brand accent styling
    assert.includes(heroSrc, '<h1');
    assert.includes(heroSrc, 'FORGE YOUR');
    assert.includes(heroSrc, 'ULTIMATE');
    assert.includes(heroSrc, 'PHYSIQUE');
  });

  test('T1-F14-04: Hero Performance Metrics & Competition Iron Badges', () => {
    const heroSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/HeroOverlay.tsx'), 'utf8');

    // High-impact athletic compound metrics
    assert.includes(heroSrc, "value: '15,000'");
    assert.includes(heroSrc, "unit: 'SQ FT'");
    assert.includes(heroSrc, "unit: 'IPF'");
    assert.includes(heroSrc, "unit: 'ACCESS'");
    assert.includes(heroSrc, 'CALIBRATED IRON PLATFORMS');
  });

  test('T1-F14-05: Action Buttons & Accessible Scroll Cue', () => {
    const heroSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/HeroOverlay.tsx'), 'utf8');

    // Primary CTA and accessible scroll navigation
    assert.includes(heroSrc, 'href="#contact"');
    assert.includes(heroSrc, 'Claim Free Trial');
    assert.includes(heroSrc, 'href="#programs"');
    assert.includes(heroSrc, 'aria-label="Scroll to Programs section"');
  });
});
