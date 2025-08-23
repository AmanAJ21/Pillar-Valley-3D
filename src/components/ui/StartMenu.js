import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, Animated } from 'react-native';
import Icon from './Icon';
import CleanButton from './CleanButton';
import ThemeSelector from './ThemeSelector';
import { COLOR_SCHEMES } from '../../config/gameConfig';
import { colorToHex } from '../../utils/gameUtils';
import { themeManager } from '../../utils/themeManager';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375 || screenHeight < 667;
const isTablet = screenWidth >= 768;

/**
 * Enhanced Apple-style start menu
 * Beautiful, modern design with theme selection and game stats
 */
export default function StartMenu({
  game,
  onStartGame,
  onChangeTheme,
  colors
}) {
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleThemeSelect = (themeIndex) => {
    themeManager.setTheme(themeIndex);
    setShowThemeSelector(false);
  };

  const handleStartGame = () => {
    // Fade out animation before starting
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onStartGame();
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Background Gradient Effect */}
      <View style={[styles.backgroundGradient, { backgroundColor: colorToHex(colors.bg) }]} />
      
      {/* Main Content */}
      <View style={styles.content}>
        {/* Game Logo/Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colorToHex(colors.ball) }]}>
            PILLAR VALLEY
          </Text>
          <Text style={[styles.subtitle, { color: colorToHex(colors.ball) }]}>
            3D
          </Text>
          <View style={[styles.titleUnderline, { backgroundColor: colorToHex(colors.ball) }]} />
        </View>

        {/* Game Stats */}
        {(game.score > 0 || game.best > 0) && (
          <View style={[styles.statsSection, { 
            backgroundColor: colorToHex(colors.ball) + '10',
            borderColor: colorToHex(colors.ball) + '30'
          }]}>
            {game.score > 0 && (
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colorToHex(colors.ball) }]}>
                  LAST SCORE
                </Text>
                <Text style={[styles.statValue, { color: colorToHex(colors.ball) }]}>
                  {game.score}
                </Text>
              </View>
            )}
            
            {game.best > 0 && (
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colorToHex(colors.ball) }]}>
                  BEST SCORE
                </Text>
                <Text style={[styles.statValue, { color: colorToHex(colors.ball) }]}>
                  {game.best}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Current Theme Display */}
        <View style={[styles.currentTheme, {
          backgroundColor: colorToHex(colors.ball) + '08',
          borderColor: colorToHex(colors.ball) + '20'
        }]}>
          <View style={styles.themePreview}>
            <View style={[styles.previewBg, { backgroundColor: colorToHex(colors.bg) }]} />
            {/* Multiple pillars for better preview */}
            <View style={[styles.previewPillar, { backgroundColor: colorToHex(colors.pillar), left: '20%', height: '60%' }]} />
            <View style={[styles.previewPillar, { backgroundColor: colorToHex(colors.pillar), left: '35%', height: '80%' }]} />
            <View style={[styles.previewPillar, { backgroundColor: colorToHex(colors.pillar), left: '50%', height: '70%' }]} />
            {/* Glowing ball effect */}
            <View style={[styles.previewBallGlow, { backgroundColor: colorToHex(colors.ball) + '40' }]} />
            <View style={[styles.previewBall, { backgroundColor: colorToHex(colors.ball) }]} />
          </View>
          <View style={styles.themeInfo}>
            <Text style={[styles.themeName, { color: colorToHex(colors.ball) }]}>
              {colors.name}
            </Text>
            <Text style={[styles.themeCount, { color: colorToHex(colors.ball) }]}>
              Theme {game.currentThemeIndex + 1} of {COLOR_SCHEMES.length}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <CleanButton
            title={game.score > 0 ? 'PLAY AGAIN' : 'START GAME'}
            icon={game.score > 0 ? 'refresh' : 'play'}
            variant="accent"
            size="large"
            onPress={handleStartGame}
            iconColor={colorToHex(colors.ball)}
            style={[styles.primaryButton, {
              backgroundColor: colorToHex(colors.ball) + '20',
              borderColor: colorToHex(colors.ball) + '40'
            }]}
          />

          <CleanButton
            title="SELECT THEME"
            icon="color-palette"
            variant="secondary"
            size="medium"
            onPress={() => setShowThemeSelector(true)}
            iconColor={colorToHex(colors.ball)}
            style={[styles.secondaryButton, {
              backgroundColor: colorToHex(colors.ball) + '10',
              borderColor: colorToHex(colors.ball) + '25'
            }]}
          />
        </View>

        {/* Game Instructions */}
        <View style={styles.instructions}>
          <View style={styles.instructionItem}>
            <Icon 
              name="finger-print" 
              size={20} 
              color={colorToHex(colors.ball) + '80'} 
            />
            <Text style={[styles.instructionText, { color: colorToHex(colors.ball) }]}>
              Tap anywhere to jump when over a pillar
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <Icon 
              name="color-palette" 
              size={20} 
              color={colorToHex(colors.ball) + '80'} 
            />
            <Text style={[styles.instructionText, { color: colorToHex(colors.ball) }]}>
              Themes change automatically every 10 points
            </Text>
          </View>

          {Platform.OS === 'web' && (
            <View style={styles.instructionItem}>
              <Icon 
                name="keypad" 
                size={20} 
                color={colorToHex(colors.ball) + '80'} 
              />
              <Text style={[styles.instructionText, { color: colorToHex(colors.ball) }]}>
                SPACE: Jump • P: Pause • T: Change Theme
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Theme Selector Modal */}
      <ThemeSelector
        visible={showThemeSelector}
        currentThemeIndex={game.currentThemeIndex}
        onThemeSelect={handleThemeSelect}
        onClose={() => setShowThemeSelector(false)}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.95,
  },
  content: {
    alignItems: 'center',
    maxWidth: isSmallScreen ? 320 : (isTablet ? 500 : 400),
    width: '90%',
    paddingHorizontal: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: isSmallScreen ? 32 : 40,
  },
  title: {
    fontSize: isSmallScreen ? 36 : (isTablet ? 64 : 52),
    fontWeight: '800',
    letterSpacing: -1.2,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: isSmallScreen ? 24 : (isTablet ? 40 : 32),
    fontWeight: '300',
    letterSpacing: 2,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
    opacity: 0.8,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    borderRadius: 2,
    marginTop: 12,
    opacity: 0.6,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 0.5,
    marginBottom: 24,
    backdropFilter: Platform.OS === 'web' ? 'blur(20px)' : undefined,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
    opacity: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  currentTheme: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 0.5,
    marginBottom: 32,
    backdropFilter: Platform.OS === 'web' ? 'blur(20px)' : undefined,
  },
  themePreview: {
    width: 50,
    height: 30,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
    position: 'relative',
  },
  previewBg: {
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
    borderRadius: 1,
  },
  previewBallGlow: {
    position: 'absolute',
    top: '10%',
    right: '20%',
    width: 12,
    height: 12,
    borderRadius: 6,
    opacity: 0.6,
  },
  previewBall: {
    position: 'absolute',
    top: '12%',
    right: '22%',
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 2,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.32,
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  themeCount: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.08,
    opacity: 0.7,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  actionButtons: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  primaryButton: {
    alignSelf: 'center',
    minWidth: '80%',
  },
  secondaryButton: {
    alignSelf: 'center',
    minWidth: '70%',
  },
  instructions: {
    width: '100%',
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  instructionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
    opacity: 0.8,
    letterSpacing: -0.24,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
    flex: 1,
  },
});