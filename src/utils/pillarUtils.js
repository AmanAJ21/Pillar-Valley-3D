import { CONFIG } from '../config/gameConfig';
import { random, distance, getNextAngle } from './gameUtils';

// ═══════════════════════════════════════════════════════════════════════════════
// PILLAR GENERATION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

const hasOverlap = (newPillar, existingPillars) => {
  return existingPillars.some(existing =>
    distance(newPillar.x, newPillar.z, existing.x, existing.z) < (newPillar.r + existing.r + 3)
  );
};

export const createInitialPillars = () => {
  const pillars = [{
    x: 0,
    z: 0,
    r: random(...CONFIG.PILLAR_RADIUS),
    id: 0
  }];

  for (let i = 1; i < CONFIG.PILLAR_COUNT; i++) {
    const last = pillars[i - 1];
    let attempts = 0;
    let newPillar;

    do {
      const angle = getNextAngle();
      newPillar = {
        x: last.x + CONFIG.PILLAR_DISTANCE * Math.cos(angle),
        z: last.z + CONFIG.PILLAR_DISTANCE * Math.sin(angle),
        r: random(...CONFIG.PILLAR_RADIUS),
        id: i
      };
      attempts++;
    } while (hasOverlap(newPillar, pillars) && attempts < 10);

    pillars.push(newPillar);
  }

  return pillars;
};

export const generateNextPillar = (existingPillars) => {
  const last = existingPillars[existingPillars.length - 1];
  let attempts = 0;
  let newPillar;

  do {
    const angle = getNextAngle();
    newPillar = {
      x: last.x + CONFIG.PILLAR_DISTANCE * Math.cos(angle),
      z: last.z + CONFIG.PILLAR_DISTANCE * Math.sin(angle),
      r: random(...CONFIG.PILLAR_RADIUS),
      id: Date.now() + Math.random()
    };
    attempts++;
  } while (hasOverlap(newPillar, existingPillars) && attempts < 10);

  return newPillar;
};