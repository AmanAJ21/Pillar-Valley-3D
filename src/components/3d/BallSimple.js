import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG } from '../../config/gameConfig';

/**
 * New Ball Component - Sits on Pillar with Rotating Projection System
 */
export default function Ball({
  pillar,
  color,
  scale = 1,
  isMoving = false,
  targetPillar = null,
  onMoveComplete,
  showProjection = false,
  projectionAngle = 0,
  projectionTarget = null
}) {
  const ballRef = useRef();
  const glowRef = useRef();
  const projectionRef = useRef();
  const [moveProgress, setMoveProgress] = useState(0);

  // Ball geometry - sits on pillar
  const ballGeometry = useMemo(() => {
    return new THREE.SphereGeometry(CONFIG.BALL_RADIUS, 24, 18);
  }, []);

  // Ball material
  const ballMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color).multiplyScalar(0.2),
      shininess: 150,
      specular: new THREE.Color(0xffffff).multiplyScalar(0.7)
    });
  }, [color]);

  // Glow effect
  const glowGeometry = useMemo(() => {
    return new THREE.SphereGeometry(CONFIG.BALL_RADIUS * 1.3, 16, 12);
  }, []);

  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.4,
      side: THREE.BackSide
    });
  }, [color]);

  // Projection ball material (highly visible)
  const projectionMaterial = useMemo(() => {
    return new THREE.MeshLambertMaterial({
      color: new THREE.Color(color).multiplyScalar(1.5),
      transparent: true,
      opacity: 0.9,
      wireframe: true,
      emissive: new THREE.Color(color).multiplyScalar(0.3)
    });
  }, [color]);

  // Calculate ball position on pillar
  const ballPosition = useMemo(() => {
    if (!pillar) return [0, 0, 0];
    return [
      pillar.x,
      CONFIG.PILLAR_HEIGHT + CONFIG.BALL_RADIUS + 0.2,
      pillar.z
    ];
  }, [pillar]);

  // Calculate rotating projection position around current pillar - always active
  const projectionPosition = useMemo(() => {
    if (!pillar) return null;
    
    const rad = projectionAngle * Math.PI / 180;
    const radius = CONFIG.ROTATION_RADIUS || 10;
    
    const pos = [
      pillar.x + Math.cos(rad) * radius,
      CONFIG.PILLAR_HEIGHT + CONFIG.BALL_RADIUS + 1.5,
      pillar.z + Math.sin(rad) * radius
    ];
    
    return pos;
  }, [pillar, projectionAngle]);

  // Animation loop
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (!ballRef.current) return;

    // Ball movement between pillars
    if (isMoving && targetPillar && moveProgress < 1) {
      const newProgress = Math.min(moveProgress + delta * 4, 1);
      setMoveProgress(newProgress);

      const startPos = ballPosition;
      const endPos = [
        targetPillar.x,
        CONFIG.PILLAR_HEIGHT + CONFIG.BALL_RADIUS + 0.2,
        targetPillar.z
      ];

      // Smooth arc movement
      const t = newProgress;
      const easeInOut = t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
      const jumpHeight = 4;

      const currentX = startPos[0] + (endPos[0] - startPos[0]) * easeInOut;
      const currentZ = startPos[2] + (endPos[2] - startPos[2]) * easeInOut;
      const currentY = startPos[1] + jumpHeight * Math.sin(Math.PI * t);

      ballRef.current.position.set(currentX, currentY, currentZ);

      // Rotation during movement
      ballRef.current.rotation.x += delta * 8;
      ballRef.current.rotation.z += delta * 4;

      if (newProgress >= 1 && onMoveComplete) {
        ballRef.current.rotation.x = 0;
        ballRef.current.rotation.z = 0;
        onMoveComplete();
        setMoveProgress(0);
      }
    } else if (!isMoving) {
      // Ball sitting on pillar
      ballRef.current.position.set(...ballPosition);
      
      // Gentle floating animation
      ballRef.current.position.y = ballPosition[1] + Math.sin(time * 3) * 0.1;
      
      // Gentle rotation
      ballRef.current.rotation.y += delta * 2;
    }

    // Scale animation
    const targetScale = scale * (1 + Math.sin(time * 4) * 0.05);
    ballRef.current.scale.setScalar(targetScale);

    // Glow animation
    if (glowRef.current) {
      glowRef.current.position.copy(ballRef.current.position);
      glowRef.current.rotation.y += delta * 1;
      const glowScale = scale * (1 + Math.sin(time * 2) * 0.2);
      glowRef.current.scale.setScalar(glowScale);
    }

    // Rotating projection animation - always active when position exists
    if (projectionRef.current && projectionPosition) {
      projectionRef.current.position.set(...projectionPosition);
      
      // Floating animation for projection
      projectionRef.current.position.y = projectionPosition[1] + Math.sin(time * 8) * 0.3;
      
      // Rotation animation
      projectionRef.current.rotation.y += delta * 6;
      projectionRef.current.rotation.x += delta * 3;
      
      // Steady opacity for better visibility
      projectionRef.current.material.opacity = 0.8;
      
      // Fixed size - same as main ball
      projectionRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Main ball sitting on pillar */}
      <mesh
        ref={ballRef}
        geometry={ballGeometry}
        material={ballMaterial}
        castShadow
        receiveShadow
      />

      {/* Glow effect */}
      <mesh
        ref={glowRef}
        geometry={glowGeometry}
        material={glowMaterial}
      />

      {/* Rotating projection ball - always visible, orbits around current pillar */}
      <mesh
        ref={projectionRef}
        geometry={ballGeometry}
        material={projectionMaterial}
        visible={!!projectionPosition}
        position={projectionPosition || [0, 0, 0]}
      />
    </group>
  );
}