import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';

/**
 * Apple-style feedback component for game events
 * Provides subtle, elegant feedback similar to iOS system notifications
 */
export default function AppleStyleFeedback({ 
  message, 
  type = 'success', 
  visible = false, 
  onHide,
  duration = 2000 
}) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-50));

  useEffect(() => {
    if (visible) {
      // Snappier animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200, // Reduced from 300ms to 200ms
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 120, // Increased tension for snappier animation
          friction: 6, // Reduced friction for faster animation
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200, // Reduced from 300ms to 200ms
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -50,
            duration: 200, // Reduced from 300ms to 200ms
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onHide) onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, slideAnim, duration, onHide]);

  if (!visible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: 'rgba(52, 199, 89, 0.15)', // iOS Green
          borderColor: 'rgba(52, 199, 89, 0.3)',
        };
      case 'warning':
        return {
          backgroundColor: 'rgba(255, 149, 0, 0.15)', // iOS Orange
          borderColor: 'rgba(255, 149, 0, 0.3)',
        };
      case 'error':
        return {
          backgroundColor: 'rgba(255, 59, 48, 0.15)', // iOS Red
          borderColor: 'rgba(255, 59, 48, 0.3)',
        };
      default:
        return {
          backgroundColor: 'rgba(0, 122, 255, 0.15)', // iOS Blue
          borderColor: 'rgba(0, 122, 255, 0.3)',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: typeStyles.backgroundColor,
          borderColor: typeStyles.borderColor,
        },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 0.5,
    backdropFilter: Platform.OS === 'web' ? 'blur(20px)' : undefined,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 9999,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    letterSpacing: -0.32,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
});