import React, { useEffect, useRef } from 'react';
import { View, Platform } from 'react-native';

/**
 * Google AdSense Component for Web Platform
 * Shows ads during pause screen
 */
export default function AdSense({ 
  adSlot = "auto", 
  adFormat = "auto", 
  fullWidthResponsive = true,
  style = {},
  testMode = false 
}) {
  const adRef = useRef(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Only load on web platform
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    // Check if AdSense script is already loaded
    const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
    
    const loadAdSense = () => {
      if (existingScript && window.adsbygoogle) {
        // AdSense already loaded, just push the ad
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log('AdSense ad pushed successfully');
        } catch (error) {
          console.warn('AdSense push failed:', error);
        }
        return;
      }

      if (!existingScript && !isLoaded.current) {
        // Create and load the AdSense script
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8069198795330862';
        script.crossOrigin = 'anonymous';
        
        script.onload = () => {
          isLoaded.current = true;
          console.log('AdSense script loaded successfully');
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (error) {
            console.warn('AdSense initialization failed:', error);
          }
        };

        script.onerror = () => {
          console.warn('Failed to load AdSense script');
        };

        document.head.appendChild(script);
        console.log('AdSense script injected into head');
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadAdSense, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Only render on web
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={[{ 
      width: '100%', 
      minHeight: 90, 
      alignItems: 'center', 
      justifyContent: 'center',
      marginVertical: 10
    }, style]}>
      <div
        ref={adRef}
        style={{
          width: '100%',
          textAlign: 'center',
          minHeight: '90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            minHeight: '90px'
          }}
          data-ad-client="ca-pub-8069198795330862"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive.toString()}
          data-ad-test={testMode ? 'on' : 'off'}
        />
        
        {/* Fallback content - only shows if ad doesn't load */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '12px',
          pointerEvents: 'none',
          zIndex: -1
        }}>
          Advertisement
        </div>
      </div>
    </View>
  );
}

/**
 * Banner Ad Component - Optimized for pause screen
 */
export function BannerAd({ style, testMode = false }) {
  return (
    <AdSense
      adSlot="auto"
      adFormat="auto"
      fullWidthResponsive={true}
      testMode={testMode}
      style={[{
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 8,
        padding: 8,
        marginVertical: 16
      }, style]}
    />
  );
}

/**
 * Rectangle Ad Component - For larger spaces
 */
export function RectangleAd({ style, testMode = false }) {
  return (
    <AdSense
      adSlot="auto"
      adFormat="rectangle"
      fullWidthResponsive={true}
      testMode={testMode}
      style={[{
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 8,
        padding: 8,
        marginVertical: 16,
        minHeight: 250
      }, style]}
    />
  );
}