import React from 'react';
import { EnhancedPillar } from './PillarRenderer';

/**
 * Pillar Component - now uses the enhanced renderer with mobile optimizations
 */
export default function Pillar({ position, radius, color, opacity, pillarIndex }) {
  return (
    <EnhancedPillar
      position={position}
      radius={radius}
      color={color}
      opacity={opacity}
      pillarIndex={pillarIndex}
    />
  );
}