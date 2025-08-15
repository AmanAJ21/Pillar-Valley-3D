import { Platform } from 'react-native';

// Icon mapping for web fallback using Material Icons and Unicode characters
const iconMap = {
  'checkmark': { material: 'check', unicode: '✓' },
  'close': { material: 'close', unicode: '✕' },
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

// Multiple CDN sources for better reliability - using Google Fonts and jsDelivr
const fontSources = [
  {
    name: 'google-fonts',
    css: 'https://fonts.googleapis.com/icon?family=Material+Icons'
  },
  {
    name: 'jsdelivr',
    css: 'https://cdn.jsdelivr.net/npm/material-icons@1.13.12/iconfont/material-icons.css'
  },
  {
    name: 'local-fallback',
    css: './src/assets/fonts/ionicons-fallback.css'
  }
];

const testFontLoad = (fontFamily) => {
  return new Promise((resolve) => {
    const testElement = document.createElement('span');
    testElement.style.fontFamily = `${fontFamily}, sans-serif`;
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    testElement.style.fontSize = '16px';
    testElement.innerHTML = '&#xf121;'; // Ionicons checkmark
    document.body.appendChild(testElement);
    
    const computedStyle = window.getComputedStyle(testElement);
    const actualFontFamily = computedStyle.fontFamily.toLowerCase();
    
    document.body.removeChild(testElement);
    
    const fontLoaded = actualFontFamily.includes(fontFamily.toLowerCase());
    resolve(fontLoaded);
  });
};

export const loadVectorIconFonts = async () => {
  if (Platform.OS === 'web') {
    // Check if fonts are already loaded
    if (document.getElementById('vector-icon-fonts')) {
      return;
    }

    // Create a reliable font setup using Google Fonts Material Icons
    const reliableFontCSS = `
      /* Google Fonts Material Icons - most reliable */
      @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
      
      /* Map Ionicons to Material Icons for compatibility */
      .ionicon {
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
      }
      
      /* Fallback font face for Ionicons */
      @font-face {
        font-family: 'Ionicons';
        src: url('data:font/woff2;base64,') format('woff2');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;

    const style = document.createElement('style');
    style.id = 'vector-icon-fonts';
    style.textContent = reliableFontCSS;
    document.head.appendChild(style);

    // Also add Material Icons link for extra reliability
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Vector icon fonts loaded with Material Icons fallback
    
    // Set fallback flag to use our improved icon mapping
    window.useIconFallback = true;
  }
};

export { iconMap };