import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { CONFIG } from '../../config/gameConfig';
import { pillarMemoryManager } from './PillarMemoryManager';
import { mobilePerformanceOptimizer } from './MobilePerformanceOptimizer';

/**
 * Optimized pillar renderer with LOD, material pooling, and mobile optimizations
 */
export default function PillarRenderer({ position, radius, color, opacity = 1, distance = 0 }) {
  const meshRef = useRef();
  const baseMeshRef = useRef();
  
  // Get optimized settings based on distance and device capabilities
  const segments = mobilePerformanceOptimizer.getPillarSegments(distance);
  const materialSettings = mobilePerformanceOptimizer.getMaterialSettings(distance, opacity);
  const shouldCastShadows = mobilePerformanceOptimizer.shouldEnableShadows(distance);
  
  // Get geometry from memory pool
  const geometry = useMemo(() => {
    return pillarMemoryManager.getGeometry(radius, segments);
  }, [radius, segments]);
  
  // Get base geometry for pillar base
  const baseGeometry = useMemo(() => {
    return pillarMemoryManager.getGeometry(radius * 1.1, Math.max(8, segments - 4));
  }, [radius, segments]);
  
  // Get material from memory pool
  const material = useMemo(() => {
    return pillarMemoryManager.getMaterial(color, opacity);
  }, [color, opacity]);
  
  // Get base material
  const baseMaterial = useMemo(() => {
    const baseColor = new THREE.Color(color).multiplyScalar(0.8);
    return pillarMemoryManager.getMaterial(baseColor.getHex(), opacity * 0.8);
  }, [color, opacity]);
  
  // Register/unregister instances for memory management
  useEffect(() => {
    if (meshRef.current) {
      pillarMemoryManager.registerInstance(meshRef.current);
    }
    if (baseMeshRef.current) {
      pillarMemoryManager.registerInstance(baseMeshRef.current);
    }
    
    return () => {
      if (meshRef.current) {
        pillarMemoryManager.unregisterInstance(meshRef.current);
      }
      if (baseMeshRef.current) {
        pillarMemoryManager.unregisterInstance(baseMeshRef.current);
      }
    };
  }, []);
  
  // Update material properties based on performance settings
  useEffect(() => {
    if (material) {
      // Replace Object.assign with manual property assignment for Hermes compatibility
      for (const key in materialSettings) {
        if (materialSettings.hasOwnProperty(key)) {
          material[key] = materialSettings[key];
        }
      }
      
      // Add subtle emission for distant pillars
      if (opacity < 0.8) {
        material.emissive = new THREE.Color(color).multiplyScalar(0.05);
      } else {
        material.emissive = new THREE.Color(0x000000);
      }
      
      material.needsUpdate = true;
    }
  }, [material, materialSettings, opacity, color]);
  
  // Animated position for subtle visual interest
  const animatedPosition = useMemo(() => {
    return [position[0], position[1], position[2]];
  }, [position]);
  
  // LOD-based visibility
  const isVisible = distance < mobilePerformanceOptimizer.getQualitySettings().pillarLODDistance * 2;
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <group position={animatedPosition}>
      {/* Main pillar */}
      <mesh 
        ref={meshRef}
        position={[0, CONFIG.PILLAR_HEIGHT / 2, 0]} 
        castShadow={shouldCastShadows}
        receiveShadow={mobilePerformanceOptimizer.getQualitySettings().enableShadows}
        geometry={geometry}
        material={material}
      />
      
      {/* Pillar base for better visual grounding */}
      <mesh 
        ref={baseMeshRef}
        position={[0, -0.5, 0]}
        castShadow={false}
        receiveShadow={mobilePerformanceOptimizer.getQualitySettings().enableShadows}
        geometry={baseGeometry}
        material={baseMaterial}
      />
    </group>
  );
}

/**
 * Enhanced Pillar component that integrates with the new rendering system
 */
export function EnhancedPillar({ position, radius, color, opacity = 1, pillarIndex = 0 }) {
  // Calculate distance from camera (simplified - assumes camera at origin)
  const distance = useMemo(() => {
    return Math.sqrt(position[0] * position[0] + position[2] * position[2]);
  }, [position]);
  
  // Apply LOD-based opacity reduction
  const lodOpacity = useMemo(() => {
    const maxDistance = mobilePerformanceOptimizer.getQualitySettings().pillarLODDistance;
    if (distance > maxDistance) {
      return Math.max(opacity * 0.3, 0.1);
    } else if (distance > maxDistance * 0.5) {
      return Math.max(opacity * 0.6, 0.4);
    }
    return opacity;
  }, [distance, opacity]);
  
  return (
    <PillarRenderer
      position={position}
      radius={radius}
      color={color}
      opacity={lodOpacity}
      distance={distance}
    />
  );
}