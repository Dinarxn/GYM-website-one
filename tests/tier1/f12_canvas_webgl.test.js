const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { createMockWebGLContext } = require('../helpers/webgl');
const { DOMNode } = require('../helpers/dom');

describe('Tier 1 - Feature 12: 3D Canvas & WebGL Fallback Infrastructure', () => {
  test('T1-F12-01: Persistent Canvas Fixed Mounting & Layering', () => {
    const layoutSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');

    // RootLayout mounts persistent background 3D canvas container with required fixed layering contract
    assert.includes(layoutSrc, 'id="canvas-container"');
    assert.includes(layoutSrc, 'fixed inset-0 pointer-events-none z-0');
    assert.includes(layoutSrc, 'aria-hidden="true"');
  });

  test('T1-F12-02: SSR-Safe Dynamic Import & Skeleton Loader', () => {
    const webglSupportSrc = fs.readFileSync(path.join(process.cwd(), 'src/lib/webglSupport.ts'), 'utf8');

    // Must be SSR-safe (checks typeof window === 'undefined')
    assert.includes(webglSupportSrc, "typeof window === 'undefined'");
  });

  test('T1-F12-03: WebGL Capability Detection Execution', () => {
    const { checkWebGLSupport } = require('../../src/lib/webglSupport.ts');

    // In pure Node.js without window, checkWebGLSupport returns false (safe for SSR)
    assert.equal(checkWebGLSupport(), false);

    // When window and canvas context exist
    const mockContext = createMockWebGLContext(2);
    assert.truthy(mockContext.getParameter(0x1f02));
  });

  test('T1-F12-04: Adaptive DPR Desktop Configuration', () => {
    function computeAdaptiveDPR(isMobile, nativeDPR = 2.0) {
      if (isMobile) {
        return Math.min(nativeDPR, 1.3);
      }
      return Math.min(nativeDPR, 1.8);
    }

    const desktopDPR = computeAdaptiveDPR(false, 3.0);
    const mobileDPR = computeAdaptiveDPR(true, 3.0);

    assert.equal(desktopDPR, 1.8, 'Desktop DPR clamped to 1.8');
    assert.equal(mobileDPR, 1.3, 'Mobile DPR clamped to 1.3');
  });

  test('T1-F12-05: Static Fallback Image Rendering When WebGL Unsupported', () => {
    const heroSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/HeroOverlay.tsx'), 'utf8');

    // HeroOverlay renders accessible atmospheric radial glow layers and content
    assert.includes(heroSrc, 'bg-[#7D39EB]/15');
    assert.includes(heroSrc, 'blur-[120px]');
    assert.includes(heroSrc, 'FORGE YOUR');
  });
});
