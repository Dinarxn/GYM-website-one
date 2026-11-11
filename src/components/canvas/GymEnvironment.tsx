'use client';

import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Cinematic 4-color Dark Industrial Gym Environment & Lighting Rig.
 * Strictly adheres to the 4 brand colors:
 * - #000000 Deep Obsidian (Background & Fog)
 * - #FFFFFF Crisp White (Overhead Industrial High-Bay Spotlight)
 * - #7D39EB Electric Violet (Dual Rim Lights & Ambient Undertone)
 * - #C6FF33 Acid Lime (Directional Specular Kicker)
 */
export function GymEnvironment() {
  const { scene } = useThree();
  const highBaySpotRef = useRef<THREE.SpotLight>(null!);
  const spotTargetRef = useRef<THREE.Object3D>(null!);

  useEffect(() => {
    // Configure scene background and exponential industrial fog
    scene.background = new THREE.Color('#000000');
    scene.fog = new THREE.FogExp2(0x000000, 0.035);

    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [scene]);

  useEffect(() => {
    if (highBaySpotRef.current && spotTargetRef.current) {
      highBaySpotRef.current.target = spotTargetRef.current;
      highBaySpotRef.current.target.updateMatrixWorld();
    }
  }, []);

  return (
    <>
      {/* Target anchor for the high-bay spotlight aimed at athletic hero center */}
      <object3D ref={spotTargetRef} position={[0, 1.6, 0]} />

      {/* Subtle Midnight Violet Ambient Fill to keep industrial shadows deep and branded */}
      <ambientLight color="#140826" intensity={0.12} />

      {/* Key Light: Overhead Industrial High-Bay Spotlight (#FFFFFF Crisp White) */}
      <spotLight
        ref={highBaySpotRef}
        position={[0, 11, 2]}
        color="#FFFFFF"
        intensity={40}
        angle={Math.PI / 5}
        penumbra={0.65}
        castShadow={true}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Rim Light 1: Left Atmospheric Rim Spotlight (#7D39EB Electric Violet) */}
      <spotLight
        position={[-5, 4, -3]}
        color="#7D39EB"
        intensity={22}
        distance={20}
        angle={Math.PI / 3.5}
        penumbra={0.7}
      />

      {/* Rim Light 2: Right/Rear Kicker Spotlight (#7D39EB Electric Violet) */}
      <spotLight
        position={[5, 3, -3]}
        color="#7D39EB"
        intensity={22}
        distance={20}
        angle={Math.PI / 3.5}
        penumbra={0.7}
      />

      {/* Specular Edge Kicker: Directional Light (#C6FF33 Acid Lime) */}
      <directionalLight
        position={[3.5, 1.2, 3]}
        color="#C6FF33"
        intensity={14}
      />
    </>
  );
}

export default GymEnvironment;
