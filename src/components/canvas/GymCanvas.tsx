'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { GymEnvironment } from './GymEnvironment';
import { GymFloor } from './GymFloor';
import { DustParticles } from './DustParticles';
import { HeroFigure } from './HeroFigure';
import { WebGLDetector } from './WebGLDetector';
import { FallbackHeroImage } from './FallbackHeroImage';

export interface GymCanvasProps {
  className?: string;
}

/**
 * Lightweight immediate CSS skeleton loader rendered while Three.js hydrates.
 * Eliminates flash of unstyled content with authentic brand colors.
 */
export function CanvasLoaderFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-black flex items-center justify-center pointer-events-none"
    >
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border border-white/10 border-t-[#C6FF33] animate-spin" />
        <div className="absolute w-24 h-24 rounded-full bg-[#7D39EB]/20 blur-xl pointer-events-none" />
      </div>
    </div>
  );
}

/**
 * Inner R3F Scene Controller managing the persistent industrial gym 3D scene.
 */
function GymScene() {
  return (
    <>
      <GymEnvironment />
      <GymFloor />
      <DustParticles />
      <HeroFigure position={[0, 0, 0]} />
    </>
  );
}

/**
 * Master persistent 3D Canvas component for IRONFORGE FITNESS.
 * Configured with adaptive DPR clamping, ACES Filmic tone mapping,
 * high-performance WebGL context flags, and bulletproof WebGL capability detection.
 */
export function GymCanvas({ className }: GymCanvasProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateDPR = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    updateDPR();
    window.addEventListener('resize', updateDPR);
    return () => window.removeEventListener('resize', updateDPR);
  }, []);

  if (!mounted) {
    return <CanvasLoaderFallback />;
  }

  return (
    <WebGLDetector fallback={<FallbackHeroImage />}>
      <div className={className || 'relative w-full h-full'}>
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          camera={{
            position: [0, 2.2, 7.5],
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          dpr={isMobile ? [1, 1.3] : [1, 1.8]}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.1;
          }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <GymScene />
          </Suspense>
        </Canvas>
      </div>
    </WebGLDetector>
  );
}

export default GymCanvas;
