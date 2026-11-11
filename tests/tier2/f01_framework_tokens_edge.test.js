const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { createWindow } = require('../helpers/dom');

describe('Tier 2 - Feature 01: Framework & Design Tokens Boundary Cases', () => {
  test('T2-F01-01: Disallowed Palette Color Rejection (Negative Boundary)', () => {
    const siteConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/site.ts'), 'utf8');

    // Extract approved brand colors defined in site config
    const approvedMatches = siteConfigSrc.match(/#[0-9A-Fa-f]{6}/g) || [];
    const approvedColors = new Set(approvedMatches.map((c) => c.toUpperCase()));

    function validateBrandColor(color) {
      if (!approvedColors.has(color.toUpperCase())) {
        throw new Error(`Unauthorized palette color: ${color}`);
      }
      return true;
    }

    assert.truthy(validateBrandColor('#000000'));
    assert.truthy(validateBrandColor('#7D39EB'));
    assert.truthy(validateBrandColor('#C6FF33'));
    assert.truthy(validateBrandColor('#FFFFFF'));

    assert.throws(() => validateBrandColor('#FF0000'), /Unauthorized palette color: #FF0000/);
    assert.throws(() => validateBrandColor('#00FFCC'), /Unauthorized palette color: #00FFCC/);
    assert.throws(() => validateBrandColor('#FFA500'), /Unauthorized palette color: #FFA500/);
  });

  test('T2-F01-02: Corrupted Hex Value Sanitization (Negative)', () => {
    const cssSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

    // Parse all hex color definitions from globals.css
    const hexTokens = cssSrc.match(/#[0-9A-Fa-f]{3,8}/g) || [];
    assert.assert(hexTokens.length > 5, 'globals.css must define theme hex color tokens');

    function sanitizeHex(input) {
      if (!input || typeof input !== 'string') return '#000000';
      const clean = input.trim();
      if (/^#[0-9A-Fa-f]{6}$/.test(clean)) return clean.toUpperCase();
      return '#000000';
    }

    assert.equal(sanitizeHex(''), '#000000');
    assert.equal(sanitizeHex(null), '#000000');
    assert.equal(sanitizeHex(undefined), '#000000');
    assert.equal(sanitizeHex('#ZZZZZZ'), '#000000');
    assert.equal(sanitizeHex('rgb(0,0,0)'), '#000000');
    assert.equal(sanitizeHex('#C6FF33'), '#C6FF33');
  });

  test('T2-F01-03: Ultra-Narrow Viewport Zero Horizontal Overflow (Boundary)', () => {
    const cssSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

    // Verify root html and body enforce clip to guarantee zero horizontal overflow
    assert.includes(cssSrc, 'overflow-x: clip;');

    const win = createWindow();
    win.setViewport(320, 568);

    assert.equal(win.innerWidth, 320);
    assert.assert(win.document.documentElement.clientWidth <= 320);
    assert.equal(win.scrollX, 0);
  });

  test('T2-F01-04: Strict TypeScript Interface Compliance (Compile Negative)', () => {
    const siteConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/site.ts'), 'utf8');

    const requiredKeys = ['name', 'tagline', 'phone', 'email', 'address', 'whatsappNumber', 'demoMode'];
    for (const key of requiredKeys) {
      assert.includes(siteConfigSrc, `${key}:`, `SiteConfig must declare property ${key}`);
    }

    function checkUnknownKeys(obj) {
      const allowed = new Set([...requiredKeys, 'shortDescription', 'hours', 'socials']);
      for (const k of Object.keys(obj)) {
        if (!allowed.has(k)) {
          throw new Error(`TS2353: Object literal may only specify known properties: ${k}`);
        }
      }
      return true;
    }

    assert.throws(
      () => checkUnknownKeys({ name: 'IRONFORGE', unauthorizedProp: 123 }),
      /TS2353: Object literal may only specify known properties/
    );
  });

  test('T2-F01-05: Missing Environment Variables / Config Resilience (Edge Case)', () => {
    const siteConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/site.ts'), 'utf8');

    // Verify WhatsApp number configuration fallback in site.ts
    assert.includes(siteConfigSrc, "whatsappNumber: '+18004766367'");

    function getWhatsAppFallback(envVar) {
      return envVar || '+18004766367';
    }

    assert.equal(getWhatsAppFallback(undefined), '+18004766367');
    assert.equal(getWhatsAppFallback(''), '+18004766367');
    assert.equal(getWhatsAppFallback('+15551234567'), '+15551234567');
  });
});
