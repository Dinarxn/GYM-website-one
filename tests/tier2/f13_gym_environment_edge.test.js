const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 2 - Feature 13: Dark Industrial Gym Environment Boundary Cases', () => {
  test('T2-13-01: Dark Industrial Elevation Color Tokens in Theme (Boundary)', () => {
    const cssSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

    // Verify deep obsidian and industrial dark elevations in application theme
    assert.includes(cssSrc, '--color-iron-black: #000000;');
    assert.includes(cssSrc, '--color-iron-dark: #070709;');
    assert.includes(cssSrc, '--color-iron-surface: #0E0E14;');
    assert.includes(cssSrc, '--color-iron-card: #12121A;');
    assert.includes(cssSrc, '--color-iron-border: #1F1F2E;');
  });

  test('T2-13-02: Neon Accent Colors & Glow Opacity Constants (Boundary)', () => {
    const cssSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

    // Verify exact violet and lime neon tokens and atmospheric glow alphas
    assert.includes(cssSrc, '--color-iron-violet: #7D39EB;');
    assert.includes(cssSrc, '--color-iron-lime: #C6FF33;');
    assert.includes(cssSrc, '--color-iron-violet-glow: rgba(125, 57, 235, 0.35);');
    assert.includes(cssSrc, '--color-iron-lime-glow: rgba(198, 255, 51, 0.35);');
  });

  test('T2-13-03: Persistent Canvas Mount Layering & Viewport Overflow Rules (Boundary)', () => {
    const layoutSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');
    const cssSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

    // Canvas container must be fixed behind main content (z-0) with zero pointer event interference
    assert.includes(layoutSrc, 'id="canvas-container"');
    assert.includes(layoutSrc, 'fixed inset-0 pointer-events-none z-0 overflow-hidden');
    assert.includes(layoutSrc, '<main id="main-content" className="relative z-10');

    // Overflow clipping on root
    assert.includes(cssSrc, 'html {');
    assert.includes(cssSrc, 'overflow-x: clip;');
  });

  test('T2-13-04: Typography Scale & High-Performance Sans Font Stack (Edge Case)', () => {
    const cssSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

    // Verify robust fallback sans font stack
    assert.includes(cssSrc, "--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont");
    assert.includes(cssSrc, '-webkit-font-smoothing: antialiased;');
  });

  test('T2-13-05: Brand Theme Color Palette Lockdown in Application Config (Corner)', () => {
    const siteConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/site.ts'), 'utf8');

    // Verify BRAND_COLORS exported as const with exact 4 colors
    assert.includes(siteConfigSrc, "export const BRAND_COLORS = {");
    assert.includes(siteConfigSrc, "black: '#000000'");
    assert.includes(siteConfigSrc, "violet: '#7D39EB'");
    assert.includes(siteConfigSrc, "lime: '#C6FF33'");
    assert.includes(siteConfigSrc, "white: '#FFFFFF'");
    assert.includes(siteConfigSrc, "} as const;");
  });
});
