import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG, PERFORMANCE } from '../../config/gameConfig';

/**
 * Ball Component - Renders the game ball with smooth animations
 */
export default function Ball({ 
  position, 
  targetPosition, 
  isJumping, 
  rotationSpeed, 
  onJumpComplete, 
  color, 
  scale, 
  isOrbiting = false 
}) {
  const meshRef = useRef();
  const [currentPos, setCurrentPos] = useState(position);
  const [jumpProgress, setJumpProgress] = useState(0);

  // Memoized geometry for better performance
  const geometry = useMemo(() => {
    return new THREE.CylinderGeometry(
      CONFIG.BALL_RADIUS, 
      CONFIG.BALL_RADIUS, 
      CONFIG.BALL_HEIGHT, 
      PERFORMANCE.GEOMETRY_SEGMENTS,
      1
    );
  }, []);

  // Memoized material with enhanced quality
  const material = useMemo(() => {
    const mat = new THREE.MeshPhongMaterial({
      color: color,
      shininess: 100,
      specular: 0x222222,
      transparent: false,
      fog: true
    });
    
    // Add subtle emission for better visibility
    mat.emissive = new THREE.Color(color).multiplyScalar(0.1);
    
    return mat;
  }, [color]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Adaptive delta clamping based on performance target
    const targetDelta = 1 / PERFORMANCE.TARGET_FPS;
    const clampedDelta = Math.min(delta, targetDelta * 2);

    // Smooth position updates
    if (!isJumping) {
      // Smooth interpolation to position for better visual quality
      const currentPosition = meshRef.current.position;
      currentPosition.lerp(new THREE.Vector3(...position), clampedDelta * 10);
      setCurrentPos([currentPosition.x, currentPosition.y, currentPosition.z]);
    }

    // Enhanced rotation with easing
    if (isOrbiting) {
      meshRef.current.rotation.y += clampedDelta * rotationSpeed * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }

    // Smooth jumping animation with arc
    if (isJumping && jumpProgress < 1) {
      const jumpSpeed = 6; // Slightly slower for smoother animation
      const newProgress = Math.min(jumpProgress + clampedDelta * jumpSpeed, 1);
      setJumpProgress(newProgress);

      if (newProgress >= 1) {
        setJumpProgress(0);
        setCurrentPos(targetPosition);
        onJumpComplete();
      } else {
        // Enhanced arc with easing
        const easeProgress = 1 - Math.pow(1 - newProgress, 3); // Ease out cubic
        const x = THREE.MathUtils.lerp(position[0], targetPosition[0], easeProgress);
        const z = THREE.MathUtils.lerp(position[2], targetPosition[2], easeProgress);
        const jumpHeight = Math.sin(newProgress * Math.PI) * 5; // Higher arc
        const y = position[1] + jumpHeight;
        setCurrentPos([x, y, z]);
      }
    }

    // Update material color if changed
    if (material.color.getHex() !== color) {
      material.color.setHex(color);
      material.emissive.setHex(color).multiplyScalar(0.1);
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={currentPos} 
      scale={[scale, scale, scale]}
      castShadow={PERFORMANCE.ENABLE_SHADOWS}
      receiveShadow={PERFORMANCE.ENABLE_SHADOWS}
      geometry={geometry}
      material={material}
    />
  );
}