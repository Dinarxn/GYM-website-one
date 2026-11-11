'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface GymFloorProps {
  size?: number;
}

/**
 * Heavy industrial gym floor with high-density rubber matting
 * and embedded procedural laser guide lines in acid lime and electric violet.
 */
export function GymFloor({ size = 60 }: GymFloorProps) {
  // Pre-calculate laser line dimensions and positions
  const laserGrid = useMemo(() => {
    return [
      // Primary lifting platform perimeter box in Acid Lime (#C6FF33)
      { pos: [0, 0.005, -3] as [number, number, number], rot: [-Math.PI / 2, 0, 0] as [number, number, number], size: [6.4, 0.04] as [number, number], color: '#C6FF33' },
      { pos: [0, 0.005, 3] as [number, number, number], rot: [-Math.PI / 2, 0, 0] as [number, number, number], size: [6.4, 0.04] as [number, number], color: '#C6FF33' },
      { pos: [-3.2, 0.005, 0] as [number, number, number], rot: [-Math.PI / 2, 0, 0] as [number, number, number], size: [0.04, 6.0] as [number, number], color: '#C6FF33' },
      { pos: [3.2, 0.005, 0] as [number, number, number], rot: [-Math.PI / 2, 0, 0] as [number, number, number], size: [0.04, 6.0] as [number, number], color: '#C6FF33' },

      // Outer platform boundary lines in Electric Violet (#7D39EB)
      { pos: [0, 0.004, -5.5] as [number, number, number], rot: [-Math.PI / 2, 0, 0] as [number, number, number], size: [11.0, 0.03] as [number, number], color: '#7D39EB' },
      { pos: [0, 0.004, 5.5] as [number, number, number], rot: [-Math.PI / 2, 0, 0] as [number, number, number], size: [11.0, 0.03] as [number, number], color: '#7D39EB' },
      { pos: [-5.5, 0.004, 0] as [number, number, number], rot: [-Math.PI / 2, 0, 0] as [number, number, number], size: [0.03, 11.0] as [number, number], color: '#7D39EB' },
      { pos: [5.5, 0.004, 0] as [number, number, number], rot: [-Math.PI / 2, 0, 0] as [number, number, number], size: [0.03, 11.0] as [number, number], color: '#7D39EB' },

      // Subtle diagonal corner hazard markers
      { pos: [-4.2, 0.006, -4.2] as [number, number, number], rot: [-Math.PI / 2, 0, Math.PI / 4] as [number, number, number], size: [0.8, 0.05] as [number, number], color: '#C6FF33' },
      { pos: [4.2, 0.006, -4.2] as [number, number, number], rot: [-Math.PI / 2, 0, -Math.PI / 4] as [number, number, number], size: [0.8, 0.05] as [number, number], color: '#C6FF33' },
      { pos: [-4.2, 0.006, 4.2] as [number, number, number], rot: [-Math.PI / 2, 0, -Math.PI / 4] as [number, number, number], size: [0.8, 0.05] as [number, number], color: '#7D39EB' },
      { pos: [4.2, 0.006, 4.2] as [number, number, number], rot: [-Math.PI / 2, 0, Math.PI / 4] as [number, number, number], size: [0.8, 0.05] as [number, number], color: '#7D39EB' },
    ];
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Heavy 60x60 Industrial Rubber Flooring Base */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          color="#080808"
          roughness={0.85}
          metalness={0.15}
          dithering={true}
        />
      </mesh>

      {/* Embedded High-Visibility Laser Guide Lines */}
      {laserGrid.map((laser, idx) => (
        <mesh
          key={idx}
          position={laser.pos}
          rotation={laser.rot}
        >
          <planeGeometry args={laser.size} />
          <meshBasicMaterial
            color={laser.color}
            toneMapped={false}
            transparent={true}
            opacity={0.88}
          />
        </mesh>
      ))}

      {/* Center Stance Platform Inset Plate (Dark Brushed Composite) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.002, 0]}
        receiveShadow
      >
        <planeGeometry args={[5.8, 5.4]} />
        <meshStandardMaterial
          color="#0c0c0e"
          roughness={0.78}
          metalness={0.25}
        />
      </mesh>
    </group>
  );
}

export default GymFloor;
