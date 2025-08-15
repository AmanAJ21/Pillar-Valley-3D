import { COLOR_SCHEMES } from '../config/gameConfig';
import { Platform } from 'react-native';

// Import AsyncStorage for React Native
let AsyncStorage = null;
try {
  if (Platform.OS !== 'web') {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
  }
} catch (error) {
  console.warn('AsyncStorage not available:', error);
}

/**
 * Global Theme Manager
 * Centralized theme management system for the entire app
 */
class ThemeManager {
  constructor() {
    this.currentThemeIndex = 0;
    this.listeners = [];
    // Load saved theme asynchronously
    this.loadSavedTheme().catch(error => {
      console.warn('Failed to load saved theme in constructor:', error);
    });
  }

  /**
   * Load saved theme from storage
   */
  async loadSavedTheme() {
    try {
      let saved = null;
      
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        // Web platform - use localStorage
        saved = localStorage.getItem('pillarValley_selectedTheme');
      } else if (AsyncStorage) {
        // Mobile platform - use AsyncStorage
        saved = await AsyncStorage.getItem('pillarValley_selectedTheme');
      }
      
      if (saved !== null) {
        const themeIndex = parseInt(saved, 10);
        if (themeIndex >= 0 && themeIndex < COLOR_SCHEMES.length) {
          this.currentThemeIndex = themeIndex;
        }
      }
    } catch (error) {
      console.warn('Failed to load saved theme:', error);
    }
  }

  /**
   * Save current theme to storage
   */
  async saveCurrentTheme() {
    try {
      const themeValue = this.currentThemeIndex.toString();
      
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        // Web platform - use localStorage
        localStorage.setItem('pillarValley_selectedTheme', themeValue);
      } else if (AsyncStorage) {
        // Mobile platform - use AsyncStorage
        await AsyncStorage.setItem('pillarValley_selectedTheme', themeValue);
      }
    } catch (error) {
      console.warn('Failed to save theme:', error);
    }
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return COLOR_SCHEMES[this.currentThemeIndex] || COLOR_SCHEMES[0];
  }

  /**
   * Get current theme index
   */
  getCurrentThemeIndex() {
    return this.currentThemeIndex;
  }

  /**
   * Set theme by index
   */
  setTheme(themeIndex) {
    if (themeIndex >= 0 && themeIndex < COLOR_SCHEMES.length) {
      this.currentThemeIndex = themeIndex;
      this.saveCurrentTheme();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  /**
   * Go to next theme
   */
  nextTheme() {
    const nextIndex = (this.currentThemeIndex + 1) % COLOR_SCHEMES.length;
    return this.setTheme(nextIndex);
  }

  /**
   * Go to previous theme
   */
  previousTheme() {
    const prevIndex = this.currentThemeIndex === 0 ? COLOR_SCHEMES.length - 1 : this.currentThemeIndex - 1;
    return this.setTheme(prevIndex);
  }

  /**
   * Get random theme (different from current)
   */
  getRandomTheme() {
    if (COLOR_SCHEMES.length <= 1) return this.currentThemeIndex;
    
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * COLOR_SCHEMES.length);
    } while (randomIndex === this.currentThemeIndex);
    
    return randomIndex;
  }

  /**
   * Set random theme
   */
  setRandomTheme() {
    const randomIndex = this.getRandomTheme();
    return this.setTheme(randomIndex);
  }

  /**
   * Add theme change listener
   */
  addListener(callback) {
    if (typeof callback === 'function' && this.listeners.indexOf(callback) === -1) {
      this.listeners.push(callback);
    }
  }

  /**
   * Remove theme change listener
   */
  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners of theme change
   */
  notifyListeners() {
    const currentTheme = this.getCurrentTheme();
    for (let i = 0; i < this.listeners.length; i++) {
      try {
        this.listeners[i](currentTheme, this.currentThemeIndex);
      } catch (error) {
        console.warn('Error in theme listener:', error);
      }
    }
  }

  /**
   * Get all available themes
   */
  getAllThemes() {
    return COLOR_SCHEMES;
  }

  /**
   * Get theme by index
   */
  getThemeByIndex(index) {
    return COLOR_SCHEMES[index] || COLOR_SCHEMES[0];
  }
}

// Create singleton instance
export const themeManager = new ThemeManager();

// Export for convenience
export const getCurrentTheme = () => themeManager.getCurrentTheme();
export const getCurrentThemeIndex = () => themeManager.getCurrentThemeIndex();
export const setTheme = (index) => themeManager.setTheme(index);
export const nextTheme = () => themeManager.nextTheme();
export const setRandomTheme = () => themeManager.setRandomTheme();