/**
 * Deterministic WebGL 1/2 context mock with WEBGL_lose_context simulator and capability tester.
 */

class MockWebGLContext {
  constructor(version = 2, options = {}, canvas = null) {
    this.version = version;
    this.options = {
      alpha: true,
      antialias: true,
      depth: true,
      stencil: false,
      powerPreference: 'high-performance',
      ...options,
    };
    this.canvas = canvas;
    this.isContextLostState = false;

    // Constants
    this.COLOR_BUFFER_BIT = 0x00004000;
    this.DEPTH_BUFFER_BIT = 0x00000100;
    this.STENCIL_BUFFER_BIT = 0x00000400;
    this.TRIANGLES = 0x0004;
    this.FLOAT = 0x1406;
    this.STATIC_DRAW = 0x88e4;

    this._extensions = {
      WEBGL_lose_context: {
        loseContext: () => {
          this.isContextLostState = true;
          if (this.canvas && typeof this.canvas.dispatchEvent === 'function') {
            const event = {
              type: 'webglcontextlost',
              defaultPrevented: false,
              preventDefault: function () {
                this.defaultPrevented = true;
              },
            };
            this.canvas.dispatchEvent(event);
          }
        },
        restoreContext: () => {
          this.isContextLostState = false;
          if (this.canvas && typeof this.canvas.dispatchEvent === 'function') {
            const event = { type: 'webglcontextrestored' };
            this.canvas.dispatchEvent(event);
          }
        },
      },
    };
  }

  isContextLost() {
    return this.isContextLostState;
  }

  getExtension(name) {
    if (this.isContextLostState) return null;
    return this._extensions[name] || null;
  }

  getSupportedExtensions() {
    return Object.keys(this._extensions);
  }

  viewport(x, y, width, height) {
    this._viewport = [x, y, width, height];
  }

  clearColor(r, g, b, a) {
    this._clearColor = [r, g, b, a];
  }

  clear() {}

  createShader() {
    return { id: Math.random() };
  }

  shaderSource() {}
  compileShader() {}
  createProgram() {
    return { id: Math.random() };
  }
  attachShader() {}
  linkProgram() {}
  useProgram() {}
  createBuffer() {
    return { id: Math.random() };
  }
  bindBuffer() {}
  bufferData() {}
  enable() {}
  disable() {}
  getProgramParameter() {
    return true;
  }
  getShaderParameter() {
    return true;
  }
  getParameter(param) {
    if (param === 0x1f02) return 'WebGL 2.0 (Mock GPU)';
    if (param === 0x1f01) return 'Mock Renderer';
    if (param === 0x1f00) return 'Mock Vendor';
    return null;
  }
}

function createMockWebGLContext(version = 2, options = {}, canvas = null) {
  return new MockWebGLContext(version, options, canvas);
}

module.exports = {
  MockWebGLContext,
  createMockWebGLContext,
};
