import React from 'react';
import { Text, Platform } from 'react-native';

// Material Icons mapping for common Ionicons
const ioniconsToMaterial = {
  'checkmark': 'check',
  'close': 'close',
  'finger-print': 'fingerprint',
  'color-palette': 'palette',
  'keypad': 'dialpad',
  'home': 'home',
  'settings': 'settings',
  'search': 'search',
  'menu': 'menu',
  'arrow-back': 'arrow_back',
  'arrow-forward': 'arrow_forward',
  'add': 'add',
  'remove': 'remove',
  'play': 'play_arrow',
  'pause': 'pause',
  'stop': 'stop',
  'refresh': 'refresh',
  'download': 'download',
  'upload': 'upload',
  'share': 'share',
  'heart': 'favorite',
  'star': 'star',
  'bookmark': 'bookmark',
  'lock': 'lock',
  'unlock': 'lock_open',
  'eye': 'visibility',
  'eye-off': 'visibility_off',
  'edit': 'edit',
  'delete': 'delete',
  'save': 'save',
  'copy': 'content_copy',
  'cut': 'content_cut',
  'paste': 'content_paste',
};

const MaterialIcon = ({ name, size = 24, color = '#000', style, ...props }) => {
  // Convert Ionicons name to Material Icons name
  const materialName = ioniconsToMaterial[name] || name;
  
  if (Platform.OS === 'web') {
    return (
      <span
        className="material-icons"
        style={{
          fontSize: size,
          color: color,
          lineHeight: 1,
          userSelect: 'none',
          ...style
        }}
        {...props}
      >
        {materialName}
      </span>
    );
  }
  
  // For native platforms, fall back to text representation
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
      {materialName}
    </Text>
  );
};

export default MaterialIcon;