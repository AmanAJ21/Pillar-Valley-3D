import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG } from '../config/gameConfig';
import { themeManager } from '../utils/themeManager';
import { checkBallCollision } from '../utils/gameUtils';
import Ball from './3d/BallSimple';
import Pillar from './3d/PillarSimple';

/**
 * Simplified Game Scene Component - Hermes Compatible
 * Basic 3D scene without complex managers that cause Hermes issues
 */
export default function GameScene({ game, onPillarReached, setGame, endGame }) {
  const [worldOffset, setWorldOffset] = useState({ x: 0, z: 0 });
  const [ballMoving, setBallMoving] = useState(false);
  const [showProjection, setShowProjection] = useState(false);

  // Reset world offset when game starts
  useEffect(() => {
    if (game.playing && game.score === 0) {
      setWorldOffset({ x: 0, z: 0 });
      setBallMoving(false);
      setShowProjection(false);
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

  // Handle ball movement to new pillar
  useEffect(() => {
    if (game.targetPillarIndex > 0 && game.pillars[game.targetPillarIndex]) {
      const target = game.pillars[game.targetPillarIndex];
      setBallMoving(true);
      setShowProjection(false);
      
      // Update world offset for camera movement
      setWorldOffset({ x: -target.x, z: -target.z });
    }
  }, [game.targetPillarIndex, game.pillars]);

  // Handle ball movement completion
  const handleMoveComplete = useCallback(() => {
    setBallMoving(false);
    setTimeout(() => onPillarReached(), 50);
  }, [onPillarReached]);

  // Always show projection when game is playing and not moving
  useEffect(() => {
    if (game.playing && !ballMoving) {
      setShowProjection(true);
    } else {
      setShowProjection(false);
    }
  }, [game.playing, ballMoving]);





  // Game update loop with rotating projection
  useFrame((state, delta) => {
    if (game.playing && !game.paused && setGame && !ballMoving) {
      setGame(prevGame => {
        // Update ball angle for projection and collision alignment
        const speed = prevGame.ballSpeed || 2;
        const newAngle = (prevGame.ballAngle + speed * delta * 60) % 360;
        
        // Ball shrinks over time when sitting on pillar
        let newBallScale = prevGame.ballScale;
        if (newBallScale > 0.3) {
          newBallScale = Math.max(0.3, prevGame.ballScale - delta * 0.1);
        }
        
        return {
          ...prevGame,
          ballAngle: newAngle,
          ballScale: newBallScale
        };
      });
    }
  });



  if (!game.playing) return null;

  return (
    <>
      {/* Enhanced Lighting System for Cinematic Quality */}
      <ambientLight intensity={0.4} color={new THREE.Color(currentTheme.bg).multiplyScalar(1.5)} />
      
      {/* Main directional light with enhanced shadows */}
      <directionalLight
        position={[12, 30, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0001}
      />
      
      {/* Dynamic pillar accent lights */}
      <pointLight
        position={[8, 18, 8]}
        intensity={0.8}
        distance={30}
        decay={2}
        color={new THREE.Color(currentTheme.pillar).multiplyScalar(1.2)}
      />
      
      {/* Ball tracking light */}
      <pointLight
        position={[-10, 25, -10]}
        intensity={0.6}
        distance={25}
        decay={1.5}
        color={new THREE.Color(currentTheme.ball).multiplyScalar(1.5)}
      />
      
      {/* Atmospheric rim lighting */}
      <directionalLight
        position={[-20, 12, -20]}
        intensity={0.4}
        color={new THREE.Color(0x6666ff)}
      />
      
      {/* Fill light for better visibility */}
      <pointLight
        position={[0, 40, 0]}
        intensity={0.3}
        distance={50}
        decay={2}
        color={new THREE.Color(0xffffff)}
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

      {/* Enhanced pillars with dynamic animations */}
      {game.pillars.map((pillar, index) => (
        <Pillar
          key={pillar.id}
          position={[pillar.x + worldOffset.x, 0, pillar.z + worldOffset.z]}
          radius={pillar.r}
          color={currentTheme.pillar}
          opacity={Math.max(1 - index * 0.08, 0.3)}
          pillarIndex={index}
        />
      ))}

      {/* New ball system - sits on pillar */}
      {game.pillars.length > 0 && (
        <Ball
          pillar={{
            x: game.pillars[0].x + worldOffset.x,
            z: game.pillars[0].z + worldOffset.z
          }}
          color={currentTheme.ball}
          scale={game.ballScale}
          isMoving={ballMoving}
          targetPillar={game.targetPillarIndex > 0 ? {
            x: game.pillars[game.targetPillarIndex].x + worldOffset.x,
            z: game.pillars[game.targetPillarIndex].z + worldOffset.z
          } : null}
          onMoveComplete={handleMoveComplete}
          showProjection={showProjection}
          projectionAngle={game.ballAngle}
        />
      )}
    </>
  );
}