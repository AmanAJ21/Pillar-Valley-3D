import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { PERFORMANCE } from '../../config/gameConfig';

/**
 * Performance Monitor - Tracks FPS and adjusts quality dynamically
 */
export default function PerformanceMonitor({ onPerformanceChange }) {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const [currentFPS, setCurrentFPS] = useState(60);
  const performanceHistory = useRef([]);

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    
    // Calculate FPS every second
    if (now - lastTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (now - lastTime.current));
      setCurrentFPS(fps);
      
      // Track performance history
      performanceHistory.current.push(fps);
      if (performanceHistory.current.length > 10) {
        performanceHistory.current.shift();
      }
      
      // Calculate average FPS
      const avgFPS = performanceHistory.current.reduce((a, b) => a + b, 0) / performanceHistory.current.length;
      
      // Adaptive quality adjustment
      if (avgFPS < PERFORMANCE.TARGET_FPS * 0.8 && onPerformanceChange) {
        onPerformanceChange('decrease');
      } else if (avgFPS > PERFORMANCE.TARGET_FPS * 0.95 && onPerformanceChange) {
        onPerformanceChange('increase');
      }
      
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  // Only render FPS counter in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <mesh position={[-10, 10, 0]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial color="black" transparent opacity={0.7} />
      </mesh>
    );
  }

  return null;
}