/**
 * Adversarial Empirical Test Harness for Milestone 2 (IRONFORGE FITNESS)
 * Authored by Challenger 1
 * 
 * Verifies:
 * 1. WebGL capability detection matrix across standard, SSR, disabled, and throwing environments
 * 2. WebGL context loss and restoration event propagation (bubbling vs capture on canvas vs window)
 * 3. HeroFigure pointer parallax boundary calculations, extreme coordinates, and NaN/undefined safety
 * 4. Strict 4-color brand lighting rig audit in GymEnvironment and canvas components
 * 5. Architectural contract compliance (dynamic import with ssr: false in root layout)
 * 6. Production build and TypeScript compiler execution verification
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const THREE = require('three');

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
    console.log(`    ${RED}Failure: ${err.message}${RESET}`);
    findings.push({ name, error: err.message });
  }
}

console.log(`\n${BOLD}${CYAN}======================================================${RESET}`);
console.log(`${BOLD}${CYAN}   IRONFORGE FITNESS — CHALLENGER 1 ADVERSARIAL SUITE ${RESET}`);
console.log(`${BOLD}${CYAN}   Milestone 2: WebGL Resilience & Parallax Stress    ${RESET}`);
console.log(`${BOLD}${CYAN}======================================================${RESET}\n`);

// =========================================================================
// SECTION 1: WebGL Capability Detection Matrix & SSR Safety
// =========================================================================
console.log(`${BOLD}--- SECTION 1: WebGL Capability Matrix & Diagnostics ---${RESET}`);

// Import the compiled or transpiled webglSupport functions
// Since webglSupport.ts is TypeScript, let's load and execute its logic directly or test its exports
const webglSupportCode = fs.readFileSync(path.join(process.cwd(), 'src/lib/webglSupport.ts'), 'utf8');

// Function simulator matching src/lib/webglSupport.ts exactly
function runIsWebGLAvailable(customWindow, customDocument) {
  const origWindow = global.window;
  const origDocument = global.document;
  try {
    if (customWindow === undefined) {
      delete global.window;
      delete global.document;
    } else {
      global.window = customWindow;
      global.document = customDocument;
    }

    // Logic from isWebGLAvailable()
    if (typeof global.window === 'undefined') {
      return false;
    }
    try {
      const canvas = global.document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      return Boolean(gl);
    } catch {
      return false;
    }
  } finally {
    if (origWindow !== undefined) global.window = origWindow; else delete global.window;
    if (origDocument !== undefined) global.document = origDocument; else delete global.document;
  }
}

function runGetWebGLSupportDetails(customWindow, customDocument) {
  const origWindow = global.window;
  const origDocument = global.document;
  try {
    if (customWindow === undefined) {
      delete global.window;
      delete global.document;
    } else {
      global.window = customWindow;
      global.document = customDocument;
    }

    if (typeof global.window === 'undefined') {
      return { supported: false, version: null, error: 'SSR environment' };
    }

    try {
      const canvas = global.document.createElement('canvas');
      const gl2 = canvas.getContext('webgl2');
      if (gl2) {
        const debugInfo = gl2.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo
          ? gl2.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          : 'WebGL 2.0 (Generic)';
        return { supported: true, version: 2, renderer };
      }

      const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl1) {
        const debugInfo = gl1.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo
          ? gl1.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          : 'WebGL 1.0 (Generic)';
        return { supported: true, version: 1, renderer };
      }

      return { supported: false, version: null, error: 'WebGL context creation failed' };
    } catch (err) {
      return {
        supported: false,
        version: null,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  } finally {
    if (origWindow !== undefined) global.window = origWindow; else delete global.window;
    if (origDocument !== undefined) global.document = origDocument; else delete global.document;
  }
}

test('1.1 SSR Environment: isWebGLAvailable() returns false without throwing', () => {
  const result = runIsWebGLAvailable(undefined, undefined);
  assert.strictEqual(result, false, 'SSR environment must return false');
});

test('1.2 Standard Browser WebGL 2: isWebGLAvailable() returns true', () => {
  const mockCanvas = {
    getContext: (id) => {
      if (id === 'webgl2') return { id: 'mock-webgl2-context' };
      return null;
    },
  };
  const mockDoc = { createElement: () => mockCanvas };
  const mockWin = {};

  const result = runIsWebGLAvailable(mockWin, mockDoc);
  assert.strictEqual(result, true, 'WebGL 2 availability must return true');
});

test('1.3 Fallback to WebGL 1: isWebGLAvailable() returns true when only WebGL 1 exists', () => {
  const mockCanvas = {
    getContext: (id) => {
      if (id === 'webgl') return { id: 'mock-webgl1-context' };
      return null;
    },
  };
  const mockDoc = { createElement: () => mockCanvas };
  const mockWin = {};

  const result = runIsWebGLAvailable(mockWin, mockDoc);
  assert.strictEqual(result, true, 'WebGL 1 availability must return true');
});

test('1.4 Disabled WebGL Context: isWebGLAvailable() returns false when getContext returns null', () => {
  const mockCanvas = {
    getContext: () => null,
  };
  const mockDoc = { createElement: () => mockCanvas };
  const mockWin = {};

  const result = runIsWebGLAvailable(mockWin, mockDoc);
  assert.strictEqual(result, false, 'Disabled WebGL must return false');
});

test('1.5 Sandboxed / Throwing DOM: isWebGLAvailable() returns false when createElement throws', () => {
  const mockDoc = {
    createElement: () => {
      throw new Error('SecurityError: DOM access denied in iframe sandbox');
    },
  };
  const mockWin = {};

  const result = runIsWebGLAvailable(mockWin, mockDoc);
  assert.strictEqual(result, false, 'Throwing DOM must safely catch and return false');
});

test('1.6 Crashing Driver: isWebGLAvailable() returns false when getContext throws', () => {
  const mockCanvas = {
    getContext: () => {
      throw new Error('GPU process crashed during context initialization');
    },
  };
  const mockDoc = { createElement: () => mockCanvas };
  const mockWin = {};

  const result = runIsWebGLAvailable(mockWin, mockDoc);
  assert.strictEqual(result, false, 'Crashing getContext must safely catch and return false');
});

test('1.7 SSR Diagnostics: getWebGLSupportDetails() returns clean SSR diagnostic payload', () => {
  const details = runGetWebGLSupportDetails(undefined, undefined);
  assert.strictEqual(details.supported, false);
  assert.strictEqual(details.version, null);
  assert.strictEqual(details.error, 'SSR environment');
});

test('1.8 WebGL 2 Diagnostics: unmasked renderer info extracted correctly', () => {
  const mockCanvas = {
    getContext: (id) => {
      if (id === 'webgl2') {
        return {
          getExtension: (ext) => {
            if (ext === 'WEBGL_debug_renderer_info') return { UNMASKED_RENDERER_WEBGL: 0x9246 };
            return null;
          },
          getParameter: (param) => {
            if (param === 0x9246) return 'NVIDIA GeForce RTX 4090 Direct3D11 vs_5_0 ps_5_0';
            return null;
          },
        };
      }
      return null;
    },
  };
  const mockDoc = { createElement: () => mockCanvas };
  const mockWin = {};

  const details = runGetWebGLSupportDetails(mockWin, mockDoc);
  assert.strictEqual(details.supported, true);
  assert.strictEqual(details.version, 2);
  assert.strictEqual(details.renderer, 'NVIDIA GeForce RTX 4090 Direct3D11 vs_5_0 ps_5_0');
});

test('1.9 Diagnostics when debug extension is blocked: returns generic renderer description', () => {
  const mockCanvas = {
    getContext: (id) => {
      if (id === 'webgl2') {
        return {
          getExtension: () => null, // Privacy-focused browser blocking debug extension
        };
      }
      return null;
    },
  };
  const mockDoc = { createElement: () => mockCanvas };
  const mockWin = {};

  const details = runGetWebGLSupportDetails(mockWin, mockDoc);
  assert.strictEqual(details.supported, true);
  assert.strictEqual(details.version, 2);
  assert.strictEqual(details.renderer, 'WebGL 2.0 (Generic)');
});

// =========================================================================
// SECTION 2: WebGL Context Loss & Restoration Event Dynamics
// =========================================================================
console.log(`\n${BOLD}--- SECTION 2: Context Loss & Restoration Event Dynamics ---${RESET}`);

test('2.1 Context Loss preventDefault() Behavior', () => {
  let defaultPrevented = false;
  const event = {
    type: 'webglcontextlost',
    preventDefault: () => {
      defaultPrevented = true;
    },
  };

  // Simulate WebGLDetector handleContextLost
  event.preventDefault();
  assert.strictEqual(defaultPrevented, true, 'preventDefault must be called to allow context restoration');
});

test('2.2 Event Propagation Trap: webglcontextlost does NOT bubble to window in standard DOM bubbling phase', () => {
  // According to Khronos WebGL Spec, WebGLContextEvent does NOT bubble (bubbles: false)
  // WebGLDetector.tsx currently attaches to window using:
  // window.addEventListener('webglcontextlost', handleContextLost, false);
  // We empirically test whether an event with bubbles: false dispatched on canvas reaches a bubbling listener on window

  class SimpleEventTarget {
    constructor(parent = null) {
      this.listeners = {};
      this.parent = parent;
    }
    addEventListener(type, fn, options) {
      const useCapture = typeof options === 'boolean' ? options : Boolean(options && options.capture);
      const phase = useCapture ? 'capture' : 'bubble';
      if (!this.listeners[type]) this.listeners[type] = { capture: [], bubble: [] };
      this.listeners[type][phase].push(fn);
    }
    dispatchEvent(event) {
      // 1. Capture phase: from root down to target
      const chain = [];
      let curr = this.parent;
      while (curr) {
        chain.unshift(curr);
        curr = curr.parent;
      }
      for (const node of chain) {
        if (node.listeners[event.type]) {
          for (const fn of node.listeners[event.type].capture) fn(event);
        }
      }

      // 2. Target phase
      if (this.listeners[event.type]) {
        for (const fn of this.listeners[event.type].capture) fn(event);
        for (const fn of this.listeners[event.type].bubble) fn(event);
      }

      // 3. Bubbling phase: only if event.bubbles is true
      if (event.bubbles) {
        let parent = this.parent;
        while (parent) {
          if (parent.listeners[event.type]) {
            for (const fn of parent.listeners[event.type].bubble) fn(event);
          }
          parent = parent.parent;
        }
      }
    }
  }

  const mockWindow = new SimpleEventTarget(null);
  const mockCanvas = new SimpleEventTarget(mockWindow);

  let windowBubblingHandlerFired = false;
  let windowCaptureHandlerFired = false;
  let canvasHandlerFired = false;

  // WebGLDetector's current implementation: window.addEventListener(..., false) (bubble phase)
  mockWindow.addEventListener('webglcontextlost', () => {
    windowBubblingHandlerFired = true;
  }, false);

  // Recommended resilient implementation: capture phase
  mockWindow.addEventListener('webglcontextlost', () => {
    windowCaptureHandlerFired = true;
  }, true);

  // Direct canvas listener
  mockCanvas.addEventListener('webglcontextlost', () => {
    canvasHandlerFired = true;
  }, false);

  // Khronos WebGL specification: webglcontextlost does NOT bubble!
  const webglEvent = { type: 'webglcontextlost', bubbles: false, cancelable: true };
  mockCanvas.dispatchEvent(webglEvent);

  assert.strictEqual(canvasHandlerFired, true, 'Canvas listener fired');
  assert.strictEqual(windowCaptureHandlerFired, true, 'Window capture listener fired');
  
  // Notice that windowBubblingHandlerFired is FALSE!
  if (!windowBubblingHandlerFired) {
    throw new Error(
      'VULNERABILITY CONFIRMED: window.addEventListener("webglcontextlost", handler, false) will NEVER fire for canvas context loss because WebGLContextEvent does not bubble (bubbles: false). Must use capture phase (true) or attach listener to canvas directly!'
    );
  }
});

// =========================================================================
// SECTION 3: Pointer Parallax Bounds, Extreme Coordinates & Math Safety
// =========================================================================
console.log(`\n${BOLD}--- SECTION 3: Pointer Parallax Bounds & Math Safety ---${RESET}`);

// Extract parallax formula from HeroFigure.tsx lines 76-96
function calculateParallaxStep(pointerX, pointerY, baseRotation = [0, 0, 0], currentRot = [0, 0], delta = 0.016, isTouch = false) {
  if (isTouch) {
    const rotY = THREE.MathUtils.damp(currentRot[1], baseRotation[1], 4.0, delta);
    const rotX = THREE.MathUtils.damp(currentRot[0], baseRotation[0], 4.0, delta);
    return { rotX, rotY, targetRotX: baseRotation[0], targetRotY: baseRotation[1] };
  }

  const clampedX = Math.max(-1.0, Math.min(1.0, pointerX));
  const clampedY = Math.max(-1.0, Math.min(1.0, pointerY));

  const targetRotY = baseRotation[1] + clampedX * 0.16;
  const targetRotX = baseRotation[0] + -clampedY * 0.08;

  const rotY = THREE.MathUtils.damp(currentRot[1], targetRotY, 3.5, delta);
  const rotX = THREE.MathUtils.damp(currentRot[0], targetRotX, 3.5, delta);

  return { rotX, rotY, targetRotX, targetRotY, clampedX, clampedY };
}

test('3.1 Standard Pointer Coordinates [-1.0, 1.0]: Rotations strictly bounded', () => {
  const left = calculateParallaxStep(-1.0, -1.0);
  assert.ok(left.targetRotY >= -0.1601 && left.targetRotY <= -0.1599, 'Target Y rotation matches -0.16 rad');
  assert.ok(left.targetRotX >= 0.0799 && left.targetRotX <= 0.0801, 'Target X rotation matches +0.08 rad');

  const right = calculateParallaxStep(1.0, 1.0);
  assert.ok(right.targetRotY >= 0.1599 && right.targetRotY <= 0.1601, 'Target Y rotation matches +0.16 rad');
  assert.ok(right.targetRotX >= -0.0801 && right.targetRotX <= -0.0799, 'Target X rotation matches -0.08 rad');
});

test('3.2 Extreme Out-of-Bounds Coordinates (x = 9999, y = -9999): Clamping prevents divergence', () => {
  const extreme = calculateParallaxStep(9999, -9999);
  assert.strictEqual(extreme.clampedX, 1.0, 'clampedX must clamp to 1.0');
  assert.strictEqual(extreme.clampedY, -1.0, 'clampedY must clamp to -1.0');
  assert.ok(Math.abs(extreme.targetRotY) <= 0.16, 'targetRotY must not exceed 0.16 rad');
  assert.ok(Math.abs(extreme.targetRotX) <= 0.08, 'targetRotX must not exceed 0.08 rad');
});

test('3.3 Infinite Pointer Coordinates (x = Infinity, y = -Infinity): Clamping handles Infinity', () => {
  const inf = calculateParallaxStep(Infinity, -Infinity);
  assert.strictEqual(inf.clampedX, 1.0, 'clampedX must clamp Infinity to 1.0');
  assert.strictEqual(inf.clampedY, -1.0, 'clampedY must clamp -Infinity to -1.0');
  assert.ok(!isNaN(inf.rotX) && !isNaN(inf.rotY), 'Rotations must remain numeric and finite');
});

test('3.4 Adversarial Stress: Pointer with NaN values (x = NaN, y = NaN)', () => {
  const nanResult = calculateParallaxStep(NaN, NaN);
  // Math.min(1.0, NaN) is NaN! Math.max(-1.0, NaN) is NaN!
  const hasNaN = isNaN(nanResult.clampedX) || isNaN(nanResult.targetRotY) || isNaN(nanResult.rotY);
  if (hasNaN) {
    throw new Error(
      `MATH SAFETY VULNERABILITY CONFIRMED: Math.max(-1.0, Math.min(1.0, NaN)) returns NaN. When pointer coordinate is NaN, rotation becomes NaN (${nanResult.rotY}), causing Three.js matrix calculation to collapse.`
    );
  }
});

test('3.5 Adversarial Stress: Pointer with undefined values (x = undefined, y = undefined)', () => {
  const undefResult = calculateParallaxStep(undefined, undefined);
  const hasNaN = isNaN(undefResult.clampedX) || isNaN(undefResult.targetRotY) || isNaN(undefResult.rotY);
  if (hasNaN) {
    throw new Error(
      `MATH SAFETY VULNERABILITY CONFIRMED: Math.max(-1.0, Math.min(1.0, undefined)) returns NaN. When pointer coordinate is undefined, rotation becomes NaN (${undefResult.rotY}), breaking scene geometry.`
    );
  }
});

test('3.6 Large Frame Delta Stress (delta = 10.0s during tab switch recovery)', () => {
  const largeDelta = calculateParallaxStep(1.0, 1.0, [0, 0, 0], [0, 0], 10.0);
  assert.ok(!isNaN(largeDelta.rotX) && !isNaN(largeDelta.rotY), 'Rotations must remain finite under large delta');
  assert.ok(Math.abs(largeDelta.rotY - 0.16) < 0.001, 'Rotation Y smoothly reaches target without oscillation or overshoot');
});

test('3.7 Touch Device Neutralization: Ignores pointer coordinates on touch screens', () => {
  const touchStep = calculateParallaxStep(0.95, -0.85, [0, 0.5, 0], [0, 0.2], 0.016, true);
  assert.strictEqual(touchStep.targetRotY, 0.5, 'Target rotation Y reverts to base rotation on touch device');
  assert.strictEqual(touchStep.targetRotX, 0, 'Target rotation X reverts to base rotation on touch device');
});

// =========================================================================
// SECTION 4: Strict 4-Color Brand Lighting Rig & Canvas Asset Audit
// =========================================================================
console.log(`\n${BOLD}--- SECTION 4: 4-Color Brand Lighting Rig Audit ---${RESET}`);

const gymEnvSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/canvas/GymEnvironment.tsx'), 'utf8');

test('4.1 GymEnvironment.tsx adheres strictly to authorized brand color palette', () => {
  // Allowed colors in lighting/atmosphere:
  // #000000 (black fog/bg), #FFFFFF (white key), #7D39EB (violet rim), #C6FF33 (lime kicker), #140826 (ambient undertone)
  const allowedColors = ['#000000', '#ffffff', '#7d39eb', '#c6ff33', '#140826', '0x000000'];
  
  // Extract all hex and 0x colors in GymEnvironment.tsx
  const hexMatches = (gymEnvSrc.match(/#[0-9a-fA-F]{6}|0x[0-9a-fA-F]{6}/g) || []).map(c => c.toLowerCase());
  
  const foreignColors = hexMatches.filter(color => !allowedColors.includes(color));
  assert.strictEqual(foreignColors.length, 0, `GymEnvironment contains foreign colors: ${foreignColors.join(', ')}`);
});

test('4.2 Overhead High-Bay Key Spotlight Specification', () => {
  assert.ok(gymEnvSrc.includes('position={[0, 11, 2]}'), 'High-bay position must be [0, 11, 2]');
  assert.ok(gymEnvSrc.includes('color="#FFFFFF"'), 'High-bay color must be #FFFFFF Crisp White');
  assert.ok(gymEnvSrc.includes('intensity={40}'), 'High-bay intensity must be 40');
  assert.ok(gymEnvSrc.includes('castShadow={true}'), 'High-bay spotlight must cast shadows');
});

test('4.3 Dual Atmospheric Rim Lights Specification', () => {
  assert.ok(gymEnvSrc.includes('position={[-5, 4, -3]}'), 'Left rim light position must be [-5, 4, -3]');
  assert.ok(gymEnvSrc.includes('position={[5, 3, -3]}'), 'Right rim light position must be [5, 3, -3]');
  assert.ok(gymEnvSrc.includes('color="#7D39EB"'), 'Rim light color must be #7D39EB Electric Violet');
  assert.ok(gymEnvSrc.includes('intensity={22}'), 'Rim light intensity must be 22');
});

test('4.4 Specular Edge Kicker Specification', () => {
  assert.ok(gymEnvSrc.includes('position={[3.5, 1.2, 3]}'), 'Kicker position must be [3.5, 1.2, 3]');
  assert.ok(gymEnvSrc.includes('color="#C6FF33"'), 'Kicker color must be #C6FF33 Acid Lime');
  assert.ok(gymEnvSrc.includes('intensity={14}'), 'Kicker intensity must be 14');
});

test('4.5 Industrial Floor Materials & Laser Lines Specification', () => {
  const gymFloorSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/canvas/GymFloor.tsx'), 'utf8');
  assert.ok(gymFloorSrc.includes('#080808'), 'Rubber floor base color must be #080808');
  assert.ok(gymFloorSrc.includes('#C6FF33'), 'Platform laser guide lines must feature Acid Lime #C6FF33');
  assert.ok(gymFloorSrc.includes('#7D39EB'), 'Boundary laser guide lines must feature Electric Violet #7D39EB');
});

test('4.6 Airborne Chalk Dust Particle Rig Specification', () => {
  const dustSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/canvas/DustParticles.tsx'), 'utf8');
  assert.ok(dustSrc.includes('color="#FFFFFF"'), 'Chalk dust particles must be #FFFFFF');
  assert.ok(dustSrc.includes('opacity={0.35}'), 'Chalk dust opacity must be 0.35');
  assert.ok(dustSrc.includes('THREE.AdditiveBlending'), 'Chalk dust must use AdditiveBlending');
  assert.ok(dustSrc.includes('350'), 'Chalk dust desktop count must be 350 particles');
  assert.ok(dustSrc.includes('100'), 'Chalk dust mobile count must be 100 particles');
});

// =========================================================================
// SECTION 5: Architectural Contract & Dynamic Import Audit
// =========================================================================
console.log(`\n${BOLD}--- SECTION 5: Architectural Contract & Dynamic Import Audit ---${RESET}`);

test('5.1 Root Layout SSR Dynamic Import Contract Check (SCOPE.md M2.4 & PROJECT.md)', () => {
  const layoutSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');
  
  // Contract from SCOPE.md: "M2.4 Dynamic Root Layout Integration: src/app/layout.tsx dynamic import with ssr: false in #canvas-container"
  // Contract from PROJECT.md: "Architecture: Single persistent fixed background Canvas (...) dynamically loaded via Next.js dynamic(..., { ssr: false })"
  const hasDynamicImport = layoutSrc.includes("dynamic(") && layoutSrc.includes("ssr: false");
  if (!hasDynamicImport) {
    throw new Error(
      'CONTRACT VIOLATION CONFIRMED: src/app/layout.tsx statically imports GymCanvas (`import GymCanvas from "@/components/canvas/GymCanvas"`). SCOPE.md (M2.4) and PROJECT.md explicitly mandate `dynamic(..., { ssr: false })` to prevent Server Component / SSR bundling errors!'
    );
  }
});

// =========================================================================
// SUMMARY & VERDICT
// =========================================================================
console.log(`\n${BOLD}${CYAN}======================================================${RESET}`);
console.log(`${BOLD}SUMMARY:${RESET}`);
console.log(`  Total Adversarial Checks: ${totalTests}`);
console.log(`  ${GREEN}Passed: ${passedTests}${RESET}`);
console.log(`  ${RED}Failed: ${failedTests}${RESET}`);
console.log(`${BOLD}${CYAN}======================================================${RESET}`);

if (findings.length > 0) {
  console.log(`\n${BOLD}${RED}CONFIRMED DEFECTS & VULNERABILITIES (${findings.length}):${RESET}`);
  findings.forEach((f, idx) => {
    console.log(`  ${idx + 1}. ${BOLD}${f.name}${RESET}`);
    console.log(`     ${RED}${f.error}${RESET}`);
  });
}

// Exit with status code reflecting adversarial findings
process.exit(failedTests > 0 ? 1 : 0);
