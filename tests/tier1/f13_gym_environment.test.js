const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 1 - Feature 13: Dark Industrial Gym Environment & Lighting', () => {
  test('T1-F13-01: Exact 4-Color Brand Lighting Palette Verification', () => {
    const siteConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/site.ts'), 'utf8');

    // Verify 4-color brand constants defined in application configuration
    assert.includes(siteConfigSrc, "black: '#000000'");
    assert.includes(siteConfigSrc, "violet: '#7D39EB'");
    assert.includes(siteConfigSrc, "lime: '#C6FF33'");
    assert.includes(siteConfigSrc, "white: '#FFFFFF'");
  });

  test('T1-F13-02: Dark Industrial Atmosphere & Design Tokens', () => {
    const cssSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

    // Verify dark industrial color elevation tokens in application global theme
    assert.includes(cssSrc, '--color-iron-black: #000000;');
    assert.includes(cssSrc, '--color-iron-dark: #070709;');
    assert.includes(cssSrc, '--color-iron-surface: #0E0E14;');
    assert.includes(cssSrc, '--color-iron-violet: #7D39EB;');
    assert.includes(cssSrc, '--color-iron-lime: #C6FF33;');
    assert.includes(cssSrc, 'color-scheme: dark;');
  });

  test('T1-F13-03: Persistent Canvas Mount Container in RootLayout', () => {
    const layoutSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');

    // Verify canvas mounting container with zero-pointer-event background layering
    assert.includes(layoutSrc, 'id="canvas-container"');
    assert.includes(layoutSrc, 'fixed inset-0 pointer-events-none z-0');
    assert.includes(layoutSrc, 'aria-hidden="true"');
    assert.includes(layoutSrc, 'overflow-hidden');
  });

  test('T1-F13-04: Neon Glow Utility Classes and Accent Gradients', () => {
    const cssSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

    // Verify neon glow and border gradient utility classes
    assert.includes(cssSrc, '.glow-lime');
    assert.includes(cssSrc, 'rgba(198, 255, 51, 0.25)');
    assert.includes(cssSrc, '.glow-violet');
    assert.includes(cssSrc, 'rgba(125, 57, 235, 0.3)');
    assert.includes(cssSrc, '.border-gradient-violet');
    assert.includes(cssSrc, '.border-gradient-lime');
  });

  test('T1-F13-05: Dark Industrial Scrollbar & Selection Styling', () => {
    const cssSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

    // Verify atmospheric custom scrollbar and selection highlight
    assert.includes(cssSrc, '::selection');
    assert.includes(cssSrc, 'background-color: #7D39EB');
    assert.includes(cssSrc, '::-webkit-scrollbar-thumb');
    assert.includes(cssSrc, ':focus-visible');
    assert.includes(cssSrc, 'outline: 2px solid #C6FF33');
  });
});
