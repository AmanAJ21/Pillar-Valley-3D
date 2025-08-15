import React from 'react';
import { Platform } from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from './MaterialIcon';

/**
 * Universal Icon Component
 * Uses Ionicons on native platforms and Material Icons on web for reliability
 */
const Icon = ({ name, size = 24, color = '#000', style, ...props }) => {
  // On web, always use Material Icons for better Vercel compatibility
  if (Platform.OS === 'web') {
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

  // On native platforms, use Ionicons
  return (
    <IoniconsIcon
      name={name}
      size={size}
      color={color}
      style={style}
      {...props}
    />
  );
};

export default Icon;