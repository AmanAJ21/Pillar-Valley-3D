import { Platform, Dimensions } from 'react-native';

// Device detection for performance optimization
const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isTablet = width >= 768;
// Treat tablets and modern phones as high-end for better visual experience
const isHighEnd = isWeb || isTablet || (width * height > 800000);

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
export const PERFORMANCE = {
  // Geometry quality - unified high quality for modern devices
  GEOMETRY_SEGMENTS: isHighEnd ? 24 : (isTablet ? 16 : 12),

  // Rendering quality - better mobile experience
  PIXEL_RATIO: isWeb ? Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 2) : Math.min(2, 1.5),

  // Frame rate targets - aim higher for mobile
  TARGET_FPS: isHighEnd ? 60 : 45,

  // Shadow quality - enable for tablets and high-end phones
  SHADOW_MAP_SIZE: isHighEnd ? (isWeb ? 2048 : 1024) : (isTablet ? 1024 : 512),

  // Antialiasing - enable for better visual quality
  ANTIALIAS: isHighEnd,

  // Precision - better quality for modern devices
  PRECISION: isHighEnd ? 'highp' : 'mediump',

  // Effects - enable more effects on mobile for web-like experience
  ENABLE_SHADOWS: isHighEnd || isTablet,
  ENABLE_FOG: true,
  ENABLE_BLOOM: isHighEnd,

  // LOD (Level of Detail)
  PILLAR_LOD_DISTANCE: 50,
  BALL_LOD_DISTANCE: 30
};

// ═══════════════════════════════════════════════════════════════════════════════
// GAME CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
export const CONFIG = {
  // Game mechanics
  PILLAR_COUNT: 6,
  PILLAR_DISTANCE: 12,
  PILLAR_RADIUS: [3, 6],
  PILLAR_HEIGHT: 18,
  TOLERANCE: 0.9,

  // Ball settings
  BALL_RADIUS: 1.69,
  BALL_HEIGHT: 2,
  BALL_SHRINK: [1, 0.2, 0.05], // [start, min, shrink_rate_per_second]
  ROTATION_RADIUS: 10,

  // Speed progression
  SPEED: {
    BASE: 2.0,              // Starting speed
    SCORE_INCREMENT: 0.2,   // Speed increase per score point (2.0, 2.2, 2.4...)
    TIME_INCREMENT: 0.1,    // Speed increase per second on pillar (2.1, 2.2, 2.3...)
    MAX: 999                // No practical limit
  },

  // Camera settings
  CAMERA: {
    FOV: isTablet ? 45 : 49, // Slightly wider FOV on tablets
    Y: 80,
    Z: -25,
    LOOK_Y: 20,
    FOLLOW_SPEED: 0.12
  },

  // Visual settings
  FOG: [25, 100],
  GEOMETRY_SEGMENTS: PERFORMANCE.GEOMETRY_SEGMENTS
};

