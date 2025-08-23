import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG } from '../../config/gameConfig';

/**
 * Enhanced Pillar Component - Beautiful Design with Dynamic Animations
 */
export default function Pillar({ position, radius, color, opacity = 1, pillarIndex = 0 }) {
  const groupRef = useRef();
  const capRef = useRef();
  const glowRef = useRef();

  // Enhanced geometry with more segments for ultra-smooth appearance
  const geometry = useMemo(() => {
    return new THREE.CylinderGeometry(
      radius, 
      radius * 1.15, // More pronounced taper for better visual hierarchy
      CONFIG.PILLAR_HEIGHT, 
      32, // Even more segments for ultra-smooth curves
      4 // Height segments for better lighting
    );
  }, [radius]);

  // Enhanced material with metallic finish
  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      transparent: opacity < 1,
      opacity: opacity,
      shininess: 60,
      specular: new THREE.Color(color).multiplyScalar(0.5),
      emissive: new THREE.Color(color).multiplyScalar(0.08)
    });
  }, [color, opacity]);

  // Enhanced top cap geometry
  const capGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, 0.8, 32);
  }, [radius]);

  // Enhanced cap material with stronger glow
  const capMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color(color).multiplyScalar(1.3),
      emissive: new THREE.Color(color).multiplyScalar(0.15),
      transparent: opacity < 1,
      opacity: opacity,
      shininess: 100
    });
  }, [color, opacity]);

  // Glow ring geometry for visual enhancement
  const glowGeometry = useMemo(() => {
    return new THREE.RingGeometry(radius * 0.8, radius * 1.3, 24);
  }, [radius]);

  // Glow ring material
  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: opacity * 0.2,
      side: THREE.DoubleSide
    });
  }, [color, opacity]);

  // Animation loop for dynamic effects
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Subtle pillar animation based on index (staggered effect)
    const time = state.clock.elapsedTime;
    const stagger = pillarIndex * 0.5;
    
    // Gentle floating animation
    const floatY = Math.sin(time * 0.8 + stagger) * 0.1;
    groupRef.current.position.y = floatY;
    
    // Subtle rotation for visual interest
    groupRef.current.rotation.y += delta * 0.2;
    
    // Cap animation
    if (capRef.current) {
      capRef.current.rotation.y += delta * 0.5;
      const capFloat = Math.sin(time * 1.2 + stagger) * 0.05;
      capRef.current.position.y = CONFIG.PILLAR_HEIGHT + 0.4 + capFloat;
    }
    
    // Glow ring animation
    if (glowRef.current) {
      glowRef.current.rotation.z += delta * 0.8;
      const glowPulse = 1 + Math.sin(time * 2 + stagger) * 0.3;
      glowRef.current.scale.setScalar(glowPulse);
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Main pillar body with enhanced design */}
      <mesh
        position={[0, CONFIG.PILLAR_HEIGHT / 2, 0]}
        geometry={geometry}
        material={material}
        castShadow
        receiveShadow
      />
      
      {/* Enhanced top cap with animation */}
      <mesh
        ref={capRef}
        position={[0, CONFIG.PILLAR_HEIGHT + 0.4, 0]}
        geometry={capGeometry}
        material={capMaterial}
        castShadow
      />
      
      {/* Glow ring at base for visual enhancement */}
      <mesh
        ref={glowRef}
        position={[0, 0.1, 0]}
        geometry={glowGeometry}
        material={glowMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
}