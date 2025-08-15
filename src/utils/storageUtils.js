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
    console.warn('Failed to save game settings:', error);
  }
};

export const loadGameSettings = () => {
  try {
    if (typeof Storage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.GAME_SETTINGS);
      return saved ? JSON.parse(saved) : {};
    }
  } catch (error) {
    console.warn('Failed to load game settings:', error);
  }
  return {};
};