import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG } from '../config/gameConfig';
import { themeManager } from '../utils/themeManager';
import Ball from './3d/BallSimple';
import Pillar from './3d/PillarSimple';

/**
 * Simplified Game Scene Component - Hermes Compatible
 * Basic 3D scene without complex managers that cause Hermes issues
 */
export default function GameScene({ game, onPillarReached, setGame, endGame }) {
  const [targetPosition, setTargetPosition] = useState([0, CONFIG.PILLAR_HEIGHT + CONFIG.BALL_RADIUS + 0.5, 0]);
  const [isJumping, setIsJumping] = useState(false);
  const [worldOffset, setWorldOffset] = useState({ x: 0, z: 0 });

  // Reset world offset when game starts
  useEffect(() => {
    if (game.playing && game.score === 0) {
      console.log('Resetting world offset for new game');
      setWorldOffset({ x: 0, z: 0 });
    }
  }, [game.playing, game.score]);
  const [currentTheme, setCurrentTheme] = useState(themeManager.getCurrentTheme());

  // Theme manager listener
  useEffect(() => {
    const handleThemeChange = (theme) => {
      setCurrentTheme(theme);
    };

    themeManager.addListener(handleThemeChange);

    return () => {
      themeManager.removeListener(handleThemeChange);
    };
  }, []);



  // Handle jump to new pillar with smooth world transition
  useEffect(() => {
    if (game.targetPillarIndex > 0 && game.pillars[game.targetPillarIndex]) {
      const target = game.pillars[game.targetPillarIndex];
      const current = game.pillars[0];
      
      // Calculate target position relative to current pillar with proper alignment
      const targetPos = [
        target.x - current.x,
        CONFIG.PILLAR_HEIGHT + CONFIG.BALL_RADIUS + 0.5, // Proper ball positioning on pillar top
        target.z - current.z
      ];
      
      setTargetPosition(targetPos);
      setIsJumping(true);
      
      // Quick world offset update for immediate camera movement
      setWorldOffset({ x: -target.x, z: -target.z });
    }
  }, [game.targetPillarIndex, game.pillars]); // Removed worldOffset to prevent infinite loop

  // Handle jump completion
  const handleJumpComplete = useCallback(() => {
    setIsJumping(false);
    setTimeout(() => onPillarReached(), 50); // Reduced from 100ms to 50ms for snappier response
  }, [onPillarReached]);

  // Calculate orbiting ball position with proper alignment to current pillar
  const orbitingBallPosition = useMemo(() => {
    if (!game.playing || !game.pillars.length) return [0, CONFIG.PILLAR_HEIGHT + CONFIG.BALL_RADIUS + 0.5, 0];
    
    const currentPillar = game.pillars[0]; // First pillar is always the current one
    const rad = game.ballAngle * Math.PI / 180;
    const radius = CONFIG.ROTATION_RADIUS;
    
    // Position relative to current pillar with world offset applied
    const ballPos = [
      currentPillar.x + Math.cos(rad) * radius + worldOffset.x,
      CONFIG.PILLAR_HEIGHT + CONFIG.BALL_RADIUS + 1.5, // Orbiting ball slightly higher
      currentPillar.z + Math.sin(rad) * radius + worldOffset.z
    ];
    
    return ballPos;
  }, [game.ballAngle, game.playing, game.pillars, worldOffset]);

  // Enhanced game update loop with ball shrinking
  useFrame((state, delta) => {
    if (game.playing && !game.paused && setGame) {
      // Increased multiplier for snappier ball movement
      const speedMultiplier = 75; // Increased from 60 to 75 for faster, more responsive movement
      
      setGame(prevGame => {
        const oldAngle = prevGame.ballAngle;
        const newAngle = (oldAngle + prevGame.ballSpeed * delta * speedMultiplier) % 360;
        
        // Check if we completed a full 360° rotation (more accurate detection)
        const completedRotation = (oldAngle > newAngle && oldAngle > 270 && newAngle < 90) ||
                                 (oldAngle < 90 && newAngle > 270 && prevGame.ballDirection < 0);
        
        // Update rotation count and ball scale
        let newRotationCount = prevGame.rotationCount || 0;
        let newBallScale = prevGame.ballScale;
        
        if (completedRotation) {
          newRotationCount += 1;
          // Ball shrinking: 5% reduction every 360° rotation
          if (newBallScale > 0.2) { // Minimum scale of 20%
            newBallScale = Math.max(0.2, prevGame.ballScale * 0.95); // 5% shrink
            console.log(`Rotation ${newRotationCount}: Ball scale now ${(newBallScale * 100).toFixed(1)}%`);
          }
        }
        
        return {
          ...prevGame,
          ballAngle: newAngle,
          ballScale: newBallScale,
          rotationCount: newRotationCount
        };
      });
    }
  });

  if (!game.playing) return null;

  return (
    <>
      {/* Enhanced Lighting for Better Visual Quality */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 25, 8]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      {/* Key light for pillars */}
      <pointLight
        position={[5, 15, 5]}
        intensity={0.6}
        color={new THREE.Color(currentTheme.pillar).multiplyScalar(0.8)}
      />
      {/* Ball accent light */}
      <pointLight
        position={[-8, 20, -8]}
        intensity={0.4}
        color={new THREE.Color(currentTheme.ball)}
      />
      {/* Rim light for depth */}
      <directionalLight
        position={[-15, 10, -15]}
        intensity={0.3}
        color={new THREE.Color(0x4444ff)}
      />

      {/* Enhanced Fog */}
      <fog attach="fog" args={[currentTheme.bg, CONFIG.FOG[0], CONFIG.FOG[1]]} />

      {/* Subtle Ground Plane for Visual Foundation */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshLambertMaterial 
          color={new THREE.Color(currentTheme.bg).multiplyScalar(1.2)} 
          transparent 
          opacity={0.3} 
        />
      </mesh>

      {/* Pillars */}
      {game.pillars.map((pillar, index) => (
        <Pillar
          key={pillar.id}
          position={[pillar.x + worldOffset.x, 0, pillar.z + worldOffset.z]}
          radius={pillar.r}
          color={currentTheme.pillar}
          opacity={Math.max(1 - index * 0.1, 0.4)}
          pillarIndex={index}
        />
      ))}

      {/* Only show the orbiting ball - remove static ball for clarity */}
      <Ball
        position={orbitingBallPosition}
        targetPosition={targetPosition}
        isJumping={isJumping}
        rotationSpeed={game.ballSpeed}
        onJumpComplete={handleJumpComplete}
        color={currentTheme.ball}
        scale={game.ballScale}
        isOrbiting={true}
      />
    </>
  );
}