import React, { useState, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import Icon from './ui/Icon';

const FontTest = () => {
  const [fontStatus, setFontStatus] = useState('Loading...');

  useEffect(() => {
    if (Platform.OS === 'web') {
      const checkFonts = async () => {
        try {
          // Wait for fonts to load
          await document.fonts.ready;
          
          // Test if Ionicons is available
          const testElement = document.createElement('span');
          testElement.style.fontFamily = 'Ionicons, sans-serif';
          testElement.style.position = 'absolute';
          testElement.style.visibility = 'hidden';
          testElement.innerHTML = '&#xf121;';
          document.body.appendChild(testElement);
          
          const computedStyle = window.getComputedStyle(testElement);
          const fontFamily = computedStyle.fontFamily.toLowerCase();
          
          document.body.removeChild(testElement);
          
          if (fontFamily.includes('ionicons')) {
            setFontStatus('✅ Ionicons loaded successfully');
          } else {
            setFontStatus('❌ Ionicons failed to load - using fallbacks');
          }
        } catch (error) {
          setFontStatus(`❌ Error checking fonts: ${error.message}`);
        }
      };

      checkFonts();
    } else {
      setFontStatus('✅ Native platform - fonts handled by RN');
    }
  }, []);

  return (
    <View style={{ padding: 20, backgroundColor: '#f0f0f0', margin: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
        Font Loading Test
      </Text>
      <Text style={{ marginBottom: 10 }}>{fontStatus}</Text>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Text>Icons: </Text>
        <Icon name="checkmark" size={24} color="green" />
        <Icon name="close" size={24} color="red" />
        <Icon name="finger-print" size={24} color="blue" />
        <Icon name="color-palette" size={24} color="purple" />
        <Icon name="keypad" size={24} color="orange" />
        <Icon name="home" size={24} color="black" />
        <Icon name="settings" size={24} color="gray" />
        <Icon name="search" size={24} color="blue" />
      </View>
    </View>
  );
};

export default FontTest;