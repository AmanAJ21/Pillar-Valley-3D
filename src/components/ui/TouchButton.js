import React from 'react';
import { TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import Icon from './Icon';
import { HapticFeedback } from '../../utils/hapticUtils';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

/**
 * TouchButton Component - Optimized for mobile touch interfaces
 * Clean, no-container design for perfect touch experience
 */
export default function TouchButton({
  icon,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'rgba(0, 122, 255, 0.2)', // iOS Blue
          borderColor: 'rgba(0, 122, 255, 0.4)',
          shadowColor: 'rgba(0, 122, 255, 0.3)',
        };
      case 'secondary':
        return {
          backgroundColor: 'rgba(142, 142, 147, 0.15)', // iOS Gray
          borderColor: 'rgba(142, 142, 147, 0.3)',
          shadowColor: 'rgba(142, 142, 147, 0.2)',
        };
      default:
        return {
          backgroundColor: 'rgba(0, 122, 255, 0.2)',
          borderColor: 'rgba(0, 122, 255, 0.4)',
          shadowColor: 'rgba(0, 122, 255, 0.3)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: isSmallScreen ? 44 : 48,
          height: isSmallScreen ? 44 : 48,
          borderRadius: isSmallScreen ? 12 : 14, // Apple's preferred radius
        };
      case 'large':
        return {
          width: isSmallScreen ? 56 : 64,
          height: isSmallScreen ? 56 : 64,
          borderRadius: isSmallScreen ? 16 : 18, // Apple's larger radius
        };
      default: // medium
        return {
          width: isSmallScreen ? 48 : 56,
          height: isSmallScreen ? 48 : 56,
          borderRadius: isSmallScreen ? 14 : 16, // Apple's standard radius
        };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return isSmallScreen ? 18 : 20;
      case 'large':
        return isSmallScreen ? 26 : 30;
      default:
        return isSmallScreen ? 22 : 24;
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const iconSize = getIconSize();

  const handlePress = () => {
    if (!disabled && onPress) {
      HapticFeedback.light();
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.touchButton,
        sizeStyles,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          shadowColor: variantStyles.shadowColor,
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={disabled ? 1 : 0.6}
      {...props}
    >
      <Icon
        name={icon}
        size={iconSize}
        color={disabled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.95)'}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchButton: {
    borderWidth: 0.5, // Apple's thin border
    backdropFilter: Platform.OS === 'web' ? 'blur(20px)' : undefined,
    shadowOffset: { width: 0, height: 2 }, // Apple's subtle shadow
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    // Perfect touch target
    position: 'relative',
  },
  icon: {
    textAlign: 'center',
    textAlignVertical: 'center',
    // Ensure perfect centering
    position: 'absolute',
    alignSelf: 'center',
  },
  disabled: {
    opacity: 0.3, // Apple's disabled opacity
    backgroundColor: 'rgba(142, 142, 147, 0.06)',
    borderColor: 'rgba(142, 142, 147, 0.12)',
  },
});