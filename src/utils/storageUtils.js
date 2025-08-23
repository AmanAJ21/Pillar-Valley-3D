import { STORAGE_KEYS } from '../config/gameConfig';

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

export const saveGameSettings = (settings) => {
  try {
    if (typeof Storage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GAME_SETTINGS, JSON.stringify(settings));
    }
  } catch (error) {
    // Failed to save game settings
  }
};

export const loadGameSettings = () => {
  try {
    if (typeof Storage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.GAME_SETTINGS);
      return saved ? JSON.parse(saved) : {};
    }
  } catch (error) {
    // Failed to load game settings
  }
  return {};
};