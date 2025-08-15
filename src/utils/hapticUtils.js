import { Platform } from 'react-native';

/**
 * Haptic Feedback Utilities
 * Provides consistent haptic feedback across platforms
 */

let Haptics = null;

// Try to import Expo Haptics
try {
  if (Platform.OS !== 'web') {
    Haptics = require('expo-haptics');
  }
} catch (error) {
  console.warn('Haptics not available:', error);
}

export const HapticFeedback = {
  /**
   * Light impact feedback - for UI interactions
   */
  light: () => {
    if (Haptics && Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.warn('Light haptic failed:', error);
      }
    }
  },

  /**
   * Medium impact feedback - for game actions
   */
  medium: () => {
    if (Haptics && Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.warn('Medium haptic failed:', error);
      }
    }
  },

  /**
   * Heavy impact feedback - for important events
   */
  heavy: () => {
    if (Haptics && Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch (error) {
        console.warn('Heavy haptic failed:', error);
      }
    }
  },

  /**
   * Success feedback - for achievements
   */
  success: () => {
    if (Haptics && Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.warn('Success haptic failed:', error);
      }
    }
  },

  /**
   * Warning feedback - for warnings
   */
  warning: () => {
    if (Haptics && Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch (error) {
        console.warn('Warning haptic failed:', error);
      }
    }
  },

  /**
   * Error feedback - for errors
   */
  error: () => {
    if (Haptics && Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch (error) {
        console.warn('Error haptic failed:', error);
      }
    }
  },

  /**
   * Selection feedback - for theme/option selection
   */
  selection: () => {
    if (Haptics && Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch (error) {
        console.warn('Selection haptic failed:', error);
      }
    }
  }
};

export default HapticFeedback;