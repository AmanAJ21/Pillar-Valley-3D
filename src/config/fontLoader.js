import { Platform } from 'react-native';

// Simple and reliable icon mapping for Material Icons
const iconMap = {
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

// Load Material Icons reliably for web
export const loadVectorIconFonts = async () => {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    // Check if Material Icons are already loaded
    if (document.getElementById('material-icons-font')) {
      return;
    }

    // Add Material Icons from Google Fonts (most reliable CDN)
    const link = document.createElement('link');
    link.id = 'material-icons-font';
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    link.rel = 'stylesheet';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    // Add CSS for proper Material Icons styling
    const style = document.createElement('style');
    style.id = 'material-icons-style';
    style.textContent = `
      .material-icons {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        -webkit-font-feature-settings: 'liga';
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
      }
    `;
    document.head.appendChild(style);
  }
};

export { iconMap };