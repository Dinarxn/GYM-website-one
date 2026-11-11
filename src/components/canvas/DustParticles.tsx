'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface DustParticlesProps {
  count?: number;
}

/**
 * Airborne chalk dust particle system.
 * Simulates micro-particles of lifting chalk suspended in the
 * overhead high-bay industrial spotlight cone.
 */
export function DustParticles({ count: customCount }: DustParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const particleCount = useMemo(() => {
    if (customCount !== undefined) return customCount;
    return isMobile ? 100 : 350;
  }, [customCount, isMobile]);

  // Generate particle coordinate buffers and drift velocity offsets
  const [positions, phases, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const ph = new Float32Array(particleCount * 3);
    const sp = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Scatter within the high-bay cone: X: [-3.5, 3.5], Y: [0.5, 9.5], Z: [-3.5, 3.5]
      pos[i3] = (Math.random() - 0.5) * 7.0;
      pos[i3 + 1] = 0.5 + Math.random() * 9.0;
      pos[i3 + 2] = (Math.random() - 0.5) * 7.0;

      // Unique sinusoidal phase offsets
      ph[i3] = Math.random() * Math.PI * 2;
      ph[i3 + 1] = Math.random() * Math.PI * 2;
      ph[i3 + 2] = Math.random() * Math.PI * 2;

      // Subtle float speed
      sp[i] = 0.2 + Math.random() * 0.4;
    }
    return [pos, ph, sp];
  }, [particleCount]);

  // Base positions stored to allow persistent cyclic drift without divergence
  const basePositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const positionAttr = geo.attributes.position as THREE.BufferAttribute;
    if (!positionAttr) return;

    const time = state.clock.getElapsedTime();
    const posArray = positionAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const speed = speeds[i];

      // Subtle sinusoidal chalk dust hovering motion
      posArray[i3] = basePositions[i3] + Math.sin(time * speed * 0.7 + phases[i3]) * 0.15;
      posArray[i3 + 1] = basePositions[i3 + 1] + Math.sin(time * speed + phases[i3 + 1]) * 0.22;
      posArray[i3 + 2] = basePositions[i3 + 2] + Math.cos(time * speed * 0.8 + phases[i3 + 2]) * 0.15;
    }

    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#FFFFFF"
        transparent={true}
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default DustParticles;
