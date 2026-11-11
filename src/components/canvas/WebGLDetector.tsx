'use client';

import React, { useEffect, useState } from 'react';
import { isWebGLAvailable } from '@/lib/webglSupport';
import { FallbackHeroImage } from './FallbackHeroImage';

export interface WebGLDetectorProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  forceFallback?: boolean;
}

/**
 * WebGL capability detector and context loss guardian.
 * Safely evaluates WebGL availability in the browser, attaches
 * listeners for webglcontextlost / webglcontextrestored, and seamlessly
 * swaps in the branded FallbackHeroImage if WebGL is unavailable or lost.
 */
export function WebGLDetector({
  children,
  fallback,
  forceFallback = false,
}: WebGLDetectorProps) {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (forceFallback) {
      setHasWebGL(false);
      return;
    }

    const available = isWebGLAvailable();
    setHasWebGL(available);

    if (!available) return;

    // Listen for WebGL context loss and restoration across window/canvases
    const handleContextLost = (e: Event) => {
      // Prevent browser default behavior to allow subsequent context restoration
      e.preventDefault();
      setContextLost(true);
    };

    const handleContextRestored = () => {
      setContextLost(false);
    };

    window.addEventListener('webglcontextlost', handleContextLost, false);
    window.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      window.removeEventListener('webglcontextlost', handleContextLost, false);
      window.removeEventListener('webglcontextrestored', handleContextRestored, false);
    };
  }, [forceFallback]);

  // Server-side rendering or initial hydration: render fallback or container
  if (!mounted) {
    return <>{fallback || <FallbackHeroImage />}</>;
  }

  if (!hasWebGL || contextLost) {
    return <>{fallback || <FallbackHeroImage />}</>;
  }

  return <>{children}</>;
}

export default WebGLDetector;
