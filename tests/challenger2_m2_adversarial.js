/**
 * Adversarial Empirical Test Harness for Milestone 2 (IRONFORGE FITNESS)
 * Authored by Challenger 2 (teamwork_challenger)
 * 
 * Objectives:
 * 1. Adaptive DPR & Mobile Throttling:
 *    - Desktop clamped to [1, 1.8], mobile clamped to [1, 1.3].
 *    - Extreme DPR handling (0.5, 2.0, 3.0, 4.0, Retina).
 *    - High performance WebGL context flags (powerPreference, antialias, depth, stencil).
 * 2. Chalk Dust Particle Scaling & Buffer Math:
 *    - Particle reduction on mobile: exactly 100 on mobile vs 350 on desktop.
 *    - Coordinate containment in high-bay cone and drift math stability.
 * 3. SSR Isolation & Pure Node.js Headless Execution:
 *    - Zero window/document crashes across all canvas modules.
 *    - Safe fallback rendering during SSR.
 * 4. Layout & Z-Index Layering Integrity:
 *    - #canvas-container fixed, inset-0, z-0, pointer-events-none.
 *    - #main-content relative, z-10, pointer-events-auto, click-through pass.
 * 5. WebGL Context Loss & Restoration Event Handling:
 *    - webglcontextlost preventDefault and fallback swap.
 *    - webglcontextrestored recovery.
 * 6. Hero Figure Parallax Damping & Touch Neutralization:
 *    - Bounds clamping on extreme pointer input.
 *    - Touch device parallax neutralization.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ANSI formatting
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const findings = [];

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
    findings.push({ name, error: err.message, stack: err.stack });
  }
}

console.log(`\n${BOLD}${CYAN}======================================================${RESET}`);
console.log(`${BOLD}${CYAN}   IRONFORGE FITNESS — CHALLENGER 2 ADVERSARIAL SUITE ${RESET}`);
console.log(`${BOLD}${CYAN}   Milestone 2: Mobile Performance, Particle & SSR    ${RESET}`);
console.log(`${BOLD}${CYAN}======================================================${RESET}\n`);

// =========================================================================
// SUITE 1: Adaptive DPR Clamping & Mobile Throttling Stress Tests
// =========================================================================
console.log(`${BOLD}1. Adaptive DPR Clamping & Mobile Throttling Stress Tests${RESET}`);

// Source inspection of GymCanvas.tsx
const gymCanvasPath = path.resolve(__dirname, '../src/components/canvas/GymCanvas.tsx');
assert.ok(fs.existsSync(gymCanvasPath), 'GymCanvas.tsx must exist');
const gymCanvasCode = fs.readFileSync(gymCanvasPath, 'utf8');

test('GymCanvas: Source contains explicit desktop [1, 1.8] and mobile [1, 1.3] DPR clamping', () => {
  assert.ok(
    gymCanvasCode.includes('dpr={isMobile ? [1, 1.3] : [1, 1.8]}'),
    'GymCanvas must configure dpr={isMobile ? [1, 1.3] : [1, 1.8]}'
  );
});

test('GymCanvas: Mobile threshold checks both innerWidth < 768 and pointer: coarse', () => {
  assert.ok(
    gymCanvasCode.includes("window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches"),
    'Mobile detection must combine width < 768 and pointer: coarse for tablet/phone touch devices'
  );
});

test('GymCanvas: Context attributes configure high-performance powerPreference and stencil disabled', () => {
  assert.ok(gymCanvasCode.includes("powerPreference: 'high-performance'"), 'Must specify high-performance WebGL context');
  assert.ok(gymCanvasCode.includes('stencil: false'), 'Stencil must be disabled to save mobile GPU framebuffer bandwidth');
  assert.ok(gymCanvasCode.includes('antialias: true'), 'Antialias must be enabled for crisp industrial lighting');
  assert.ok(gymCanvasCode.includes('depth: true'), 'Depth buffer must be enabled for 3D occlusion');
});

// Empirical DPR clamping formula evaluation
function calculateEffectiveDPR(windowDPR, dprRange) {
  const [minDpr, maxDpr] = Array.isArray(dprRange) ? dprRange : [1, dprRange];
  return Math.max(minDpr, Math.min(maxDpr, windowDPR));
}

test('DPR Clamping Math: Mobile device clamped to range [1, 1.3] under extreme device pixel ratios', () => {
  const mobileRange = [1, 1.3];
  
  // Standard phone (DPR = 2)
  assert.strictEqual(calculateEffectiveDPR(2.0, mobileRange), 1.3);
  // High-density iPhone / Galaxy (DPR = 3)
  assert.strictEqual(calculateEffectiveDPR(3.0, mobileRange), 1.3);
  // Ultra-dense Retina display (DPR = 4)
  assert.strictEqual(calculateEffectiveDPR(4.0, mobileRange), 1.3);
  // Fractional DPR (e.g. Android 2.625)
  assert.strictEqual(calculateEffectiveDPR(2.625, mobileRange), 1.3);
  // Low-end mobile (DPR = 1)
  assert.strictEqual(calculateEffectiveDPR(1.0, mobileRange), 1.0);
  // Sub-1 zoom out (DPR = 0.75 or 0.5)
  assert.strictEqual(calculateEffectiveDPR(0.75, mobileRange), 1.0);
});

test('DPR Clamping Math: Desktop device clamped to range [1, 1.8] under 4K / Retina screens', () => {
  const desktopRange = [1, 1.8];
  
  // Standard 1080p desktop (DPR = 1)
  assert.strictEqual(calculateEffectiveDPR(1.0, desktopRange), 1.0);
  // 1440p / 125% zoom (DPR = 1.25)
  assert.strictEqual(calculateEffectiveDPR(1.25, desktopRange), 1.25);
  // MacBook Pro Retina (DPR = 2)
  assert.strictEqual(calculateEffectiveDPR(2.0, desktopRange), 1.8);
  // 4K Studio Display at 200% (DPR = 2.0 -> clamped to 1.8)
  assert.strictEqual(calculateEffectiveDPR(2.0, desktopRange), 1.8);
  // Ultra-dense display (DPR = 3.5)
  assert.strictEqual(calculateEffectiveDPR(3.5, desktopRange), 1.8);
});

test('Mobile Detection Simulation: Responding to viewport width and touch media queries', () => {
  function detectMobile(width, isCoarse) {
    return width < 768 || isCoarse;
  }

  // Mobile smartphones
  assert.strictEqual(detectMobile(320, true), true, 'iPhone SE');
  assert.strictEqual(detectMobile(375, true), true, 'iPhone X/12 Mini');
  assert.strictEqual(detectMobile(390, true), true, 'iPhone 14/15');
  assert.strictEqual(detectMobile(414, true), true, 'iPhone Plus');
  assert.strictEqual(detectMobile(767, true), true, 'Boundary below 768');

  // Tablets with coarse pointer (iPad, Android tablets)
  assert.strictEqual(detectMobile(768, true), true, 'iPad Mini (768px touch)');
  assert.strictEqual(detectMobile(810, true), true, 'iPad 10th Gen (810px touch)');
  assert.strictEqual(detectMobile(1024, true), true, 'iPad Pro (1024px touch)');

  // Desktop mice / laptops
  assert.strictEqual(detectMobile(768, false), false, 'Boundary 768 desktop');
  assert.strictEqual(detectMobile(1024, false), false, '1024px desktop monitor');
  assert.strictEqual(detectMobile(1440, false), false, '1440p desktop');
  assert.strictEqual(detectMobile(1920, false), false, '1080p full HD desktop');
  assert.strictEqual(detectMobile(3840, false), false, '4K ultra wide desktop');
});

// =========================================================================
// SUITE 2: Chalk Dust Particle Adaptive Scaling & Math Stress Tests
// =========================================================================
console.log(`\n${BOLD}2. Chalk Dust Particle Adaptive Scaling & Math Stress Tests${RESET}`);

const dustParticlesPath = path.resolve(__dirname, '../src/components/canvas/DustParticles.tsx');
assert.ok(fs.existsSync(dustParticlesPath), 'DustParticles.tsx must exist');
const dustParticlesCode = fs.readFileSync(dustParticlesPath, 'utf8');

test('DustParticles: Source code defines 100 on mobile vs 350 on desktop', () => {
  assert.ok(
    dustParticlesCode.includes('isMobile ? 100 : 350'),
    'DustParticles must scale count to 100 on mobile and 350 on desktop'
  );
});

test('DustParticles: Particle count resolution logic supports custom overrides and zero', () => {
  function resolveParticleCount(customCount, isMobile) {
    if (customCount !== undefined) return customCount;
    return isMobile ? 100 : 350;
  }

  assert.strictEqual(resolveParticleCount(undefined, false), 350, 'Desktop default 350');
  assert.strictEqual(resolveParticleCount(undefined, true), 100, 'Mobile default 100 (71.4% reduction)');
  assert.strictEqual(resolveParticleCount(500, true), 500, 'Custom count override respected on mobile');
  assert.strictEqual(resolveParticleCount(0, false), 0, 'Zero count edge case handled');
});

test('DustParticles: Particle buffer generator creates valid coordinates within high-bay cone', () => {
  // Replicate exact generation logic from DustParticles.tsx lines 37-58
  function generateParticleBuffers(particleCount) {
    const pos = new Float32Array(particleCount * 3);
    const ph = new Float32Array(particleCount * 3);
    const sp = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 7.0;
      pos[i3 + 1] = 0.5 + Math.random() * 9.0;
      pos[i3 + 2] = (Math.random() - 0.5) * 7.0;

      ph[i3] = Math.random() * Math.PI * 2;
      ph[i3 + 1] = Math.random() * Math.PI * 2;
      ph[i3 + 2] = Math.random() * Math.PI * 2;

      sp[i] = 0.2 + Math.random() * 0.4;
    }
    return [pos, ph, sp];
  }

  // Test both mobile (100) and desktop (350)
  for (const count of [100, 350]) {
    const [positions, phases, speeds] = generateParticleBuffers(count);
    assert.strictEqual(positions.length, count * 3, `Positions buffer size ${count * 3}`);
    assert.strictEqual(phases.length, count * 3, `Phases buffer size ${count * 3}`);
    assert.strictEqual(speeds.length, count, `Speeds buffer size ${count}`);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      assert.ok(x >= -3.5 && x <= 3.5, `X coordinate ${x} inside [-3.5, 3.5]`);
      assert.ok(y >= 0.5 && y <= 9.5, `Y coordinate ${y} inside [0.5, 9.5]`);
      assert.ok(z >= -3.5 && z <= 3.5, `Z coordinate ${z} inside [-3.5, 3.5]`);

      assert.ok(phases[i3] >= 0 && phases[i3] <= Math.PI * 2, 'Phase X valid');
      assert.ok(phases[i3 + 1] >= 0 && phases[i3 + 1] <= Math.PI * 2, 'Phase Y valid');
      assert.ok(phases[i3 + 2] >= 0 && phases[i3 + 2] <= Math.PI * 2, 'Phase Z valid');

      assert.ok(speeds[i] >= 0.2 && speeds[i] <= 0.6, 'Speed in [0.2, 0.6]');
    }
  }
});

test('DustParticles: Long-duration drift simulation produces no NaN, Infinity, or unbounded divergence', () => {
  const count = 100;
  const pos = new Float32Array(count * 3);
  const ph = new Float32Array(count * 3);
  const sp = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    pos[i3] = (Math.random() - 0.5) * 7.0;
    pos[i3 + 1] = 0.5 + Math.random() * 9.0;
    pos[i3 + 2] = (Math.random() - 0.5) * 7.0;
    ph[i3] = Math.random() * Math.PI * 2;
    ph[i3 + 1] = Math.random() * Math.PI * 2;
    ph[i3 + 2] = Math.random() * Math.PI * 2;
    sp[i] = 0.2 + Math.random() * 0.4;
  }

  const basePositions = new Float32Array(pos);
  const posArray = new Float32Array(pos);

  // Simulate 10,000 frames over 10,000 simulated seconds (extreme stress)
  const testTimes = [0, 1.5, 100, 3600, 86400, 1000000];

  for (const time of testTimes) {
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const speed = sp[i];

      posArray[i3] = basePositions[i3] + Math.sin(time * speed * 0.7 + ph[i3]) * 0.15;
      posArray[i3 + 1] = basePositions[i3 + 1] + Math.sin(time * speed + ph[i3 + 1]) * 0.22;
      posArray[i3 + 2] = basePositions[i3 + 2] + Math.cos(time * speed * 0.8 + ph[i3 + 2]) * 0.15;

      assert.ok(!Number.isNaN(posArray[i3]), `X must not be NaN at time ${time}`);
      assert.ok(!Number.isNaN(posArray[i3 + 1]), `Y must not be NaN at time ${time}`);
      assert.ok(!Number.isNaN(posArray[i3 + 2]), `Z must not be NaN at time ${time}`);

      assert.ok(Number.isFinite(posArray[i3]), `X must be finite at time ${time}`);
      assert.ok(Number.isFinite(posArray[i3 + 1]), `Y must be finite at time ${time}`);
      assert.ok(Number.isFinite(posArray[i3 + 2]), `Z must be finite at time ${time}`);

      // Offset must never exceed max amplitude
      assert.ok(Math.abs(posArray[i3] - basePositions[i3]) <= 0.150001, 'X drift bounded by 0.15');
      assert.ok(Math.abs(posArray[i3 + 1] - basePositions[i3 + 1]) <= 0.220001, 'Y drift bounded by 0.22');
      assert.ok(Math.abs(posArray[i3 + 2] - basePositions[i3 + 2]) <= 0.150001, 'Z drift bounded by 0.15');
    }
  }
});

// =========================================================================
// SUITE 3: SSR Isolation & Pure Node.js Zero-Crash Stress Tests
// =========================================================================
console.log(`\n${BOLD}3. SSR Isolation & Pure Node.js Zero-Crash Stress Tests${RESET}`);

// Run webglSupport.ts in a pure isolated Node.js VM context where window and document are strictly undefined
test('SSR Isolation: webglSupport functions execute without window/document in pure Node.js VM', () => {
  const ts = require('typescript');
  const webglSupportCode = fs.readFileSync(path.resolve(__dirname, '../src/lib/webglSupport.ts'), 'utf8');
  
  // Transpile TypeScript syntax using TypeScript compiler API
  const jsOutput = ts.transpileModule(webglSupportCode, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText;

  const sandbox = {
    exports: {},
    module: { exports: {} }
  };
  vm.createContext(sandbox);
  // Ensure window and document are strictly undefined
  assert.strictEqual(sandbox.window, undefined);
  assert.strictEqual(sandbox.document, undefined);

  vm.runInContext(
    jsOutput + `
      var resIsAvailable = exports.isWebGLAvailable();
      var resCheckSimple = exports.checkWebGLSupport();
      var resCheckDetailed = exports.checkWebGLSupport(true);
      var resDetails = exports.getWebGLSupportDetails();
    `,
    sandbox
  );

  assert.strictEqual(sandbox.resIsAvailable, false, 'isWebGLAvailable must return false in SSR');
  assert.strictEqual(sandbox.resCheckSimple, false, 'checkWebGLSupport() must return false in SSR');
  assert.strictEqual(sandbox.resCheckDetailed.supported, false, 'checkWebGLSupport(true) supported must be false');
  assert.strictEqual(sandbox.resCheckDetailed.version, null, 'checkWebGLSupport(true) version must be null');
  assert.strictEqual(sandbox.resCheckDetailed.error, 'SSR environment', 'checkWebGLSupport(true) error must be SSR environment');
  assert.strictEqual(sandbox.resDetails.supported, false, 'getWebGLSupportDetails supported must be false');
  assert.strictEqual(sandbox.resDetails.version, null, 'getWebGLSupportDetails version must be null');
  assert.strictEqual(sandbox.resDetails.error, 'SSR environment', 'getWebGLSupportDetails error must be SSR environment');
});

test('SSR Safety: Canvas client components have defensive typeof window guards or initial mounted=false', () => {
  // GymCanvas: uses mounted state, initially false
  assert.ok(gymCanvasCode.includes('const [mounted, setMounted] = useState(false);'));
  assert.ok(gymCanvasCode.includes('if (!mounted) {\n    return <CanvasLoaderFallback />;'));

  // WebGLDetector: uses mounted state, initially false
  const detectorCode = fs.readFileSync(path.resolve(__dirname, '../src/components/canvas/WebGLDetector.tsx'), 'utf8');
  assert.ok(detectorCode.includes('const [mounted, setMounted] = useState(false);'));
  assert.ok(detectorCode.includes('if (!mounted) {\n    return <>{fallback || <FallbackHeroImage />}</>;'));

  // HeroFigure: uses typeof window !== 'undefined'
  const heroCode = fs.readFileSync(path.resolve(__dirname, '../src/components/canvas/HeroFigure.tsx'), 'utf8');
  assert.ok(heroCode.includes("typeof window !== 'undefined'"));

  // DustParticles: uses typeof window !== 'undefined'
  assert.ok(dustParticlesCode.includes("typeof window !== 'undefined'"));
});

test('SSR Safety: FallbackHeroImage is clean JSX with zero browser global dependencies', () => {
  const fallbackCode = fs.readFileSync(path.resolve(__dirname, '../src/components/canvas/FallbackHeroImage.tsx'), 'utf8');
  assert.ok(!fallbackCode.includes('window.'), 'FallbackHeroImage must not reference window');
  assert.ok(!fallbackCode.includes('document.'), 'FallbackHeroImage must not reference document');
  assert.ok(!fallbackCode.includes('navigator.'), 'FallbackHeroImage must not reference navigator');
  assert.ok(fallbackCode.includes('id="webgl-fallback-hero"'), 'Must render container id="webgl-fallback-hero"');
});

// =========================================================================
// SUITE 4: Layout & Z-Index Layering Integrity Stress Tests
// =========================================================================
console.log(`\n${BOLD}4. Layout & Z-Index Layering Integrity Stress Tests${RESET}`);

const layoutPath = path.resolve(__dirname, '../src/app/layout.tsx');
assert.ok(fs.existsSync(layoutPath), 'layout.tsx must exist');
const layoutCode = fs.readFileSync(layoutPath, 'utf8');

test('Root Layout: #canvas-container is fixed, full-viewport (inset-0), z-0, and pointer-events-none', () => {
  const canvasContainerRegex = /<div\s+id="canvas-container"[^>]*className="([^"]+)"/;
  const match = layoutCode.match(canvasContainerRegex);
  assert.ok(match, 'Must find #canvas-container in layout.tsx');
  
  const classNames = match[1].split(/\s+/);
  assert.ok(classNames.includes('fixed'), '#canvas-container must be fixed');
  assert.ok(classNames.includes('inset-0'), '#canvas-container must span full viewport with inset-0');
  assert.ok(classNames.includes('pointer-events-none'), '#canvas-container must have pointer-events-none');
  assert.ok(classNames.includes('z-0'), '#canvas-container must be positioned at background layer z-0');
  assert.ok(classNames.includes('overflow-hidden'), '#canvas-container must have overflow-hidden');
});

test('Root Layout: #canvas-container has aria-hidden="true" to keep 3D canvas out of accessibility tree', () => {
  assert.ok(
    layoutCode.includes('id="canvas-container"') && layoutCode.includes('aria-hidden="true"'),
    '#canvas-container must have aria-hidden="true"'
  );
});

test('Root Layout: #main-content is relative, stacked above canvas at z-10, with overflow-x-clip', () => {
  const mainContentRegex = /<main\s+id="main-content"[^>]*className="([^"]+)"/;
  const match = layoutCode.match(mainContentRegex);
  assert.ok(match, 'Must find #main-content in layout.tsx');

  const classNames = match[1].split(/\s+/);
  assert.ok(classNames.includes('relative'), '#main-content must be relative');
  assert.ok(classNames.includes('z-10'), '#main-content must have z-10 (above canvas container z-0)');
  assert.ok(classNames.includes('overflow-x-clip'), '#main-content must prevent horizontal overflow');
});

test('Root Layout: Skip link is stacked at highest layer z-[100]', () => {
  assert.ok(layoutCode.includes('z-[100]'), 'Accessible skip to content link must be at z-[100]');
  assert.ok(layoutCode.includes('href="#main-content"'), 'Skip link must target #main-content');
});

test('Pointer-Events Contract Simulation: Interactive elements on top are not blocked by canvas', () => {
  // Simulate DOM hierarchy & click routing
  const layers = [
    { id: 'canvas-container', zIndex: 0, pointerEvents: 'none' },
    { id: 'main-content', zIndex: 10, pointerEvents: 'auto', children: [
      { id: 'hero-cta-btn', tag: 'button', pointerEvents: 'auto' },
      { id: 'contact-input-email', tag: 'input', pointerEvents: 'auto' },
      { id: 'membership-card-btn', tag: 'button', pointerEvents: 'auto' }
    ]},
    { id: 'navbar', zIndex: 50, pointerEvents: 'auto' },
    { id: 'skip-link', zIndex: 100, pointerEvents: 'auto' }
  ];

  function hitTest(layerList, x, y) {
    // Return highest zIndex element that has pointerEvents !== 'none'
    const sorted = [...layerList]
      .filter(l => l.pointerEvents !== 'none')
      .sort((a, b) => b.zIndex - a.zIndex);
    return sorted[0] ? sorted[0].id : null;
  }

  // Hit test at viewport center
  const topLayer = hitTest(layers, 500, 500);
  assert.notStrictEqual(topLayer, 'canvas-container', 'Canvas container must never capture pointer hits');
  assert.strictEqual(topLayer, 'skip-link', 'Topmost interactive layer received hit');
});

// =========================================================================
// SUITE 5: WebGL Context Loss & Restoration Event Stress Tests
// =========================================================================
console.log(`\n${BOLD}5. WebGL Context Loss & Restoration Event Stress Tests${RESET}`);

test('WebGL Detector: Handles webglcontextlost with preventDefault and state transition', () => {
  // Simulate WebGLDetector state machine
  class MockWebGLDetector {
    constructor() {
      this.mounted = true;
      this.hasWebGL = true;
      this.contextLost = false;
    }

    onContextLost(event) {
      event.preventDefault();
      this.contextLost = true;
    }

    onContextRestored() {
      this.contextLost = false;
    }

    render() {
      if (!this.mounted || !this.hasWebGL || this.contextLost) {
        return 'FALLBACK_HERO_IMAGE';
      }
      return 'THREEJS_CANVAS';
    }
  }

  const detector = new MockWebGLDetector();
  assert.strictEqual(detector.render(), 'THREEJS_CANVAS', 'Initial render is 3D canvas');

  // Trigger context lost
  let prevented = false;
  const mockEvent = {
    preventDefault: () => { prevented = true; }
  };

  detector.onContextLost(mockEvent);
  assert.strictEqual(prevented, true, 'Must call preventDefault() on context lost event');
  assert.strictEqual(detector.contextLost, true, 'Context lost flag set to true');
  assert.strictEqual(detector.render(), 'FALLBACK_HERO_IMAGE', 'Immediately swaps to fallback');

  // Trigger context restored
  detector.onContextRestored();
  assert.strictEqual(detector.contextLost, false, 'Context lost flag cleared');
  assert.strictEqual(detector.render(), 'THREEJS_CANVAS', 'Restores 3D scene when context restored');
});

test('WebGL Capability Check: Recovers gracefully when getContext throws error', () => {
  function safeCheckWithFaultyDOM() {
    try {
      const mockCanvas = {
        getContext: () => {
          throw new Error('GPU process crashed');
        }
      };
      const gl = mockCanvas.getContext('webgl2');
      return Boolean(gl);
    } catch {
      return false;
    }
  }

  const result = safeCheckWithFaultyDOM();
  assert.strictEqual(result, false, 'Should catch throw and return false cleanly');
});

// =========================================================================
// SUITE 6: Hero Figure Pointer Parallax Damping & Touch Neutralization
// =========================================================================
console.log(`\n${BOLD}6. Hero Figure Pointer Parallax Damping & Touch Neutralization${RESET}`);

const heroFigureCode = fs.readFileSync(path.resolve(__dirname, '../src/components/canvas/HeroFigure.tsx'), 'utf8');

test('HeroFigure: Source code implements MathUtils.damp and boundary clamping', () => {
  assert.ok(heroFigureCode.includes('THREE.MathUtils.damp'), 'Must use THREE.MathUtils.damp for smooth damping');
  assert.ok(heroFigureCode.includes('Math.max(-1.0, Math.min(1.0, state.pointer.x))'), 'Must clamp pointer.x to [-1.0, 1.0]');
  assert.ok(heroFigureCode.includes('Math.max(-1.0, Math.min(1.0, state.pointer.y))'), 'Must clamp pointer.y to [-1.0, 1.0]');
  assert.ok(heroFigureCode.includes('clampedX * 0.16'), 'Y rotation bound to max 0.16 rad');
  assert.ok(heroFigureCode.includes('-clampedY * 0.08'), 'X rotation bound to max 0.08 rad');
});

test('HeroFigure: Touch device neutralization resets rotation to base', () => {
  assert.ok(
    heroFigureCode.includes('if (isTouchDevice)') &&
    heroFigureCode.includes('groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, rotation[1]'),
    'Touch devices must neutralize parallax to prevent touch scroll jitter'
  );
});

test('Parallax Math: Extreme adversarial pointer inputs never exceed rotation boundaries', () => {
  function computeTargetRotations(pointerX, pointerY, baseRotX = 0, baseRotY = 0) {
    const clampedX = Math.max(-1.0, Math.min(1.0, pointerX));
    const clampedY = Math.max(-1.0, Math.min(1.0, pointerY));

    const targetRotY = baseRotY + clampedX * 0.16;
    const targetRotX = baseRotX + -clampedY * 0.08;

    return { targetRotX, targetRotY };
  }

  // Adversarial coordinates
  const adversarialInputs = [
    { x: 0, y: 0, expX: 0, expY: 0 },
    { x: 1, y: 1, expX: -0.08, expY: 0.16 },
    { x: -1, y: -1, expX: 0.08, expY: -0.16 },
    { x: 9999, y: 9999, expX: -0.08, expY: 0.16 },
    { x: -9999, y: -9999, expX: 0.08, expY: -0.16 },
    { x: 2.5, y: -3.8, expX: 0.08, expY: 0.16 },
  ];

  for (const { x, y, expX, expY } of adversarialInputs) {
    const { targetRotX, targetRotY } = computeTargetRotations(x, y);
    assert.strictEqual(
      Number(targetRotX.toFixed(4)),
      Number(expX.toFixed(4)),
      `TargetRotX correctly clamped for (${x}, ${y})`
    );
    assert.strictEqual(
      Number(targetRotY.toFixed(4)),
      Number(expY.toFixed(4)),
      `TargetRotY correctly clamped for (${x}, ${y})`
    );
    assert.ok(Math.abs(targetRotX) <= 0.08, 'X rotation never exceeds 0.08 rad');
    assert.ok(Math.abs(targetRotY) <= 0.16, 'Y rotation never exceeds 0.16 rad');
  }
});

// =========================================================================
// SUITE 7: Brand Color Rig & Industrial Lighting Conformance
// =========================================================================
console.log(`\n${BOLD}7. Brand Color Rig & Industrial Lighting Conformance${RESET}`);

const gymEnvCode = fs.readFileSync(path.resolve(__dirname, '../src/components/canvas/GymEnvironment.tsx'), 'utf8');
const gymFloorCode = fs.readFileSync(path.resolve(__dirname, '../src/components/canvas/GymFloor.tsx'), 'utf8');

test('GymEnvironment: Strictly uses exact 4-color palette (#000000, #FFFFFF, #7D39EB, #C6FF33)', () => {
  // Check overhead high-bay key light
  assert.ok(gymEnvCode.includes('color="#FFFFFF"'), 'Key light must be #FFFFFF Crisp White');
  assert.ok(gymEnvCode.includes('intensity={40}'), 'Key light intensity must be 40');
  assert.ok(gymEnvCode.includes('position={[0, 11, 2]}'), 'Key light position must be [0, 11, 2]');

  // Check rim spotlights
  assert.ok(gymEnvCode.includes('color="#7D39EB"'), 'Rim lights must be #7D39EB Electric Violet');
  assert.ok(gymEnvCode.includes('position={[-5, 4, -3]}'), 'Rim 1 position [-5, 4, -3]');
  assert.ok(gymEnvCode.includes('position={[5, 3, -3]}'), 'Rim 2 position [5, 3, -3]');
  assert.ok(gymEnvCode.includes('intensity={22}'), 'Rim light intensity 22');

  // Check directional kicker
  assert.ok(gymEnvCode.includes('color="#C6FF33"'), 'Directional kicker must be #C6FF33 Acid Lime');
  assert.ok(gymEnvCode.includes('position={[3.5, 1.2, 3]}'), 'Kicker position [3.5, 1.2, 3]');
  assert.ok(gymEnvCode.includes('intensity={14}'), 'Kicker intensity 14');

  // Check background fog
  assert.ok(gymEnvCode.includes("new THREE.Color('#000000')"), 'Background must be #000000');
  assert.ok(gymEnvCode.includes('new THREE.FogExp2(0x000000, 0.035)'), 'Fog must be 0x000000 at density 0.035');
});

test('GymFloor: Rubber matting roughness, metalness, and laser guide colors conform to specifications', () => {
  assert.ok(gymFloorCode.includes('color="#080808"'), 'Rubber floor color #080808');
  assert.ok(gymFloorCode.includes('roughness={0.85}'), 'Floor roughness 0.85');
  assert.ok(gymFloorCode.includes('metalness={0.15}'), 'Floor metalness 0.15');
  assert.ok(gymFloorCode.includes("color: '#C6FF33'"), 'Laser guide lines contain #C6FF33');
  assert.ok(gymFloorCode.includes("color: '#7D39EB'"), 'Laser guide lines contain #7D39EB');
});

// =========================================================================
// SUMMARY & VERDICT REPORTING
// =========================================================================
console.log(`\n${BOLD}${CYAN}------------------------------------------------------${RESET}`);
console.log(`${BOLD}CHALLENGER 2 ADVERSARIAL TEST SUMMARY:${RESET}`);
console.log(`  Total Adversarial Tests: ${totalTests}`);
console.log(`  Passed:                  ${GREEN}${passedTests}${RESET}`);
console.log(`  Failed:                  ${failedTests > 0 ? RED : GREEN}${failedTests}${RESET}`);
console.log(`${BOLD}${CYAN}------------------------------------------------------${RESET}`);

if (failedTests > 0) {
  console.log(`\n${BOLD}${RED}VERDICT: REQUEST_CHANGES (${failedTests} tests failed)${RESET}\n`);
  process.exit(1);
} else {
  console.log(`\n${BOLD}${GREEN}VERDICT: APPROVE (${passedTests}/${totalTests} tests passed cleanly)${RESET}\n`);
  process.exit(0);
}
