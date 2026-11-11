const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 1 - Feature 19: Production Build & Lint Verification', () => {
  test('T1-F19-01: Next.js 15 Production Build Configuration', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

    assert.equal(pkg.scripts.build, 'next build');
    assert.truthy(pkg.dependencies.next);
  });

  test('T1-F19-02: Strict TypeScript Type Checking Configuration', () => {
    const tsconfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'tsconfig.json'), 'utf8'));

    assert.equal(tsconfig.compilerOptions.strict, true);
    assert.equal(tsconfig.compilerOptions.noEmit, true);
  });

  test('T1-F19-03: ESLint Static Analysis Configuration', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

    assert.equal(pkg.scripts.lint, 'next lint');
  });

  test('T1-F19-04: App Router Client Directive Compliance', () => {
    const clientFiles = [
      'src/components/forms/ContactForm.tsx',
      'src/components/forms/WhatsAppButton.tsx',
      'src/components/navigation/Navbar.tsx',
      'src/components/navigation/MobileDrawer.tsx',
      'src/components/ui/TiltCard.tsx',
      'src/components/ui/LightboxModal.tsx',
    ];

    for (const relPath of clientFiles) {
      const content = fs.readFileSync(path.join(process.cwd(), relPath), 'utf8');
      assert.assert(
        content.startsWith("'use client'") || content.startsWith('"use client"'),
        `File ${relPath} must begin with 'use client' directive`
      );
    }
  });

  test('T1-F19-05: Tailwind CSS v4 Theme Token Compilation', () => {
    const globalsCss = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

    assert.includes(globalsCss, '@theme');
    assert.includes(globalsCss, '--color-iron-black: #000000;');
    assert.includes(globalsCss, '--color-iron-violet: #7D39EB;');
    assert.includes(globalsCss, '--color-iron-lime: #C6FF33;');
    assert.includes(globalsCss, '--color-iron-white: #FFFFFF;');
  });
});
