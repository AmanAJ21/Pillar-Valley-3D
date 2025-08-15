import React from 'react';
import { Text, Platform } from 'react-native';
import { iconMap } from '../../config/fontLoader';

/**
 * Material Icons Component for Web
 * Provides reliable icon rendering using Google's Material Icons
 */
const MaterialIcon = ({ name, size = 24, color = '#000', style, ...props }) => {
  // Convert Ionicons name to Material Icons name using our mapping
  const materialName = iconMap[name] || name;
  
  if (Platform.OS === 'web') {
    return (
      <span
        className="material-icons"
        style={{
          fontSize: size,
          color: color,
          lineHeight: 1,
          userSelect: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style
        }}
        {...props}
      >
        {materialName}
      </span>
    );
  }
  
  // For native platforms, fall back to text representation
  const unicodeFallbacks = {
    'check': '✓',
    'close': '×',
    'fingerprint': '👆',
    'palette': '🎨',
    'dialpad': '⌨',
    'home': '🏠',
    'settings': '⚙',
    'search': '🔍',
    'menu': '☰',
    'arrow_back': '←',
    'arrow_forward': '→',
    'add': '+',
    'remove': '−',
    'play_arrow': '▶',
    'pause': '⏸',
    'stop': '⏹',
    'refresh': '↻',
    'favorite': '♥',
    'star': '★',
  };

  const displayText = unicodeFallbacks[materialName] || materialName;
  
  return (
    <Text
      style={[
        {
          fontSize: size,
          color: color,
          textAlign: 'center',
          lineHeight: size,
          fontWeight: 'bold',
        },
        style
      ]}
      {...props}
    >
      {displayText}
    </Text>
  );
};

export default MaterialIcon;