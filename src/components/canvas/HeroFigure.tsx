'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface HeroFigureProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

/**
 * 3D Athletic Hero Figure in grounded power stance.
 * Sculpted procedurally from precision organic primitives with obsidian gunmetal PBR material,
 * catching high-bay crisp white key light, electric violet left rim, and acid lime right kicker.
 * Features smooth damped pointer parallax tracking and touch device neutralization.
 */
export function HeroFigure({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: HeroFigureProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    }
  }, []);

  // Shared obsidian gunmetal PBR material specifications
  const gunmetalMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#121216'),
      roughness: 0.32,
      metalness: 0.82,
      dithering: true,
    });
  }, []);

  // Subtle lime specular accent material for high-tension tendon/brace bands
  const limeAccentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C6FF33'),
      roughness: 0.25,
      metalness: 0.65,
      emissive: new THREE.Color('#C6FF33'),
      emissiveIntensity: 0.18,
    });
  }, []);

  // Subtle violet accent material for lifting wrist wraps / harness accents
  const violetAccentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#7D39EB'),
      roughness: 0.35,
      metalness: 0.55,
      emissive: new THREE.Color('#7D39EB'),
      emissiveIntensity: 0.22,
    });
  }, []);

  // Damped pointer parallax movement in useFrame
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isTouchDevice) {
      // Neutralize parallax on touch devices
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, rotation[1], 4.0, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, rotation[0], 4.0, delta);
      return;
    }

    // Clamp pointer coordinates to [-1.0, 1.0] to prevent extreme distortion
    const clampedX = Math.max(-1.0, Math.min(1.0, state.pointer.x));
    const clampedY = Math.max(-1.0, Math.min(1.0, state.pointer.y));

    // Calculate subtle target rotation: Y bounded by 0.16 rad, X bounded by 0.08 rad
    const targetRotY = rotation[1] + clampedX * 0.16;
    const targetRotX = rotation[0] + -clampedY * 0.08;

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      3.5,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      3.5,
      delta
    );
  });

  const parsedScale: [number, number, number] = useMemo(() => {
    if (typeof scale === 'number') {
      return [scale, scale, scale];
    }
    return scale;
  }, [scale]);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={parsedScale}
    >
      {/* ================= HEAD & NECK ================= */}
      {/* Athletic Cranium & Jawline */}
      <mesh position={[0, 2.76, 0.04]} material={gunmetalMaterial} castShadow>
        <sphereGeometry args={[0.13, 24, 24]} />
      </mesh>
      {/* Brow / Visor Ridge */}
      <mesh position={[0, 2.78, 0.13]} rotation={[0.2, 0, 0]} material={gunmetalMaterial}>
        <boxGeometry args={[0.16, 0.05, 0.08]} />
      </mesh>
      {/* Powerful Muscular Neck & Trapezius */}
      <mesh position={[0, 2.58, 0.0]} material={gunmetalMaterial} castShadow>
        <cylinderGeometry args={[0.11, 0.15, 0.22, 16]} />
      </mesh>

      {/* ================= UPPER TORSO / CHEST ================= */}
      {/* Massive Upper Chest / Clavicle Plate */}
      <mesh position={[0, 2.42, 0.06]} material={gunmetalMaterial} castShadow>
        <boxGeometry args={[0.54, 0.2, 0.28]} />
      </mesh>
      {/* Left Pectoralis Major */}
      <mesh position={[-0.14, 2.32, 0.14]} rotation={[0.1, 0.12, -0.05]} material={gunmetalMaterial} castShadow>
        <boxGeometry args={[0.24, 0.19, 0.14]} />
      </mesh>
      {/* Right Pectoralis Major */}
      <mesh position={[0.14, 2.32, 0.14]} rotation={[0.1, -0.12, 0.05]} material={gunmetalMaterial} castShadow>
        <boxGeometry args={[0.24, 0.19, 0.14]} />
      </mesh>
      {/* Center Sternum Recess */}
      <mesh position={[0, 2.32, 0.18]} material={limeAccentMaterial}>
        <boxGeometry args={[0.015, 0.14, 0.04]} />
      </mesh>

      {/* Wide Athletic V-Taper Lats (Left & Right) */}
      <mesh position={[-0.26, 2.22, -0.02]} rotation={[0, 0, -0.22]} material={gunmetalMaterial} castShadow>
        <cylinderGeometry args={[0.11, 0.07, 0.38, 16]} />
      </mesh>
      <mesh position={[0.26, 2.22, -0.02]} rotation={[0, 0, 0.22]} material={gunmetalMaterial} castShadow>
        <cylinderGeometry args={[0.11, 0.07, 0.38, 16]} />
      </mesh>

      {/* ================= CORE / ABDOMINALS ================= */}
      {/* Mid Torso Ribcage Core */}
      <mesh position={[0, 2.12, 0.02]} material={gunmetalMaterial} castShadow>
        <cylinderGeometry args={[0.22, 0.18, 0.26, 16]} />
      </mesh>
      {/* Upper Abs (Pair 1) */}
      <mesh position={[-0.07, 2.16, 0.15]} material={gunmetalMaterial}>
        <boxGeometry args={[0.11, 0.08, 0.04]} />
      </mesh>
      <mesh position={[0.07, 2.16, 0.15]} material={gunmetalMaterial}>
        <boxGeometry args={[0.11, 0.08, 0.04]} />
      </mesh>
      {/* Mid Abs (Pair 2) */}
      <mesh position={[-0.065, 2.06, 0.14]} material={gunmetalMaterial}>
        <boxGeometry args={[0.1, 0.08, 0.04]} />
      </mesh>
      <mesh position={[0.065, 2.06, 0.14]} material={gunmetalMaterial}>
        <boxGeometry args={[0.1, 0.08, 0.04]} />
      </mesh>
      {/* Lower Abs (Pair 3) */}
      <mesh position={[-0.06, 1.96, 0.13]} material={gunmetalMaterial}>
        <boxGeometry args={[0.09, 0.08, 0.04]} />
      </mesh>
      <mesh position={[0.06, 1.96, 0.13]} material={gunmetalMaterial}>
        <boxGeometry args={[0.09, 0.08, 0.04]} />
      </mesh>

      {/* Heavy Lifting Belt (Competition Powerlifting Spec) */}
      <mesh position={[0, 1.86, 0.03]} material={violetAccentMaterial} castShadow>
        <cylinderGeometry args={[0.2, 0.21, 0.12, 24]} />
      </mesh>
      {/* Belt Lever Buckle (#C6FF33 Lime Steel) */}
      <mesh position={[0, 1.86, 0.24]} material={limeAccentMaterial}>
        <boxGeometry args={[0.09, 0.09, 0.03]} />
      </mesh>

      {/* Pelvis & Hip Girdle */}
      <mesh position={[0, 1.72, 0.0]} material={gunmetalMaterial} castShadow>
        <boxGeometry args={[0.42, 0.18, 0.26]} />
      </mesh>

      {/* ================= SHOULDERS & ARMS (LEFT) ================= */}
      {/* Left Anterior/Lateral Deltoid Boulder */}
      <mesh position={[-0.38, 2.44, 0.06]} material={gunmetalMaterial} castShadow>
        <sphereGeometry args={[0.14, 20, 20]} />
      </mesh>
      {/* Left Bicep / Tricep Upper Arm */}
      <mesh position={[-0.43, 2.18, 0.08]} rotation={[0.1, 0, 0.18]} material={gunmetalMaterial} castShadow>
        <cylinderGeometry args={[0.1, 0.09, 0.36, 16]} />
      </mesh>
      {/* Left Elbow Joint */}
      <mesh position={[-0.48, 1.98, 0.06]} material={gunmetalMaterial}>
        <sphereGeometry args={[0.085, 16, 16]} />
      </mesh>
      {/* Left Forearm (Ready Grip Angled Inward) */}
      <mesh position={[-0.46, 1.76, 0.14]} rotation={[-0.32, 0.15, -0.2]} material={gunmetalMaterial} castShadow>
        <cylinderGeometry args={[0.085, 0.07, 0.34, 16]} />
      </mesh>
      {/* Left Wrist Wrap (#7D39EB) */}
      <mesh position={[-0.43, 1.58, 0.22]} rotation={[-0.32, 0.15, -0.2]} material={violetAccentMaterial}>
        <cylinderGeometry args={[0.075, 0.075, 0.06, 16]} />
      </mesh>
      {/* Left Clenched Fist in Power Stance */}
      <mesh position={[-0.41, 1.5, 0.26]} material={gunmetalMaterial} castShadow>
        <boxGeometry args={[0.1, 0.11, 0.1]} />
      </mesh>

      {/* ================= SHOULDERS & ARMS (RIGHT) ================= */}
      {/* Right Anterior/Lateral Deltoid Boulder */}
      <mesh position={[0.38, 2.44, 0.06]} material={gunmetalMaterial} castShadow>
        <sphereGeometry args={[0.14, 20, 20]} />
      </mesh>
      {/* Right Bicep / Tricep Upper Arm */}
      <mesh position={[0.43, 2.18, 0.08]} rotation={[0.1, 0, -0.18]} material={gunmetalMaterial} castShadow>
        <cylinderGeometry args={[0.1, 0.09, 0.36, 16]} />
      </mesh>
      {/* Right Elbow Joint */}
      <mesh position={[0.48, 1.98, 0.06]} material={gunmetalMaterial}>
        <sphereGeometry args={[0.085, 16, 16]} />
      </mesh>
      {/* Right Forearm (Ready Grip Angled Inward) */}
      <mesh position={[0.46, 1.76, 0.14]} rotation={[-0.32, -0.15, 0.2]} material={gunmetalMaterial} castShadow>
        <cylinderGeometry args={[0.085, 0.07, 0.34, 16]} />
      </mesh>
      {/* Right Wrist Wrap (#C6FF33 Accent) */}
      <mesh position={[0.43, 1.58, 0.22]} rotation={[-0.32, -0.15, 0.2]} material={limeAccentMaterial}>
        <cylinderGeometry args={[0.075, 0.075, 0.06, 16]} />
      </mesh>
      {/* Right Clenched Fist in Power Stance */}
      <mesh position={[0.41, 1.5, 0.26]} material={gunmetalMaterial} castShadow>
        <boxGeometry args={[0.1, 0.11, 0.1]} />
      </mesh>

      {/* ================= LEGS (SOLID BILATERAL POWER STANCE) ================= */}
      {/* Left Upper Quad (Angled outward for bilateral base width) */}
      <mesh position={[-0.19, 1.36, 0.04]} rotation={[0.08, 0, 0.14]} material={gunmetalMaterial} castShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.52, 16]} />
      </mesh>
      {/* Left Vastus Lateralis Sweep */}
      <mesh position={[-0.27, 1.34, 0.03]} rotation={[0, 0, 0.18]} material={gunmetalMaterial}>
        <boxGeometry args={[0.1, 0.36, 0.16]} />
      </mesh>
      {/* Left Knee Joint / Patella */}
      <mesh position={[-0.23, 1.05, 0.06]} material={gunmetalMaterial}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>
      {/* Left Knee Sleeve (#7D39EB Electric Violet) */}
      <mesh position={[-0.23, 1.05, 0.06]} material={violetAccentMaterial}>
        <cylinderGeometry args={[0.11, 0.105, 0.18, 16]} />
      </mesh>
      {/* Left Lower Calf & Shin */}
      <mesh position={[-0.25, 0.58, 0.02]} rotation={[-0.04, 0, 0.06]} material={gunmetalMaterial} castShadow>
        <cylinderGeometry args={[0.105, 0.08, 0.68, 16]} />
      </mesh>
      {/* Left Foot / Competition Lifting Shoe Planted Firmly */}
      <mesh position={[-0.27, 0.1, 0.09]} rotation={[0, 0.18, 0]} material={gunmetalMaterial} castShadow>
        <boxGeometry args={[0.16, 0.16, 0.34]} />
      </mesh>
      {/* Left Shoe Sole Accent (#7D39EB) */}
      <mesh position={[-0.27, 0.02, 0.09]} rotation={[0, 0.18, 0]} material={violetAccentMaterial}>
        <boxGeometry args={[0.17, 0.04, 0.35]} />
      </mesh>

      {/* Right Upper Quad (Angled outward for bilateral base width) */}
      <mesh position={[0.19, 1.36, 0.04]} rotation={[0.08, 0, -0.14]} material={gunmetalMaterial} castShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.52, 16]} />
      </mesh>
      {/* Right Vastus Lateralis Sweep */}
      <mesh position={[0.27, 1.34, 0.03]} rotation={[0, 0, -0.18]} material={gunmetalMaterial}>
        <boxGeometry args={[0.1, 0.36, 0.16]} />
      </mesh>
      {/* Right Knee Joint / Patella */}
      <mesh position={[0.23, 1.05, 0.06]} material={gunmetalMaterial}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>
      {/* Right Knee Sleeve (#C6FF33 Acid Lime) */}
      <mesh position={[0.23, 1.05, 0.06]} material={limeAccentMaterial}>
        <cylinderGeometry args={[0.11, 0.105, 0.18, 16]} />
      </mesh>
      {/* Right Lower Calf & Shin */}
      <mesh position={[0.25, 0.58, 0.02]} rotation={[-0.04, 0, -0.06]} material={gunmetalMaterial} castShadow>
        <cylinderGeometry args={[0.105, 0.08, 0.68, 16]} />
      </mesh>
      {/* Right Foot / Competition Lifting Shoe Planted Firmly */}
      <mesh position={[0.27, 0.1, 0.09]} rotation={[0, -0.18, 0]} material={gunmetalMaterial} castShadow>
        <boxGeometry args={[0.16, 0.16, 0.34]} />
      </mesh>
      {/* Right Shoe Sole Accent (#C6FF33) */}
      <mesh position={[0.27, 0.02, 0.09]} rotation={[0, -0.18, 0]} material={limeAccentMaterial}>
        <boxGeometry args={[0.17, 0.04, 0.35]} />
      </mesh>
    </group>
  );
}

export default HeroFigure;
