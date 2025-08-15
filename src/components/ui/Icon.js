import React, { useState, useEffect } from 'react';
import { Text, View, Platform } from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from './MaterialIcon';

// Import the icon mapping from fontLoader
import { iconMap } from '../../config/fontLoader';

// Fallback icon mapping using Material Icons and Unicode characters
const iconFallbacks = {
  'checkmark': { material: 'check', unicode: '✓' },
  'close': { material: 'close', unicode: '×' },
  'finger-print': { material: 'fingerprint', unicode: '👆' },
  'color-palette': { material: 'palette', unicode: '🎨' },
  'keypad': { material: 'dialpad', unicode: '⌨' },
  'home': { material: 'home', unicode: '🏠' },
  'settings': { material: 'settings', unicode: '⚙' },
  'search': { material: 'search', unicode: '🔍' },
  'menu': { material: 'menu', unicode: '☰' },
  'arrow-back': { material: 'arrow_back', unicode: '←' },
  'arrow-forward': { material: 'arrow_forward', unicode: '→' },
};

const Icon = ({ name, size = 24, color = '#000', style, ...props }) => {
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Check if Ionicons font is loaded
      const checkFont = () => {
        const testElement = document.createElement('span');
        testElement.style.fontFamily = 'Ionicons, sans-serif';
        testElement.style.position = 'absolute';
        testElement.style.visibility = 'hidden';
        testElement.innerHTML = '&#xf121;'; // Ionicons checkmark
        document.body.appendChild(testElement);
        
        const computedStyle = window.getComputedStyle(testElement);
        const fontFamily = computedStyle.fontFamily;
        
        document.body.removeChild(testElement);
        
        // If Ionicons font didn't load, use fallback
        if (!fontFamily.toLowerCase().includes('ionicons')) {
          setUseFallback(true);
        }
      };

      // Check immediately and after a delay
      checkFont();
      const timer = setTimeout(checkFont, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Use Material Icons fallback for web if Ionicons failed to load
  if (Platform.OS === 'web' && useFallback) {
    return (
      <MaterialIcon
        name={name}
        size={size}
        color={color}
        style={style}
        {...props}
      />
    );
  }

  // Always try to use the regular Ionicons first
  try {
    return (
      <IoniconsIcon
        name={name}
        size={size}
        color={color}
        style={style}
        {...props}
      />
    );
  } catch (error) {
    // If Ionicons fails, use Material Icons fallback
    return (
      <MaterialIcon
        name={name}
        size={size}
        color={color}
        style={style}
        {...props}
      />
    );
  }
};

export default Icon;