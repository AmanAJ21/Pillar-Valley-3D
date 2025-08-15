import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions, ScrollView, Animated } from 'react-native';
import Icon from './Icon';
import { COLOR_SCHEMES } from '../../config/gameConfig';
import { colorToHex } from '../../utils/gameUtils';
import { themeManager } from '../../utils/themeManager';
import { HapticFeedback } from '../../utils/hapticUtils';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isTablet = screenWidth >= 768;

/**
 * Apple-style theme selector component
 * Displays themes in a beautiful grid with live previews
 */
export default function ThemeSelector({ 
  currentThemeIndex, 
  onThemeSelect, 
  onClose,
  visible = false 
}) {
  const [selectedIndex, setSelectedIndex] = useState(currentThemeIndex);

  console.log('ThemeSelector render:', { visible, currentThemeIndex, selectedIndex, themesCount: COLOR_SCHEMES.length }); // Debug log

  if (!visible) return null;

  // Debug: Log first few themes
  console.log('First 3 themes:', COLOR_SCHEMES.slice(0, 3));

  const handleThemeSelect = (index) => {
    console.log('Theme selected:', index); // Debug log
    setSelectedIndex(index);
    
    // Enhanced haptic feedback
    try {
      HapticFeedback.selection();
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
    
    // Set theme using theme manager
    try {
      const success = themeManager.setTheme(index);
      console.log('Theme set success:', success); // Debug log
      if (success) {
        onThemeSelect(index);
      }
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  };

  const renderThemePreview = (theme, index) => {
    const isSelected = selectedIndex === index;
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.themeCard,
          isSelected && styles.selectedThemeCard,
          { borderColor: isSelected ? colorToHex(theme.ball) : 'rgba(142, 142, 147, 0.2)' }
        ]}
        onPress={() => {
          console.log('Theme card pressed:', index); // Debug log
          handleThemeSelect(index);
        }}
        activeOpacity={0.6}
        delayPressIn={0}
        delayPressOut={0}
      >
        {/* Enhanced Theme Preview */}
        <View style={styles.themePreview}>
          <View 
            style={[
              styles.previewBackground, 
              { backgroundColor: colorToHex(theme.bg) }
            ]} 
          />
          {/* Multiple pillars for better preview */}
          <View 
            style={[
              styles.previewPillar, 
              { backgroundColor: colorToHex(theme.pillar), left: '20%', height: '60%' }
            ]} 
          />
          <View 
            style={[
              styles.previewPillar, 
              { backgroundColor: colorToHex(theme.pillar), left: '35%', height: '80%' }
            ]} 
          />
          <View 
            style={[
              styles.previewPillar, 
              { backgroundColor: colorToHex(theme.pillar), left: '50%', height: '70%' }
            ]} 
          />
          {/* Glowing ball effect */}
          <View 
            style={[
              styles.previewBallGlow, 
              { backgroundColor: colorToHex(theme.ball) + '40' }
            ]} 
          />
          <View 
            style={[
              styles.previewBall, 
              { backgroundColor: colorToHex(theme.ball) }
            ]} 
          />
        </View>

        {/* Theme Info */}
        <View style={styles.themeInfo}>
          <View style={styles.themeTextContainer}>
            <Text style={[styles.themeName, { color: colorToHex(theme.ball) }]}>
              {theme.name}
            </Text>
            {theme.description && (
              <Text style={styles.themeDescription}>
                {theme.description}
              </Text>
            )}
          </View>
          <Text style={styles.themeIndex}>
            {index + 1} of {COLOR_SCHEMES.length}
          </Text>
        </View>

        {/* Selection Indicator */}
        {isSelected && (
          <View style={[styles.selectionIndicator, { backgroundColor: colorToHex(theme.ball) }]}>
            <Icon name="checkmark" size={16} color="white" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={StyleSheet.absoluteFill} 
        onPress={onClose}
        activeOpacity={1}
      />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Choose Theme</Text>
            <Text style={styles.subtitle}>{COLOR_SCHEMES.length} Beautiful Themes</Text>
          </View>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Icon name="close" size={24} color="rgba(255, 255, 255, 0.8)" />
          </TouchableOpacity>
        </View>

        {/* Theme Grid */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.themeGrid}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {COLOR_SCHEMES.map((theme, index) => {
            console.log('Rendering theme:', index, theme.name); // Debug log
            return renderThemePreview(theme, index);
          })}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Themes change automatically every 10 points during gameplay
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  container: {
    width: isSmallScreen ? '95%' : (isTablet ? '70%' : '85%'),
    maxWidth: isTablet ? 600 : (isSmallScreen ? 350 : 400),
    height: isSmallScreen ? '85%' : '80%', // Fixed height instead of maxHeight
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
    borderRadius: isSmallScreen ? 16 : 20, // Smaller radius on mobile
    borderWidth: 0.5,
    borderColor: 'rgba(142, 142, 147, 0.3)',
    backdropFilter: Platform.OS === 'web' ? 'blur(20px)' : undefined,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingVertical: isSmallScreen ? 16 : 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(142, 142, 147, 0.2)',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: -0.4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(142, 142, 147, 0.8)',
    letterSpacing: -0.08,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(142, 142, 147, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    minHeight: 200, // Ensure minimum height for content
  },
  themeGrid: {
    padding: isSmallScreen ? 12 : 20,
    paddingBottom: isSmallScreen ? 20 : 30,
  },
  themeCard: {
    backgroundColor: 'rgba(44, 44, 46, 0.8)',
    borderRadius: isSmallScreen ? 12 : 16,
    borderWidth: 1,
    padding: isSmallScreen ? 12 : 16,
    marginBottom: isSmallScreen ? 8 : 12,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ scale: 1 }],
  },
  selectedThemeCard: {
    backgroundColor: 'rgba(44, 44, 46, 1)',
    borderWidth: 2,
    shadowColor: 'rgba(0, 122, 255, 0.4)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  themePreview: {
    height: isSmallScreen ? 50 : 60,
    borderRadius: isSmallScreen ? 8 : 12,
    overflow: 'hidden',
    marginBottom: isSmallScreen ? 8 : 12,
    position: 'relative',
  },
  previewBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  previewPillar: {
    position: 'absolute',
    bottom: 0,
    width: '8%',
    borderRadius: 2,
  },
  previewBallGlow: {
    position: 'absolute',
    top: '15%',
    right: '20%',
    width: 18,
    height: 18,
    borderRadius: 9,
    opacity: 0.6,
  },
  previewBall: {
    position: 'absolute',
    top: '18%',
    right: '23%',
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  themeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.32,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
    marginBottom: 2,
  },
  themeDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(142, 142, 147, 0.9)',
    letterSpacing: -0.08,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
    fontStyle: 'italic',
  },
  themeIndex: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(142, 142, 147, 0.8)',
    letterSpacing: -0.24,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
    textAlign: 'right',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  footer: {
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingVertical: isSmallScreen ? 12 : 16,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(142, 142, 147, 0.2)',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(142, 142, 147, 0.8)',
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: -0.08,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
});