import React from 'react';
import { Text, Platform } from 'react-native';

/**
 * Simple Icon Component - Uses Unicode symbols for reliable rendering
 */
const MaterialIcon = ({ name, size = 24, color = '#000', style, ...props }) => {
  // Simple unicode fallbacks that work everywhere
  const iconMap = {
    'check': '✓',
    'checkmark': '✓',
    'close': '×',
    'finger-print': '👆',
    'fingerprint': '👆',
    'color-palette': '🎨',
    'palette': '🎨',
    'keypad': '⌨',
    'dialpad': '⌨',
    'home': '🏠',
    'settings': '⚙',
    'search': '🔍',
    'menu': '☰',
    'arrow-back': '←',
    'arrow_back': '←',
    'arrow-forward': '→',
    'arrow_forward': '→',
    'add': '+',
    'remove': '−',
    'play': '▶',
    'play_arrow': '▶',
    'pause': '⏸',
    'stop': '⏹',
    'refresh': '↻',
    'download': '⬇',
    'upload': '⬆',
    'share': '↗',
    'heart': '♥',
    'favorite': '♥',
    'star': '★',
    'bookmark': '🔖',
    'lock': '🔒',
    'unlock': '🔓',
    'lock_open': '🔓',
    'eye': '👁',
    'visibility': '👁',
    'eye-off': '🙈',
    'visibility_off': '🙈',
    'edit': '✏',
    'delete': '🗑',
    'save': '💾',
    'copy': '📋',
    'content_copy': '📋',
    'cut': '✂',
    'content_cut': '✂',
    'paste': '📄',
    'content_paste': '📄',
  };

  const displayText = iconMap[name] || name;
  
  if (Platform.OS === 'web') {
    return (
      <span
        style={{
          fontSize: size,
          color: color,
          lineHeight: 1,
          userSelect: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          ...style
        }}
        {...props}
      >
        {displayText}
      </span>
    );
  }
  
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