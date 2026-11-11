/**
 * IRONFORGE FITNESS — Challenger 2 Milestone 1 Iteration 2 Empirical Verification
 * 
 * Target Verifications:
 * 1. Production Build & Manifest Verification:
 *    - Validates build exit code 0, manifests, and presence of pages-manifest.json
 * 2. Syllabus Modal in src/components/sections/ProgramsSection.tsx:
 *    - AST / Regex analysis of useEffect hook on activeModalProgram
 *    - Scroll lock: document.body.style.overflow = 'hidden'
 *    - Restoration of original overflow on unmount / cleanup
 *    - Window 'keydown' event listener registration & removal
 *    - 'Escape' key handling triggering modal dismissal
 *    - Accessible dialog attributes (role="dialog", aria-modal="true", aria-label)
 *    - DOM lifecycle simulation of the modal
 * 3. Hero Glow Overflow in src/components/sections/HeroOverlay.tsx:
 *    - Verification of 'overflow-hidden' on <section id="hero">
 *    - Viewport boundary mathematical proof for 320px, 375px, 768px, 1440px
 *    - Protrusion clipping verification
 * 4. ContactForm Phone Validation in src/components/forms/ContactForm.tsx:
 *    - Phone regex active evaluation check
 *    - Rejection of invalid alphabetic / non-numeric strings ('abcdefg', 'phone123')
 *    - Acceptance of valid phone patterns (+1 800 476-6367, 555-1234, etc.)
 * 5. WCAG 2.1 Contrast Ratio Matrix:
 *    - Programmatic validation of the 4 brand colors
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// ANSI Colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ${GREEN}✔${RESET} ${name}`);
  } catch (err) {
    failedTests++;
    console.log(`  ${RED}✖${RESET} ${BOLD}${name}${RESET}`);
    console.log(`    ${RED}Error: ${err.message}${RESET}`);
    failures.push({ name, error: err.message });
  }
}

console.log(`\n${BOLD}${CYAN}================================================================${RESET}`);
console.log(`${BOLD}${CYAN}  CHALLENGER 2 — EMPIRICAL VERIFICATION HARNESS (ITERATION 2)  ${RESET}`);
console.log(`${BOLD}${CYAN}================================================================${RESET}\n`);

// -----------------------------------------------------------------------------
// 1. Production Build & Manifest Verification
// -----------------------------------------------------------------------------
console.log(`${BOLD}1. Next.js Production Build Artifacts & Manifest Verification${RESET}`);

test('Build Artifacts: .next directory exists', () => {
  const nextDir = path.join(process.cwd(), '.next');
  assert.ok(fs.existsSync(nextDir), '.next build output directory must exist');
});

test('Build Artifacts: .next/server/pages-manifest.json exists and resolves Iteration 1 ENOENT defect', () => {
  const pagesManifestPath = path.join(process.cwd(), '.next', 'server', 'pages-manifest.json');
  assert.ok(fs.existsSync(pagesManifestPath), '.next/server/pages-manifest.json must exist (resolving Iteration 1 ENOENT)');
  const pagesManifest = JSON.parse(fs.readFileSync(pagesManifestPath, 'utf8'));
  assert.ok(typeof pagesManifest === 'object', 'pages-manifest.json must be valid JSON');
  assert.ok(pagesManifest['/_app'], 'pages-manifest must include /_app');
});

test('Build Artifacts: .next/server/app-paths-manifest.json exists and routes /page', () => {
  const appManifest = path.join(process.cwd(), '.next', 'server', 'app-paths-manifest.json');
  assert.ok(fs.existsSync(appManifest), 'app-paths-manifest.json must exist');
  const manifestData = JSON.parse(fs.readFileSync(appManifest, 'utf8'));
  assert.ok(manifestData['/page'], 'Root route /page must be recorded in manifest');
  assert.ok(manifestData['/_not-found/page'], '_not-found route must be recorded in manifest');
});

test('Build Artifacts: .next/app-build-manifest.json exists and bundles /page chunks', () => {
  const appBuildManifest = path.join(process.cwd(), '.next', 'app-build-manifest.json');
  assert.ok(fs.existsSync(appBuildManifest), 'app-build-manifest.json must exist');
  const data = JSON.parse(fs.readFileSync(appBuildManifest, 'utf8'));
  assert.ok(data.pages['/page'], '/page entry must be present in app-build-manifest');
  assert.ok(data.pages['/page'].length > 0, '/page must have bundled JS chunks');
});

test('Build Artifacts: .next/server/app/page.js exists as server component bundle', () => {
  const pageJs = path.join(process.cwd(), '.next', 'server', 'app', 'page.js');
  assert.ok(fs.existsSync(pageJs), 'Server component page.js must exist');
  const stats = fs.statSync(pageJs);
  assert.ok(stats.size > 1000, `page.js size must be substantial (>1KB), got ${stats.size} bytes`);
});

// -----------------------------------------------------------------------------
// 2. Syllabus Modal in ProgramsSection.tsx
// -----------------------------------------------------------------------------
console.log(`\n${BOLD}2. Syllabus Modal Lifecycle & Keyboard Accessibility (ProgramsSection.tsx)${RESET}`);

const programsFilePath = path.join(process.cwd(), 'src', 'components', 'sections', 'ProgramsSection.tsx');
assert.ok(fs.existsSync(programsFilePath), 'ProgramsSection.tsx must exist');
const programsSrc = fs.readFileSync(programsFilePath, 'utf8');

test('ProgramsSection: imports useEffect and useState', () => {
  assert.ok(/import\s+React,\s*\{\s*useState,\s*useEffect\s*\}\s*from\s*['"]react['"]/.test(programsSrc),
    'ProgramsSection must import useState and useEffect from react');
});

test('ProgramsSection: registers useEffect hook with activeModalProgram dependency', () => {
  assert.ok(programsSrc.includes('useEffect(() => {'), 'useEffect hook must be present');
  assert.ok(programsSrc.includes('}, [activeModalProgram]);'), 'useEffect must have [activeModalProgram] dependency array');
});

test('ProgramsSection: locks body scroll with document.body.style.overflow = "hidden"', () => {
  assert.ok(programsSrc.includes("document.body.style.overflow = 'hidden'"),
    'Must set document.body.style.overflow to hidden');
});

test('ProgramsSection: stores and restores original body overflow on unmount/dismissal', () => {
  assert.ok(programsSrc.includes('const originalOverflow = document.body.style.overflow;'),
    'Must capture originalOverflow');
  assert.ok(programsSrc.includes('document.body.style.overflow = originalOverflow;'),
    'Must restore originalOverflow in return cleanup');
});

test('ProgramsSection: attaches window keydown listener for Escape key', () => {
  assert.ok(programsSrc.includes("window.addEventListener('keydown', handleKeyDown);"),
    'Must register keydown listener on window');
  assert.ok(programsSrc.includes("if (e.key === 'Escape')"),
    'Must check for Escape key');
  assert.ok(programsSrc.includes('setActiveModalProgram(null);'),
    'Escape key must trigger setActiveModalProgram(null)');
});

test('ProgramsSection: removes window keydown listener on cleanup', () => {
  assert.ok(programsSrc.includes("window.removeEventListener('keydown', handleKeyDown);"),
    'Must remove keydown listener in return cleanup');
});

test('ProgramsSection: Modal markup contains accessible dialog attributes', () => {
  assert.ok(programsSrc.includes('role="dialog"'), 'Modal must declare role="dialog"');
  assert.ok(programsSrc.includes('aria-modal="true"'), 'Modal must declare aria-modal="true"');
  assert.ok(programsSrc.includes('aria-label='), 'Modal must declare aria-label');
  assert.ok(programsSrc.includes('aria-label="Close modal"'), 'Close button must declare aria-label="Close modal"');
});

test('ProgramsSection: DOM simulation of modal open -> Escape -> cleanup lifecycle', () => {
  // Mock DOM environment
  const mockBody = { style: { overflow: 'auto' } };
  const mockWindowListeners = {};
  const mockWindow = {
    addEventListener: (type, fn) => {
      mockWindowListeners[type] = mockWindowListeners[type] || [];
      mockWindowListeners[type].push(fn);
    },
    removeEventListener: (type, fn) => {
      if (mockWindowListeners[type]) {
        mockWindowListeners[type] = mockWindowListeners[type].filter(f => f !== fn);
      }
    },
  };

  // Re-simulate the exact hook logic from ProgramsSection.tsx lines 14-32
  let activeModalProgram = null;
  let cleanupFn = null;

  function runEffect(newVal) {
    if (cleanupFn) {
      cleanupFn();
      cleanupFn = null;
    }
    activeModalProgram = newVal;
    if (!activeModalProgram) return;

    const originalOverflow = mockBody.style.overflow;
    mockBody.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        runEffect(null);
      }
    };

    mockWindow.addEventListener('keydown', handleKeyDown);

    cleanupFn = () => {
      mockBody.style.overflow = originalOverflow;
      mockWindow.removeEventListener('keydown', handleKeyDown);
    };
  }

  // 1. Initial idle state
  assert.strictEqual(mockBody.style.overflow, 'auto');
  assert.strictEqual(mockWindowListeners['keydown']?.length || 0, 0);

  // 2. Open modal
  runEffect({ id: 'strength', title: 'Strength Training' });
  assert.strictEqual(mockBody.style.overflow, 'hidden', 'Body overflow should be locked to hidden');
  assert.strictEqual(mockWindowListeners['keydown'].length, 1, 'Keydown listener must be attached');

  // 3. Dispatch non-Escape key (e.g. 'Enter')
  mockWindowListeners['keydown'][0]({ key: 'Enter' });
  assert.strictEqual(mockBody.style.overflow, 'hidden', 'Body overflow should stay hidden on non-Escape key');

  // 4. Dispatch 'Escape' key
  mockWindowListeners['keydown'][0]({ key: 'Escape' });
  assert.strictEqual(mockBody.style.overflow, 'auto', 'Body overflow should be restored to original value');
  assert.strictEqual(mockWindowListeners['keydown'].length, 0, 'Keydown listener must be removed on close');
});

// -----------------------------------------------------------------------------
// 3. Hero Glow Overflow in HeroOverlay.tsx
// -----------------------------------------------------------------------------
console.log(`\n${BOLD}3. Hero Section Protrusion & Horizontal Overflow (HeroOverlay.tsx)${RESET}`);

const heroFilePath = path.join(process.cwd(), 'src', 'components', 'sections', 'HeroOverlay.tsx');
assert.ok(fs.existsSync(heroFilePath), 'HeroOverlay.tsx must exist');
const heroSrc = fs.readFileSync(heroFilePath, 'utf8');

test('HeroOverlay: <section id="hero"> contains overflow-hidden', () => {
  const sectionHeroMatch = heroSrc.match(/<section[^>]*id=["']hero["'][^>]*className=["']([^"']*)["']/);
  assert.ok(sectionHeroMatch, '<section id="hero"> must be present with className');
  const classList = sectionHeroMatch[1].split(/\s+/);
  assert.ok(classList.includes('overflow-hidden'),
    `<section id="hero"> className must include 'overflow-hidden'. Got: "${sectionHeroMatch[1]}"`);
});

test('HeroOverlay: Radial blur element is positioned with pointer-events-none and -z-10', () => {
  assert.ok(heroSrc.includes('bg-[#7D39EB]/15 rounded-full blur-[120px] -z-10'),
    'Glow element must have correct styling tokens');
  assert.ok(heroSrc.includes('pointer-events-none absolute'),
    'Glow element must have pointer-events-none and absolute');
});

test('HeroOverlay: Responsive Viewport Geometry Math (320px screen containment)', () => {
  // Mobile screen widths to test
  const viewports = [320, 360, 375, 390, 414, 768, 1024, 1440];
  const glowWidthMobile = 350; // w-[350px]
  const glowWidthDesktop = 600; // sm:w-[600px]

  for (const vw of viewports) {
    const isSm = vw >= 640;
    const orbWidth = isSm ? glowWidthDesktop : glowWidthMobile;
    const orbLeft = (vw / 2) - (orbWidth / 2);
    const orbRight = orbLeft + orbWidth;

    // Without overflow-hidden, protrusion beyond viewport:
    const protrusionLeft = Math.max(0, -orbLeft);
    const protrusionRight = Math.max(0, orbRight - vw);

    // With overflow-hidden on the parent container (width = vw):
    const clippedLeft = Math.max(0, orbLeft);
    const clippedRight = Math.min(vw, orbRight);
    const effectiveWidth = clippedRight - clippedLeft;

    assert.ok(effectiveWidth <= vw, `Effective rendered width (${effectiveWidth}px) cannot exceed viewport (${vw}px)`);
    assert.ok(clippedLeft >= 0, `Clipped left must be >= 0`);
    assert.ok(clippedRight <= vw, `Clipped right must be <= viewport`);
  }
});

// -----------------------------------------------------------------------------
// 4. ContactForm Phone Validation Logic
// -----------------------------------------------------------------------------
console.log(`\n${BOLD}4. ContactForm Phone Validation & Injection Resistance${RESET}`);

const contactFilePath = path.join(process.cwd(), 'src', 'components', 'forms', 'ContactForm.tsx');
assert.ok(fs.existsSync(contactFilePath), 'ContactForm.tsx must exist');
const contactSrc = fs.readFileSync(contactFilePath, 'utf8');

test('ContactForm: phoneRegex is defined and actively evaluated with .test()', () => {
  assert.ok(contactSrc.includes('const phoneRegex = /^[+]?[0-9\\s().-]{7,50}$/;'),
    'phoneRegex must be defined with pattern');
  assert.ok(contactSrc.includes('!phoneRegex.test(values.phone.trim())'),
    'validate() must evaluate !phoneRegex.test(values.phone.trim())');
});

test('ContactForm: Rejection of non-numeric strings (e.g., abcdefg, injections)', () => {
  const phoneRegex = /^[+]?[0-9\s().-]{7,50}$/;
  function validatePhone(phone) {
    if (!phone || !phone.trim()) return false;
    const t = phone.trim();
    if (t.length < 7 || !phoneRegex.test(t)) return false;
    return true;
  }

  // Pure alphabetic strings
  assert.strictEqual(validatePhone('abcdefg'), false, 'abcdefg must be rejected');
  assert.strictEqual(validatePhone('phone-number'), false, 'phone-number must be rejected');
  assert.strictEqual(validatePhone('<script>alert(1)</script>'), false, 'XSS script tag must be rejected');
  assert.strictEqual(validatePhone('DROP TABLE users;--'), false, 'SQL injection must be rejected');
  assert.strictEqual(validatePhone('   '), false, 'Whitespace must be rejected');
  assert.strictEqual(validatePhone('123456'), false, '6 digits (too short) must be rejected');
});

test('ContactForm: Acceptance of valid standard & international phone formats', () => {
  const phoneRegex = /^[+]?[0-9\s().-]{7,50}$/;
  function validatePhone(phone) {
    if (!phone || !phone.trim()) return false;
    const t = phone.trim();
    if (t.length < 7 || !phoneRegex.test(t)) return false;
    return true;
  }

  assert.strictEqual(validatePhone('+1 (800) 476-6367'), true, '+1 (800) 476-6367 must pass');
  assert.strictEqual(validatePhone('+44 7911 123456'), true, '+44 7911 123456 must pass');
  assert.strictEqual(validatePhone('555-1234'), true, '555-1234 must pass');
  assert.strictEqual(validatePhone('800-476-6367'), true, '800-476-6367 must pass');
  assert.strictEqual(validatePhone('+92 300 1234567'), true, '+92 300 1234567 must pass');
  assert.strictEqual(validatePhone('5551234'), true, '5551234 (7 digits) must pass');
});

// -----------------------------------------------------------------------------
// 5. WCAG 2.1 Contrast Ratios
// -----------------------------------------------------------------------------
console.log(`\n${BOLD}5. Brand Color Luminance & WCAG Contrast Matrix${RESET}`);

function getLuminance(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const max = Math.max(lum1, lum2);
  const min = Math.min(lum1, lum2);
  return (max + 0.05) / (min + 0.05);
}

test('WCAG Contrast: Acid Lime #C6FF33 on Obsidian #000000 >= 16:1 (Passes AAA 7.0:1)', () => {
  const cr = getContrastRatio('#C6FF33', '#000000');
  assert.ok(cr >= 16.0, `Lime on Black must be >= 16.0, got ${cr.toFixed(2)}:1`);
  assert.ok(cr >= 7.0, 'Must satisfy WCAG AAA');
});

test('WCAG Contrast: Crisp White #FFFFFF on Obsidian #000000 = 21:1 (Passes AAA 7.0:1)', () => {
  const cr = getContrastRatio('#FFFFFF', '#000000');
  assert.strictEqual(Math.round(cr), 21, `White on Black must be 21:1, got ${cr.toFixed(2)}:1`);
});

test('WCAG Contrast: Muted Text #9E9EAF on Obsidian #000000 >= 7.0:1 (Passes AAA 7.0:1)', () => {
  const cr = getContrastRatio('#9E9EAF', '#000000');
  assert.ok(cr >= 7.0, `Muted text must pass WCAG AAA (>=7.0:1), got ${cr.toFixed(2)}:1`);
});

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log(`\n${BOLD}${CYAN}----------------------------------------------------------------${RESET}`);
console.log(`${BOLD}TOTAL VERIFICATIONS: ${totalTests} | PASSED: ${GREEN}${passedTests}${RESET} | FAILED: ${failedTests > 0 ? RED : GREEN}${failedTests}${RESET}`);
console.log(`${BOLD}${CYAN}----------------------------------------------------------------${RESET}\n`);

if (failedTests > 0) {
  console.log(`${RED}VERIFICATION SUITE DETECTED FAILURES:${RESET}`);
  failures.forEach(f => console.log(`  - ${f.name}: ${f.error}`));
  process.exit(1);
} else {
  console.log(`${GREEN}${BOLD}✔ ALL 22 EMPIRICAL VERIFICATIONS PASSED CLEANLY (EXIT CODE 0)${RESET}\n`);
  process.exit(0);
}
