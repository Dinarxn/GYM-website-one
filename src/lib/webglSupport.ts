/**
 * WebGL capability detection and diagnostics utility.
 * Safe for SSR and edge environments.
 */

export interface WebGLSupportResult {
  supported: boolean;
  version: 1 | 2 | null;
  renderer?: string;
  error?: string;
}

/**
 * Detects whether WebGL / WebGL2 rendering is available in the current client browser.
 * Returns true if available, false if unsupported or during SSR.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Diagnostic check for WebGL support.
 * When called with no arguments or false, returns boolean (safe for SSR where it returns false).
 * When called with detailed = true, returns a full WebGLSupportResult object.
 */
export function checkWebGLSupport(): boolean;
export function checkWebGLSupport(detailed: true): WebGLSupportResult;
export function checkWebGLSupport(detailed?: boolean): boolean | WebGLSupportResult {
  if (typeof window === 'undefined') {
    if (detailed) {
      return { supported: false, version: null, error: 'SSR environment' };
    }
    return false;
  }

  if (detailed) {
    return getWebGLSupportDetails();
  }

  return isWebGLAvailable();
}

/**
 * Inspects WebGL version and GPU renderer information.
 */
export function getWebGLSupportDetails(): WebGLSupportResult {
  if (typeof window === 'undefined') {
    return { supported: false, version: null, error: 'SSR environment' };
  }

  try {
    const canvas = document.createElement('canvas');

    // Attempt WebGL 2 first
    const gl2 = canvas.getContext('webgl2') as WebGL2RenderingContext | null;
    if (gl2) {
      const debugInfo = gl2.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo
        ? (gl2.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string)
        : 'WebGL 2.0 (Generic)';
      return { supported: true, version: 2, renderer };
    }

    // Attempt WebGL 1
    const gl1 = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (gl1) {
      const debugInfo = gl1.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo
        ? (gl1.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string)
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
}
