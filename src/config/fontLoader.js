// Simplified font loader - no external dependencies
export const loadVectorIconFonts = async () => {
  // No external font loading needed - using unicode symbols
  return Promise.resolve();
};

// Simple icon mapping (kept for compatibility)
export const iconMap = {
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