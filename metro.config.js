const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for react-native-vector-icons on web
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-vector-icons': 'react-native-vector-icons/dist',
};

config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;