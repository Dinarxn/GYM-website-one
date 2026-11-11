const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 2 - Feature 19: Production Build & Lint Boundary Cases', () => {
  test('T2-19-01: Strict TypeScript Configuration & Path Alias Mapping (Boundary)', () => {
    const tsconfigSrc = fs.readFileSync(path.join(process.cwd(), 'tsconfig.json'), 'utf8');
    const tsconfig = JSON.parse(tsconfigSrc);

    // Verify strict mode, modern ES2022 target, and @/* path alias
    assert.equal(tsconfig.compilerOptions.strict, true, 'TypeScript strict mode must be enabled');
    assert.equal(tsconfig.compilerOptions.noEmit, true, 'TypeScript noEmit must be enabled');
    assert.equal(tsconfig.compilerOptions.target, 'ES2022');
    assert.truthy(tsconfig.compilerOptions.paths['@/*']);
  });

  test('T2-19-02: Next.js 15 & React 19 Dependency Alignment in package.json (Boundary)', () => {
    const pkgSrc = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8');
    const pkg = JSON.parse(pkgSrc);

    // Verify core Next.js 15 and React 19 versions and npm build scripts
    assert.truthy(pkg.dependencies.next.includes('15.'));
    assert.truthy(pkg.dependencies.react.includes('19.'));
    assert.equal(pkg.scripts.build, 'next build');
    assert.equal(pkg.scripts['type-check'], 'tsc --noEmit');
  });

  test('T2-19-03: Transpile Packages & React Strict Mode in next.config.ts (Edge Case)', () => {
    const nextConfigSrc = fs.readFileSync(path.join(process.cwd(), 'next.config.ts'), 'utf8');

    // Verify React strict mode and transpilePackages for 3D dependencies
    assert.includes(nextConfigSrc, 'reactStrictMode: true');
    assert.includes(nextConfigSrc, "'three'");
    assert.includes(nextConfigSrc, "'@react-three/fiber'");
    assert.includes(nextConfigSrc, "'gsap'");
  });

  test('T2-19-04: Client Directive Compliance Across Interactive Components (Corner)', () => {
    const interactiveFiles = [
      'src/components/sections/HeroOverlay.tsx',
      'src/components/navigation/Navbar.tsx',
      'src/components/navigation/MobileDrawer.tsx',
      'src/components/forms/ContactForm.tsx',
      'src/components/sections/MembershipSection.tsx',
    ];

    for (const relPath of interactiveFiles) {
      const src = fs.readFileSync(path.join(process.cwd(), relPath), 'utf8');
      assert.truthy(
        src.trimStart().startsWith("'use client'") || src.trimStart().startsWith('"use client"'),
        `Component ${relPath} must begin with 'use client' directive`
      );
    }
  });

  test('T2-19-05: Production Environment & Demo Mode Configuration Security (Boundary)', () => {
    const siteConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/site.ts'), 'utf8');

    // Verify demoMode flag is explicitly declared in site config
    assert.includes(siteConfigSrc, 'demoMode: true');

    // Ensure no private secrets or database credentials leaked into client-side site config
    assert.falsy(siteConfigSrc.includes('DATABASE_URL'));
    assert.falsy(siteConfigSrc.includes('SECRET_KEY'));
    assert.falsy(siteConfigSrc.includes('PRIVATE_KEY'));
  });
});