// ═══════════════════════════════════════════════════════════════════════════════
// BEAUTIFUL MODERN COLOR THEMES
// ═══════════════════════════════════════════════════════════════════════════════
export const COLOR_SCHEMES = [
  { bg: 0x0a0a0f, pillar: 0x4a5568, ball: 0x00d4ff, name: 'Midnight Ocean', description: 'Deep blue serenity' },
  { bg: 0x1a0033, pillar: 0x805ad5, ball: 0xff6b9d, name: 'Cosmic Rose', description: 'Galactic romance' },
  { bg: 0x0f0f23, pillar: 0x667eea, ball: 0x7c3aed, name: 'Deep Purple', description: 'Royal elegance' },
  { bg: 0x001122, pillar: 0x4299e1, ball: 0x00ff88, name: 'Neon Matrix', description: 'Digital awakening' },
  { bg: 0x2d1b00, pillar: 0xd69e2e, ball: 0xffa500, name: 'Golden Hour', description: 'Sunset warmth' },
  { bg: 0x1e0a2e, pillar: 0x9f7aea, ball: 0xff3366, name: 'Electric Dreams', description: 'Vibrant energy' },
  { bg: 0x0d1421, pillar: 0x63b3ed, ball: 0x00ffff, name: 'Cyber Blue', description: 'Future tech' },
  { bg: 0x2a0845, pillar: 0xa78bfa, ball: 0xfbbf24, name: 'Royal Sunset', description: 'Majestic twilight' },
  { bg: 0x0c1618, pillar: 0x68d391, ball: 0x10b981, name: 'Forest Night', description: 'Nature\'s calm' },
  { bg: 0x1f1f1f, pillar: 0x718096, ball: 0xf59e0b, name: 'Urban Glow', description: 'City lights' },
  { bg: 0x450a0a, pillar: 0xfc8181, ball: 0xff6b6b, name: 'Crimson Fire', description: 'Passionate flame' },
  { bg: 0x0a2540, pillar: 0x90cdf4, ball: 0x60a5fa, name: 'Arctic Blue', description: 'Frozen beauty' },
  { bg: 0x1a202c, pillar: 0x9ca3af, ball: 0x9f7aea, name: 'Twilight Mist', description: 'Evening magic' },
  { bg: 0x2d0a54, pillar: 0xc084fc, ball: 0xe879f9, name: 'Mystic Purple', description: 'Enchanted realm' },
  { bg: 0x0f2027, pillar: 0x5eead4, ball: 0x2dd4bf, name: 'Ocean Depths', description: 'Aquatic mystery' },
  { bg: 0x3c1810, pillar: 0xfbb6ce, ball: 0xfb923c, name: 'Autumn Blaze', description: 'Fall splendor' },
  { bg: 0x1c1c1e, pillar: 0x6b7280, ball: 0x007aff, name: 'Classic Dark', description: 'Timeless style' },
  { bg: 0xf2f2f7, pillar: 0x9ca3af, ball: 0x007aff, name: 'Pure Light', description: 'Clean minimalism' },
  { bg: 0x0a0a0a, pillar: 0x4ade80, ball: 0x30d158, name: 'Matrix Green', description: 'Code reality' },
  { bg: 0x2a1810, pillar: 0xfed7aa, ball: 0xf97316, name: 'Desert Storm', description: 'Sandy adventure' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE OPTIMIZATION SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════
export const MOBILE_OPTIMIZATIONS = {
  // Memory management
  MAX_GEOMETRY_POOL_SIZE: 50,
  MAX_MATERIAL_POOL_SIZE: 30,
  MEMORY_CLEANUP_INTERVAL: 5000, // 5 seconds

  // Performance monitoring
  PERFORMANCE_CHECK_INTERVAL: 1000, // 1 second
  TARGET_FRAME_TIME: 16.67, // 60fps
  PERFORMANCE_ADJUSTMENT_COOLDOWN: 2000, // 2 seconds

  // Quality settings
  QUALITY_LEVELS: {
    LOW: {
      pillarSegments: 8,
      shadowMapSize: 512,
      enableShadows: false,
      enableAntialiasing: false,
      pixelRatio: 1
    },
    MEDIUM: {
      pillarSegments: 16,
      shadowMapSize: 1024,
      enableShadows: true,
      enableAntialiasing: false,
      pixelRatio: 1.5
    },
    HIGH: {
      pillarSegments: 32,
      shadowMapSize: 2048,
      enableShadows: true,
      enableAntialiasing: true,
      pixelRatio: 2
    }
  },

  // LOD settings
  LOD_DISTANCES: {
    PILLAR_NEAR: 25,
    PILLAR_FAR: 50,
    BALL_NEAR: 15,
    BALL_FAR: 30
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════════════════════════════════════════
export const STORAGE_KEYS = {
  GAME_SETTINGS: 'pillarValley3D_gameSettings',
  PERFORMANCE_SETTINGS: 'pillarValley3D_performanceSettings'
};