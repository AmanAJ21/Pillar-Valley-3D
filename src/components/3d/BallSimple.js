import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG } from '../../config/gameConfig';

/**
 * Enhanced Ball Component - Beautiful Design with Proper Alignment
 */
export default function Ball({ 
  position, 
  targetPosition, 
  isJumping, 
  rotationSpeed, 
  onJumpComplete, 
  color, 
  scale = 1, 
  isOrbiting = false,
  isProjection = false
}) {
  const meshRef = useRef();
  const glowRef = useRef();
  const [jumpProgress, setJumpProgress] = useState(0);

  // Enhanced sphere geometry for better ball appearance
  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(
      CONFIG.BALL_RADIUS, 
      20, // More segments for smoother sphere
      16
    );
  }, []);

  // Enhanced material with better lighting and glow
  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color).multiplyScalar(isProjection ? 0.3 : 0.15),
      shininess: 100,
      specular: new THREE.Color(0xffffff).multiplyScalar(0.5),
      transparent: isProjection,
      opacity: isProjection ? 0.7 : 1.0
    });
  }, [color, isProjection]);

  // Glow effect geometry
  const glowGeometry = useMemo(() => {
    return new THREE.SphereGeometry(CONFIG.BALL_RADIUS * 1.3, 16, 12);
  }, []);

  // Glow material
  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: isProjection ? 0.1 : 0.2,
      side: THREE.BackSide
    });
  }, [color, isProjection]);

  // Enhanced animation loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (isProjection) {
      // Projection ball - simple positioning with pulsing effect
      if (position && position.length === 3) {
        meshRef.current.position.set(position[0], position[1], position[2]);
      }
      
      // Pulsing effect for projection
      const pulseScale = scale * (1 + Math.sin(state.clock.elapsedTime * 4) * 0.2);
      meshRef.current.scale.setScalar(pulseScale);
      
      // Gentle rotation
      meshRef.current.rotation.y += delta * 1.0;
      
    } else {
      // Regular ball behavior
      // Snappier rotation with floating effect
      if (isOrbiting && rotationSpeed > 0) {
        meshRef.current.rotation.y += delta * rotationSpeed * 1.2;
        // Add subtle floating animation
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      }

      // Quick and smooth jump animation
      if (isJumping && jumpProgress < 1) {
        const newProgress = Math.min(jumpProgress + delta * 6, 1);
        setJumpProgress(newProgress);

        // Enhanced jump arc with quick movement
        if (targetPosition && targetPosition.length === 3) {
          const t = newProgress;
          const startPos = position;
          const endPos = targetPosition;
          
          // Quick parabolic jump with easing
          const easeInOut = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const jumpHeight = 4;
          
          const currentX = startPos[0] + (endPos[0] - startPos[0]) * easeInOut;
          const currentZ = startPos[2] + (endPos[2] - startPos[2]) * easeInOut;
          const currentY = startPos[1] + (endPos[1] - startPos[1]) * easeInOut + jumpHeight * Math.sin(Math.PI * t);
          
          meshRef.current.position.set(currentX, currentY, currentZ);
          
          // Add rotation during jump for dynamic effect
          meshRef.current.rotation.x = Math.sin(Math.PI * t) * 0.5;
          meshRef.current.rotation.z = Math.sin(Math.PI * t * 2) * 0.3;
        }

        if (newProgress >= 1 && onJumpComplete) {
          // Reset rotation when landing
          meshRef.current.rotation.x = 0;
          meshRef.current.rotation.z = 0;
          onJumpComplete();
          setJumpProgress(0);
        }
      } else if (!isJumping) {
        // Smooth position update when not jumping
        if (position && position.length === 3) {
          const currentPos = meshRef.current.position;
          const targetPos = new THREE.Vector3(position[0], position[1], position[2]);
          
          // Smooth interpolation for responsive movement
          currentPos.lerp(targetPos, delta * 8);
        }
      }

      // Scale update
      meshRef.current.scale.setScalar(scale);
    }

    // Glow effect animation
    if (glowRef.current) {
      glowRef.current.rotation.y += delta * 0.5;
      glowRef.current.scale.setScalar(scale * (1 + Math.sin(state.clock.elapsedTime * 2) * 0.1));
    }
  });

  return (
    <group>
      {/* Main ball */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        castShadow
        receiveShadow
      />
      
      {/* Glow effect - only for non-projection balls */}
      {!isProjection && (
        <mesh
          ref={glowRef}
          geometry={glowGeometry}
          material={glowMaterial}
          position={position}
        />
      )}
    </group>
  );
}