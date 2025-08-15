import React from 'react';
import { Text, Platform } from 'react-native';

/**
 * Optimized Icon Component - Simple text symbols, no external fonts
 */
const MaterialIcon = ({ name, size = 18, color = '#000', style, ...props }) => {
  // Compact, reliable symbols that work everywhere
  const iconMap = {
    'check': '✓',
    'checkmark': '✓',
    'close': '×',
    'finger-print': '⚬',
    'fingerprint': '⚬',
    'color-palette': '◉',
    'palette': '◉',
    'keypad': '⌨',
    'dialpad': '⌨',
    'home': '⌂',
    'settings': '⚙',
    'search': '⌕',
    'menu': '≡',
    'arrow-back': '‹',
    'arrow_back': '‹',
    'arrow-forward': '›',
    'arrow_forward': '›',
    'add': '+',
    'remove': '−',
    'play': '▶',
    'play_arrow': '▶',
    'pause': '❚❚',
    'stop': '■',
    'refresh': '↻',
    'download': '↓',
    'upload': '↑',
    'share': '↗',
    'heart': '♥',
    'favorite': '♥',
    'star': '★',
    'bookmark': '⚑',
    'lock': '🔒',
    'unlock': '🔓',
    'lock_open': '🔓',
    'eye': '👁',
    'visibility': '👁',
    'eye-off': '⚫',
    'visibility_off': '⚫',
    'edit': '✎',
    'delete': '✕',
    'save': '💾',
    'copy': '⧉',
    'content_copy': '⧉',
    'cut': '✂',
    'content_cut': '✂',
    'paste': '⧉',
    'content_paste': '⧉',
  };

  const displayText = iconMap[name] || '•';
  
  if (Platform.OS === 'web') {
    return (
      <span
        style={{
          fontSize: Math.min(size, 20), // Cap size to prevent overflow
          color: color,
          lineHeight: 1,
          userSelect: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace, system-ui',
          fontWeight: 'bold',
          width: size,
          height: size,
          textAlign: 'center',
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
          fontSize: Math.min(size, 20),
          color: color,
          textAlign: 'center',
          lineHeight: size,
          fontWeight: 'bold',
          width: size,
          height: size,
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