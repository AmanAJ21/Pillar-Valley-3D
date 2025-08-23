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
  // Haptics not available
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
        // Light haptic failed
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
        // Medium haptic failed
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
        // Heavy haptic failed
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
        // Success haptic failed
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
        // Warning haptic failed
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
        // Error haptic failed
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
        // Selection haptic failed
      }
    }
  }
};

export default HapticFeedback;