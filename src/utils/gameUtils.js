import { CONFIG } from '../config/gameConfig';

// ═══════════════════════════════════════════════════════════════════════════════
// MATH UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════
export const random = (min, max) => min + Math.random() * (max - min);
export const distance = (x1, z1, x2, z2) => Math.sqrt((x1 - x2) ** 2 + (z1 - z2) ** 2);
export const getNextAngle = () => random(Math.PI / 3, Math.PI / 2);

// ═══════════════════════════════════════════════════════════════════════════════
// COLOR UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════
export const colorToHex = (color) => {
  if (color === undefined || color === null) {
    return '#000000';
  }
  return `#${color.toString(16).padStart(6, '0')}`;
};

export const hexToColor = (hex) => parseInt(hex.replace('#', ''), 16);

export const isValidHex = (hex) => /^#[0-9A-F]{6}$/i.test(hex);

export const isLightColor = (color) => {
  if (color === undefined || color === null) {
    return false;
  }
  const hex = color.toString(16).padStart(6, '0');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};

// ═══════════════════════════════════════════════════════════════════════════════
// GAME CALCULATION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════
export const calculateBaseSpeed = (score) => 
  CONFIG.SPEED.BASE + (score * CONFIG.SPEED.SCORE_INCREMENT);

export const calculateTimeBonus = (timeOnPillar) => 
  Math.floor(timeOnPillar / 1000) * CONFIG.SPEED.TIME_INCREMENT;

export const calculateBallScale = (timeOnPillar) => {
  const shrinkCycles = Math.floor(timeOnPillar / 1000);
  return Math.max(
    CONFIG.BALL_SHRINK[0] * Math.pow(0.95, shrinkCycles),
    CONFIG.BALL_SHRINK[1]
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COLLISION DETECTION
// ═══════════════════════════════════════════════════════════════════════════════
export const checkBallCollision = (game) => {
  if (!game.playing || !game.pillars.length) return -1;

  const rad = game.ballAngle * Math.PI / 180;
  const currentPillar = game.pillars[0];

  // Calculate dynamic radius to reach nearest pillar center
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

  const ballX = currentPillar.x + Math.cos(rad) * dynamicRadius;
  const ballZ = currentPillar.z + Math.sin(rad) * dynamicRadius;

  for (let i = 1; i < game.pillars.length; i++) {
    const p = game.pillars[i];
    const d = distance(ballX, ballZ, p.x, p.z);
    if (d <= p.r * 1.2) return i;
  }

  return -1;
};