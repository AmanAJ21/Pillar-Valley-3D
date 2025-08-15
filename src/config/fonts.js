// Font configuration for react-native-vector-icons on web using reliable sources
export const loadFonts = () => {
  if (typeof document !== 'undefined') {
    // Add Google Fonts link for Material Icons (most reliable)
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const fontCSS = `
      /* Material Icons from Google Fonts - most reliable */
      @font-face {
        font-family: 'MaterialIcons';
        src: url('https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Map Ionicons to Material Icons for compatibility */
      @font-face {
        font-family: 'Ionicons';
        src: url('https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* FontAwesome from jsDelivr (more reliable than Cloudflare) */
      @font-face {
        font-family: 'FontAwesome';
        src: url('https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/webfonts/fa-solid-900.woff2') format('woff2');
        font-weight: 900;
        font-style: normal;
        font-display: swap;
      }

      /* Feather icons from jsDelivr */
      @font-face {
        font-family: 'Feather';
        src: url('https://cdn.jsdelivr.net/npm/feather-icons@4.29.0/dist/fonts/feather.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;

    const style = document.createElement('style');
    style.textContent = fontCSS;
    document.head.appendChild(style);
  }
};