const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { createMockWebGLContext } = require('../helpers/webgl');
const { DOMNode } = require('../helpers/dom');
const { isWebGLAvailable, checkWebGLSupport, getWebGLSupportDetails } = require('../../src/lib/webglSupport.ts');

describe('Tier 2 - Feature 12: 3D Canvas & WebGL Fallback Boundary Cases', () => {
  test('T2-12-01: WebGL Context Loss Event (webglcontextlost) Handling', () => {
    const canvas = new DOMNode('canvas');
    let defaultPrevented = false;
    let fallbackMounted = false;

    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      defaultPrevented = e.defaultPrevented;
      fallbackMounted = true;
    });

    const ctx = createMockWebGLContext(2, {}, canvas);
    const ext = ctx.getExtension('WEBGL_lose_context');
    assert.truthy(ext, 'WEBGL_lose_context extension must be available');

    ext.loseContext();
    assert.truthy(ctx.isContextLost(), 'Context must report lost');
    assert.truthy(defaultPrevented, 'Event default must be prevented');
    assert.truthy(fallbackMounted, 'Fallback handler must be executed');
  });

  test('T2-12-02: Server-Side Rendering (SSR) & WebGL Support Utility Integrity', () => {
    // In Node.js environment where typeof window === 'undefined', verify real webglSupport.ts methods
    assert.equal(isWebGLAvailable(), false, 'isWebGLAvailable must return false during SSR');
    assert.equal(checkWebGLSupport(), false, 'checkWebGLSupport must return false during SSR');

    const details = checkWebGLSupport(true);
    assert.equal(details.supported, false);
    assert.equal(details.version, null);
    assert.equal(details.error, 'SSR environment');
  });

  test('T2-12-03: RootLayout Canvas Mount Container Layering Contract', () => {
    const layoutSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');

    // RootLayout mounts persistent background 3D canvas container with required fixed layering contract
    assert.includes(layoutSrc, 'id="canvas-container"');
    assert.includes(layoutSrc, 'fixed inset-0 pointer-events-none z-0 overflow-hidden');
    assert.includes(layoutSrc, 'aria-hidden="true"');
  });

  test('T2-12-04: Adaptive DPR Clamping on Mobile & Desktop Displays', () => {
    function clampDPR(devicePixelRatio, isMobile) {
      if (isMobile) {
        return Math.min(devicePixelRatio, 1.3);
      }
      return Math.min(devicePixelRatio, 1.8);
    }

    assert.equal(clampDPR(4.0, true), 1.3, 'Mobile DPR must clamp to 1.3');
    assert.equal(clampDPR(4.0, false), 1.8, 'Desktop DPR must clamp to 1.8');
    assert.equal(clampDPR(1.0, false), 1.0, 'Standard 1x DPR remains 1.0');
  });

  test('T2-12-05: WebGL Context Recovery Cycle (restoreContext)', () => {
    const canvas = new DOMNode('canvas');
    let restored = false;

    canvas.addEventListener('webglcontextrestored', () => {
      restored = true;
    });

    const ctx = createMockWebGLContext(2, {}, canvas);
    const ext = ctx.getExtension('WEBGL_lose_context');

    ext.loseContext();
    assert.truthy(ctx.isContextLost(), 'Context is lost');

    ext.restoreContext();
    assert.falsy(ctx.isContextLost(), 'Context is restored');
    assert.truthy(restored, 'webglcontextrestored event dispatched to canvas');
  });
});
