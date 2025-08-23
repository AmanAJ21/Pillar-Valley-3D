import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG } from '../config/gameConfig';
import { themeManager } from '../utils/themeManager';
import Ball from './3d/Ball';
import Pillar from './3d/Pillar';

// Enhanced component to smoothly animate world offset using the new controller
function WorldOffsetAnimator({ isJumping }) {
  useFrame((state, delta) => {
    // Update world offset controller
    const currentOffset = worldOffsetController.update(delta);
    
    // Update performance metrics
    mobilePerformanceOptimizer.updatePerformanceMetrics(delta * 1000);
    
    // Check memory pressure periodically
    if (Math.random() < 0.01) { // 1% chance per frame
      pillarMemoryManager.checkMemoryPressure();
    }
  });
  
  return null;
}

/**
 * Main Game Scene Component - Enhanced with new state management systems
 */
export default function GameScene({ game, onPillarReached, setGame, endGame }) {
  const [ballPosition, setBallPosition] = useState([0, CONFIG.PILLAR_HEIGHT + CONFIG.BALL_HEIGHT / 2, 0]);
  const [targetPosition, setTargetPosition] = useState(ballPosition);
  const [isJumping, setIsJumping] = useState(false);
  const [worldOffset, setWorldOffset] = useState({ x: 0, z: 0 });
  const [currentTheme, setCurrentTheme] = useState(themeManager.getCurrentTheme());
  
  // Initialize state managers on first render
  useEffect(() => {
    // Reset state managers when game starts
    if (game.playing && game.pillars.length > 0) {
      pillarStateManager.resetPillarState();
      worldOffsetController.reset();
      pillarStateManager.updatePillars(game.pillars);
    }
  }, [game.playing]);

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
  
  // Listen to world offset changes
  useEffect(() => {
    const handleOffsetChange = (worldState) => {
      setWorldOffset(worldState.offset);
    };
    
    worldOffsetController.addListener(handleOffsetChange);
    return () => worldOffsetController.removeListener(handleOffsetChange);
  }, []);

  // Update ball position when current pillar changes
  useEffect(() => {
    if (game && game.pillars && game.pillars.length > 0) {
      const ballY = CONFIG.PILLAR_HEIGHT + CONFIG.BALL_HEIGHT / 2;
      // In world space, current pillar is always at origin
      const newBallPos = [0, ballY, 0];
      setBallPosition(newBallPos);
      setTargetPosition(newBallPos);
    }
  }, [game.pillars]);

  // Handle jump to new pillar with enhanced state management
  useEffect(() => {
    if (game.targetPillarIndex > 0 && game.pillars[game.targetPillarIndex]) {
      const target = game.pillars[game.targetPillarIndex];
      const ballY = CONFIG.PILLAR_HEIGHT + CONFIG.BALL_HEIGHT / 2;
      
      // Update world offset through controller with validation
      worldOffsetController.setTargetOffset({ x: -target.x, z: -target.z }, true);
      
      // Update pillar state manager
      pillarStateManager.updateWorldOffset({ x: -target.x, z: -target.z });
      
      // Calculate target position in world space (will be animated by world offset)
      const newTargetPos = [0, ballY, 0]; // Target is always at origin in world space
      setTargetPosition(newTargetPos);
      setIsJumping(true);
    }
  }, [game.targetPillarIndex]);

  const handleJumpComplete = useCallback(() => {
    setBallPosition(targetPosition);
    setIsJumping(false);
    setTimeout(() => onPillarReached(), 100);
  }, [targetPosition, onPillarReached]);

  // Calculate orbiting ball position with dynamic radius
  const orbitingBallPosition = useMemo(() => {
    if (game.pillars.length === 0) return [0, CONFIG.PILLAR_HEIGHT + CONFIG.BALL_HEIGHT / 2, 0];

    const currentPillar = game.pillars[0];
    const rad = game.ballAngle * Math.PI / 180;
    const ballY = CONFIG.PILLAR_HEIGHT + CONFIG.BALL_HEIGHT / 2;

    // Dynamic radius that reaches nearest pillar center
    let dynamicRadius = CONFIG.ROTATION_RADIUS;
    if (game.pillars.length > 1) {
      let nearestDistance = Infinity;
      for (let i = 1; i < game.pillars.length; i++) {
        const pillar = game.pillars[i];
        const dist = distance(currentPillar.x, currentPillar.z, pillar.x, pillar.z);
        if (dist < nearestDistance) {
          nearestDistance = dist;
        }
      }
      dynamicRadius = nearestDistance;
    }

    // In world space, current pillar is always at origin due to world offset
    return [
      Math.cos(rad) * dynamicRadius,
      ballY,
      Math.sin(rad) * dynamicRadius
    ];
  }, [game.ballAngle, game.pillars]);

  // Get optimized quality settings
  const qualitySettings = mobilePerformanceOptimizer.getQualitySettings();

  return (
    <>
      {/* Game updates */}
      <GameUpdate game={game} setGame={setGame} endGame={endGame} />
      
      {/* Enhanced world offset animation */}
      <WorldOffsetAnimator isJumping={isJumping} />

      {/* Enhanced Lighting Setup with performance optimization */}
      <ambientLight intensity={0.4} color={0xffffff} />
      
      {/* Main directional light with adaptive shadow quality */}
      <directionalLight
        position={[20, 80, 20]}
        intensity={1.2}
        color={0xffffff}
        castShadow={qualitySettings.enableShadows}
        shadow-mapSize-width={qualitySettings.shadowMapSize}
        shadow-mapSize-height={qualitySettings.shadowMapSize}
        shadow-camera-near={0.5}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light for better visibility */}
      <directionalLight
        position={[-10, 30, -10]}
        intensity={0.3}
        color={new THREE.Color(currentTheme.ball).multiplyScalar(0.5)}
      />
      
      {/* Rim light for depth */}
      <directionalLight
        position={[0, 20, -30]}
        intensity={0.4}
        color={0x4444ff}
      />

      {/* Enhanced Fog with performance consideration */}
      {qualitySettings.enableFog && (
        <fog attach="fog" args={[currentTheme.bg, CONFIG.FOG[0], CONFIG.FOG[1]]} />
      )}

      {/* Enhanced Pillars with LOD and memory management */}
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

      {/* Center Ball (static on pillar) */}
      <Ball
        position={ballPosition}
        targetPosition={ballPosition}
        isJumping={false}
        rotationSpeed={0}
        onJumpComplete={() => { }}
        color={currentTheme.ball}
        scale={0.8}
        isOrbiting={false}
      />

      {/* Active Ball (orbiting) */}
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

      {/* Camera controller */}
      <CameraController />

      {/* Enhanced performance monitoring */}
      <PerformanceMonitor />
    </>
  );
}