const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 1 - Feature 01: Framework Scaffolding & Design Tokens', () => {
  test('T1-F01-01: Exact 4-Color Brand Theme Tokens', () => {
    const siteConfigPath = path.join(process.cwd(), 'src/config/site.ts');
    const content = fs.readFileSync(siteConfigPath, 'utf8');

    // Verify BRAND_COLORS constant
    assert.match(content, /black:\s*'#000000'/i);
    assert.match(content, /violet:\s*'#7D39EB'/i);
    assert.match(content, /lime:\s*'#C6FF33'/i);
    assert.match(content, /white:\s*'#FFFFFF'/i);

    // Verify globals.css @theme definitions
    const cssPath = path.join(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    assert.match(cssContent, /--color-iron-black:\s*#000000;/i);
    assert.match(cssContent, /--color-iron-violet:\s*#7D39EB;/i);
    assert.match(cssContent, /--color-iron-lime:\s*#C6FF33;/i);
    assert.match(cssContent, /--color-iron-white:\s*#FFFFFF;/i);
  });

  test('T1-F01-02: WCAG AAA Contrast Ratios on Deep Obsidian', () => {
    // Relative luminance formula: L = 0.2126*R + 0.7152*G + 0.0722*B
    function getLuminance(hex) {
      const rgb = [
        parseInt(hex.slice(1, 3), 16) / 255,
        parseInt(hex.slice(3, 5), 16) / 255,
        parseInt(hex.slice(5, 7), 16) / 255,
      ].map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    }

    const lumBlack = getLuminance('#000000');
    const lumLime = getLuminance('#C6FF33');
    const lumWhite = getLuminance('#FFFFFF');

    const contrastLime = (lumLime + 0.05) / (lumBlack + 0.05);
    const contrastWhite = (lumWhite + 0.05) / (lumBlack + 0.05);

    assert.assert(contrastLime >= 15.0, `Lime contrast ${contrastLime} must be >= 15.0 (WCAG AAA requires 7.0)`);
    assert.assert(contrastWhite >= 20.0, `White contrast ${contrastWhite} must be >= 20.0 (maximum 21:1)`);
  });

  test('T1-F01-03: SiteConfig Object Interface Integrity', () => {
    const siteConfigPath = path.join(process.cwd(), 'src/config/site.ts');
    const content = fs.readFileSync(siteConfigPath, 'utf8');

    assert.match(content, /name:\s*'IRONFORGE FITNESS'/);
    assert.match(content, /phone:\s*'\+1 \(800\) 476-6367'/);
    assert.match(content, /email:\s*'inquiries@ironforgefitness\.com'/);
    assert.match(content, /whatsappNumber:\s*'\+18004766367'/);
    assert.match(content, /demoMode:\s*true/);
  });

  test('T1-F01-04: Framework Dependency Verification', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

    assert.assert(pkg.dependencies.next, 'Next.js dependency must be present');
    assert.match(pkg.dependencies.next, /\^?15\./);
    assert.match(pkg.dependencies.react, /\^?19\./);
    assert.match(pkg.dependencies['react-dom'], /\^?19\./);
    assert.match(pkg.dependencies.tailwindcss, /\^?4\./);
    assert.assert(pkg.devDependencies.typescript, 'TypeScript must be in devDependencies');
  });

  test('T1-F01-05: Root Layout Document Meta & Viewport', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf8');

    assert.match(content, /title:\s*['"]IRONFORGE FITNESS/);
    assert.match(content, /themeColor:\s*['"]#000000['"]/);
    assert.match(content, /width:\s*['"]device-width['"]/);
    assert.match(content, /initialScale:\s*1/);
  });
});
