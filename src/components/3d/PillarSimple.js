import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CONFIG } from '../../config/gameConfig';

/**
 * Enhanced Pillar Component - Beautiful Design with Proper Alignment
 */
export default function Pillar({ position, radius, color, opacity = 1 }) {
  // Enhanced geometry with more segments for smoother appearance
  const geometry = useMemo(() => {
    return new THREE.CylinderGeometry(
      radius, 
      radius * 1.1, // Slightly wider at bottom for stability look
      CONFIG.PILLAR_HEIGHT, 
      24, // More segments for smoother curves
      1
    );
  }, [radius]);

  // Enhanced material with better lighting
  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      transparent: opacity < 1,
      opacity: opacity,
      shininess: 30,
      specular: new THREE.Color(color).multiplyScalar(0.3),
      // Add subtle emissive glow
      emissive: new THREE.Color(color).multiplyScalar(0.05)
    });
  }, [color, opacity]);

  // Top cap geometry for better visual
  const capGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(radius * 0.95, radius * 0.95, 0.5, 24);
  }, [radius]);

  // Top cap material with slight glow
  const capMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color(color).multiplyScalar(1.2),
      emissive: new THREE.Color(color).multiplyScalar(0.1),
      transparent: opacity < 1,
      opacity: opacity
    });
  }, [color, opacity]);

  return (
    <group position={position}>
      {/* Main pillar body */}
      <mesh
        position={[0, CONFIG.PILLAR_HEIGHT / 2, 0]} // Proper alignment - pillar base at y=0
        geometry={geometry}
        material={material}
        castShadow
        receiveShadow
      />
      
      {/* Top cap for better visual */}
      <mesh
        position={[0, CONFIG.PILLAR_HEIGHT + 0.25, 0]}
        geometry={capGeometry}
        material={capMaterial}
        castShadow
      />
    </group>
  );
}