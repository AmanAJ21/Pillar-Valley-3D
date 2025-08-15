import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { Canvas } from '@react-three/fiber';
import GameScene from './GameSceneSimple';
import CleanButton from './ui/CleanButton';
import TouchButton from './ui/TouchButton';
import StartMenu from './ui/StartMenu';
import AppleStyleFeedback from './ui/AppleStyleFeedback';
import MobileFullscreenWrapper from './ui/MobileFullscreenWrapper';
import ThemeSelector from './ui/ThemeSelector';
import { BannerAd } from './ads/AdSense';
import { CONFIG, COLOR_SCHEMES } from '../config/gameConfig';
import * as THREE from 'three';
import { createInitialPillars, generateNextPillar } from '../utils/pillarUtils';
import { checkBallCollision, colorToHex } from '../utils/gameUtils';
import { saveGameSettings, loadGameSettings } from '../utils/storageUtils';
import { testHermesCompatibility, testProblematicPatterns } from '../utils/hermesTest';
import { themeManager } from '../utils/themeManager';
import { HapticFeedback } from '../utils/hapticUtils';

// Simplified approach for Hermes compatibility - avoid complex managers

// Simplified responsive design for Hermes compatibility
const screenData = Dimensions.get('window');
const { width: screenWidth, height: screenHeight } = screenData;
const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 375 || screenHeight < 667;
// Removed unused variables for cleaner code

export default function PillarJumpGame() {
  // Test Hermes compatibility on component mount
  useEffect(() => {
    // Testing Hermes compatibility
    try {
      testHermesCompatibility();
      testProblematicPatterns();
    } catch (error) {
      // Hermes test failed
    }
  }, []);

  // Theme manager listener
  useEffect(() => {
    const handleThemeChange = (theme, themeIndex) => {
      setCurrentTheme(theme);
      setCurrentThemeIndex(themeIndex);
    };

    themeManager.addListener(handleThemeChange);

    return () => {
      themeManager.removeListener(handleThemeChange);
    };
  }, []);

  // Removed complex screen dimension listener for Hermes compatibility

  // UI state
  const [feedback, setFeedback] = useState({ visible: false, message: '', type: 'success' });
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Theme state - managed globally
  const [currentTheme, setCurrentTheme] = useState(themeManager.getCurrentTheme());
  const [currentThemeIndex, setCurrentThemeIndex] = useState(themeManager.getCurrentThemeIndex());

  // Game state
  const [game, setGame] = useState(() => {
    try {
      const savedSettings = loadGameSettings();

      return {
        playing: false,
        paused: false,
        score: 0,
        best: savedSettings.bestScore || 0,
        ballAngle: 0,
        ballSpeed: CONFIG.SPEED.BASE,
        ballScale: CONFIG.BALL_SHRINK[0],
        ballDirection: 1,
        pillars: [],
        targetPillarIndex: 0,
        timeOnCurrentPillar: 0,
        lastThemeChangeScore: 0,
        rotationCount: 0,
        showProjection: false
      };
    } catch (error) {
      // Error loading game state, using defaults
      return {
        playing: false,
        paused: false,
        score: 0,
        best: 0,
        ballAngle: 0,
        ballSpeed: CONFIG.SPEED.BASE,
        ballScale: CONFIG.BALL_SHRINK[0],
        ballDirection: 1,
        pillars: [],
        targetPillarIndex: 0,
        timeOnCurrentPillar: 0,
        lastThemeChangeScore: 0,
        rotationCount: 0,
        showProjection: false
      };
    }
  });

  // Enhanced mobile viewport and fullscreen handling
  useEffect(() => {
    // Hide status bar on mobile for fullscreen experience
    if (Platform.OS !== 'web') {
      StatusBar.setHidden(true, 'fade');
    }

    // Enhanced mobile viewport handling for web
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Set viewport meta tag for proper mobile scaling
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
      }
      viewport.setAttribute('content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, shrink-to-fit=no'
      );

      // Set body and html styles for fullscreen
      const originalBodyStyle = document.body.style.cssText;
      const originalHtmlStyle = document.documentElement.style.cssText;
      
      document.body.style.cssText = `
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        -webkit-overflow-scrolling: touch;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      `;
      
      document.documentElement.style.cssText = `
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      `;

      // Prevent zoom on double tap
      let lastTouchEnd = 0;
      const preventZoom = (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      };

      // Prevent context menu and text selection
      const preventContextMenu = (e) => {
        e.preventDefault();
        return false;
      };

      document.addEventListener('touchend', preventZoom, { passive: false });
      document.addEventListener('contextmenu', preventContextMenu, { passive: false });
      document.addEventListener('selectstart', preventContextMenu, { passive: false });

      // Handle orientation changes and resize
      const handleOrientationChange = () => {
        // Force viewport recalculation
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.body.style.height = window.innerHeight + 'px';
          document.documentElement.style.height = window.innerHeight + 'px';
        }, 100);
      };

      window.addEventListener('orientationchange', handleOrientationChange);
      window.addEventListener('resize', handleOrientationChange);
      
      // Initial setup
      handleOrientationChange();

      return () => {
        document.removeEventListener('touchend', preventZoom);
        document.removeEventListener('contextmenu', preventContextMenu);
        document.removeEventListener('selectstart', preventContextMenu);
        window.removeEventListener('orientationchange', handleOrientationChange);
        window.removeEventListener('resize', handleOrientationChange);
        
        // Restore original styles
        document.body.style.cssText = originalBodyStyle;
        document.documentElement.style.cssText = originalHtmlStyle;
      };
    }

    return () => {
      if (Platform.OS !== 'web') {
        StatusBar.setHidden(false, 'fade');
      }
    };
  }, []);

  // Save game settings when they change
  useEffect(() => {
    const settings = {
      bestScore: game.best
    };
    saveGameSettings(settings);
  }, [game.best]);

  const startGame = useCallback(() => {
    try {
      // Create initial pillars with validation
      const pillars = createInitialPillars();

      // Game start haptic
      HapticFeedback.success();

      // Reset state managers for new game - simplified for Hermes compatibility
      // Starting new game with theme

      setGame(prevGame => ({
        playing: true,
        paused: false,
        score: 0,
        best: Math.max(prevGame.score, prevGame.best),
        ballAngle: 0,
        ballSpeed: CONFIG.SPEED.BASE,
        ballScale: CONFIG.BALL_SHRINK[0],
        ballDirection: 1,
        pillars: pillars,
        targetPillarIndex: 0,
        timeOnCurrentPillar: 0,
        lastThemeChangeScore: 0,
        rotationCount: 0,
        showProjection: false
      }));
    } catch (error) {
      // Error starting game
      HapticFeedback.error();
      // Fallback to basic game start
      setGame(prevGame => ({
        ...prevGame,
        playing: true,
        paused: false,
        score: 0,
        pillars: createInitialPillars(),
        targetPillarIndex: 0,
        timeOnCurrentPillar: 0
      }));
    }
  }, [currentTheme]);

  const endGame = useCallback(() => {
    setGame(prevGame => ({
      ...prevGame,
      playing: false,
      best: Math.max(prevGame.score, prevGame.best)
    }));
  }, []);

  const jump = useCallback(() => {
    if (!game.playing || game.paused) return;

    // Prevent rapid tapping on mobile - very responsive
    const now = Date.now();
    if (jump.lastCall && now - jump.lastCall < 30) return; // Reduced from 50ms to 30ms for snappier response
    jump.lastCall = now;

    try {
      const hitIndex = checkBallCollision(game);
      if (hitIndex === -1) {
        // Game over haptic
        HapticFeedback.error();
        endGame();
        return;
      }

      // Successful jump haptic
      HapticFeedback.medium();

      setGame(prevGame => ({
        ...prevGame,
        targetPillarIndex: hitIndex
      }));
    } catch (error) {
      // Error during jump
      HapticFeedback.error();
      endGame();
    }
  }, [game, endGame]);

  // Show projection on click/tap (separate from jump)
  const showProjection = useCallback(() => {
    if (!game.playing || game.paused) return;

    setGame(prevGame => ({
      ...prevGame,
      showProjection: true
    }));
  }, [game.playing, game.paused]);

  const togglePause = useCallback(() => {
    if (!game.playing) return;
    setGame(prevGame => ({ ...prevGame, paused: !prevGame.paused }));
  }, [game.playing]);

  const changeTheme = useCallback((themeIndex) => {
    // changeTheme called
    if (themeIndex !== undefined) {
      // Set specific theme
      const success = themeManager.setTheme(themeIndex);
      // Theme set result
      if (success) {
        const newTheme = themeManager.getCurrentTheme();
        // Theme change haptic
        HapticFeedback.selection();
        // Show feedback with auto-hide
        setFeedback({
          visible: true,
          message: `Theme: ${newTheme.name}`,
          type: 'success'
        });
        // Auto-hide after 1.5 seconds for snappier UX
        setTimeout(() => {
          setFeedback(prev => ({ ...prev, visible: false }));
        }, 1500);
      }
    } else {
      // Show theme selector
      // Opening theme selector
      HapticFeedback.light();
      setShowThemeSelector(true);
    }
  }, []);

  const handleThemeSelect = useCallback((themeIndex) => {
    // handleThemeSelect called
    changeTheme(themeIndex);
    setShowThemeSelector(false);
  }, [changeTheme]);

  const onPillarReached = useCallback(() => {
    setGame(prevGame => {
      try {
        const hitIndex = prevGame.targetPillarIndex;
        const newScore = prevGame.score + hitIndex;

        // Remove passed pillars with validation
        const remainingPillars = prevGame.pillars.slice(hitIndex);

        // Add new pillars to maintain count
        const newPillars = [...remainingPillars];
        while (newPillars.length < CONFIG.PILLAR_COUNT) {
          const newPillar = generateNextPillar(newPillars);
          newPillars.push(newPillar);
        }

        // Validate new pillars array - simplified for Hermes compatibility
        if (newPillars.length === 0) {
          // Invalid pillar array generated, keeping previous pillars
          return prevGame;
        }

        // Check if we should change theme (every 10 points)
        const lastThemeChangeScore = prevGame.lastThemeChangeScore || 0;
        const shouldChangeTheme = newScore > 0 && newScore >= lastThemeChangeScore + 10;
        let newLastThemeChangeScore = lastThemeChangeScore;

        if (shouldChangeTheme) {
          // Set random theme using theme manager
          themeManager.setRandomTheme();
          newLastThemeChangeScore = newScore;

          // Theme change haptic
          HapticFeedback.success();

          // Show theme change feedback with auto-hide (like web)
          setTimeout(() => {
            const newTheme = themeManager.getCurrentTheme();
            setFeedback({
              visible: true,
              message: `🎨 New theme: ${newTheme.name}`,
              type: 'success'
            });
            // Auto-hide after 2.5 seconds like web
            setTimeout(() => {
              setFeedback(prev => ({ ...prev, visible: false }));
            }, 2500);
          }, 300); // Reduced delay for quicker feedback
        }

        // Score increase haptic
        HapticFeedback.light();

        // Calculate new speed - increase by 0.2 each pillar (2.0, 2.2, 2.4, etc.)
        const newSpeed = CONFIG.SPEED.BASE + (newScore * CONFIG.SPEED.SCORE_INCREMENT);

        return {
          ...prevGame,
          score: newScore,
          best: Math.max(newScore, prevGame.best),
          ballSpeed: newSpeed,
          ballScale: 1, // Reset scale after jump, will shrink during rotation
          ballDirection: prevGame.ballDirection * -1,
          ballAngle: (prevGame.ballAngle + 180) % 360,
          pillars: newPillars,
          targetPillarIndex: 0,
          timeOnCurrentPillar: 0,
          lastThemeChangeScore: newLastThemeChangeScore
        };
      } catch (error) {
        // Error in onPillarReached
        // Return previous game state on error
        return prevGame;
      }
    });
  }, []);

  // Keyboard controls (web only, but mobile gets same functionality through UI)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleKeyPress = (event) => {
        if (event.code === 'Space' || event.key === ' ') {
          event.preventDefault();
          if (game.playing && !game.paused) {
            jump();
          } else if (!game.playing) {
            startGame();
          }
        } else if (event.code === 'KeyP') {
          event.preventDefault();
          togglePause();
        } else if (event.code === 'Escape') {
          event.preventDefault();
          if (game.playing && !game.paused) {
            togglePause();
          }
        } else if (event.code === 'KeyT') {
          event.preventDefault();
          changeTheme();
        } else if (event.code === 'Enter') {
          event.preventDefault();
          if (!game.playing) {
            startGame();
          }
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [game.playing, game.paused, jump, startGame, togglePause, changeTheme]);

  // Add error boundary for 3D rendering issues
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      // Game rendering error
      if ((error.message && error.message.includes('WebGL')) || (error.message && error.message.includes('three'))) {
        setRenderError(true);
      }
    };

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('error', handleError);
    }
    return () => {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('error', handleError);
      }
    };
  }, []);

  if (renderError) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 18, padding: 20 }}>
          3D rendering not supported on this device.{'\n'}
          Please try updating your browser or using a different device.
        </Text>
      </View>
    );
  }

  return (
    <MobileFullscreenWrapper>
      <View style={styles.container}>
      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [0, CONFIG.CAMERA.Y, CONFIG.CAMERA.Z],
          fov: CONFIG.CAMERA.FOV,
          near: 0.1,
          far: 200
        }}
        style={styles.canvas}
        shadows={false}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "default",
          precision: 'mediump',
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false
        }}
        dpr={Platform.OS === 'web' ? Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 2) : Math.min(2, 1.5)}
        frameloop="always"
        performance={{
          min: Platform.OS === 'web' ? 0.8 : 0.3,
          max: 1,
          debounce: Platform.OS === 'web' ? 200 : 100
        }}
        dpr={1}
        frameloop="always"
      >
        <color attach="background" args={[currentTheme.bg]} />
        <GameScene
          game={game}
          onPillarReached={onPillarReached}
          setGame={setGame}
          endGame={endGame}
        />
      </Canvas>

      {/* Enhanced Score Display */}
      {game.playing && (
        <View style={styles.gameUI}>
          <View style={[styles.scoreContainer, { 
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderColor: colorToHex(currentTheme.ball) + '40'
          }]}>
            <Text style={[styles.gameScore, { color: colorToHex(currentTheme.ball) }]}>
              {game.score}
            </Text>
            <Text style={[styles.bestScoreSmall, { color: 'rgba(255, 255, 255, 0.8)' }]}>
              BEST: {game.best}
            </Text>
          </View>

          {/* Speed and Size indicators */}
          <View style={[styles.gameStats, { 
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderColor: colorToHex(currentTheme.ball) + '30'
          }]}>
            <Text style={[styles.statText, { color: colorToHex(currentTheme.ball) }]}>
              {game.ballSpeed.toFixed(1)}x
            </Text>
            <Text style={[styles.statText, { color: colorToHex(currentTheme.ball) }]}>
              {(game.ballScale * 100).toFixed(0)}%
            </Text>
          </View>

          {/* Next theme change indicator */}
          {game.score > 0 && (
            <View style={[styles.nextThemeIndicator, { 
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              borderColor: colorToHex(currentTheme.ball) + '25'
            }]}>
              <Text style={[styles.nextThemeText, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                Next theme: {10 - (game.score % 10)} pts
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Touch area for jumping and projection */}
      {game.playing && !game.paused && (
        <TouchableOpacity
          style={styles.touchArea}
          onPressIn={showProjection} // Show projection when touch starts
          onPress={jump} // Jump when touch ends
          activeOpacity={1}
        />
      )}

      {/* In-Game Controls - Unified for all platforms */}
      {game.playing && !game.paused && (
        <View style={styles.inGamePauseButtonContainer}>
          <TouchButton
            icon="pause"
            variant="primary"
            size="medium"
            onPress={togglePause}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderColor: colorToHex(currentTheme.ball) + '60'
            }}
          />
        </View>
      )}

      {/* Enhanced Pause Screen */}
      {game.playing && game.paused && (
        <View style={[styles.pauseOverlay, { backgroundColor: colorToHex(currentTheme.bg) + '95' }]}>
          <View style={styles.pauseContent}>
            <Text style={[styles.pauseTitle, { color: colorToHex(currentTheme.ball) }]}>
              GAME PAUSED
            </Text>

            {/* Game Statistics */}
            <View style={[styles.pauseStatsContainer, {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderColor: colorToHex(currentTheme.ball) + '40'
            }]}>
              <View style={styles.pauseStatsRow}>
                <View style={styles.pauseStatItem}>
                  <Text style={[styles.pauseStatLabel, { color: colorToHex(currentTheme.ball) }]}>SCORE</Text>
                  <Text style={[styles.pauseStatValue, { color: colorToHex(currentTheme.ball) }]}>{game.score}</Text>
                </View>
                <View style={styles.pauseStatItem}>
                  <Text style={[styles.pauseStatLabel, { color: colorToHex(currentTheme.ball) }]}>BEST</Text>
                  <Text style={[styles.pauseStatValue, { color: colorToHex(currentTheme.ball) }]}>{game.best}</Text>
                </View>
              </View>
              <View style={styles.pauseStatsRow}>
                <View style={styles.pauseStatItem}>
                  <Text style={[styles.pauseStatLabel, { color: colorToHex(currentTheme.ball) }]}>SPEED</Text>
                  <Text style={[styles.pauseStatValue, { color: colorToHex(currentTheme.ball) }]}>{game.ballSpeed.toFixed(1)}x</Text>
                </View>
                <View style={styles.pauseStatItem}>
                  <Text style={[styles.pauseStatLabel, { color: colorToHex(currentTheme.ball) }]}>SIZE</Text>
                  <Text style={[styles.pauseStatValue, { color: colorToHex(currentTheme.ball) }]}>{(game.ballScale * 100).toFixed(0)}%</Text>
                </View>
              </View>
            </View>

            {/* AdSense Banner - Only on Web */}
            <BannerAd 
              testMode={false} // Set to true for testing
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderColor: colorToHex(currentTheme.ball) + '30',
                borderWidth: 1
              }}
            />

            {/* Primary Action Buttons */}
            <View style={styles.pausePrimaryActions}>
              <CleanButton
                title="RESUME GAME"
                icon="play"
                variant="accent"
                size="large"
                onPress={togglePause}
                iconColor={colorToHex(currentTheme.ball)}
                style={[styles.primaryButton, {
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderColor: colorToHex(currentTheme.ball) + '60'
                }]}
              />

              <CleanButton
                title="NEW GAME"
                icon="refresh"
                variant="primary"
                size="large"
                onPress={startGame}
                iconColor={colorToHex(currentTheme.ball)}
                style={[styles.primaryButton, {
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  borderColor: colorToHex(currentTheme.ball) + '50'
                }]}
              />
            </View>

            {/* Theme Controls */}
            <View style={[styles.themeControls, {
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
              borderColor: colorToHex(currentTheme.ball) + '30'
            }]}>
              <CleanButton
                title="SELECT THEME"
                icon="color-palette"
                variant="secondary"
                size="medium"
                onPress={() => changeTheme()}
                iconColor={colorToHex(currentTheme.ball)}
                style={[styles.themeButton, {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  borderColor: colorToHex(currentTheme.ball) + '40'
                }]}
              />
              <Text style={[styles.themeInfo, { color: colorToHex(currentTheme.ball) }]}>
                {currentTheme.name} ({currentThemeIndex + 1}/{COLOR_SCHEMES.length})
              </Text>
            </View>

            <Text style={[styles.pauseInstructions, { color: colorToHex(currentTheme.ball) }]}>
              {Platform.OS === 'web' ?
                'P: Resume • ESC: Pause • SPACE: Jump • T: Change Theme' :
                'Touch and hold to see projection • Release to jump • Themes change every 10 points'
              }
            </Text>
          </View>
        </View>
      )}

      {/* Enhanced Start Menu */}
      {!game.playing && (
        <StartMenu
          game={{ ...game, currentThemeIndex }}
          onStartGame={startGame}
          onChangeTheme={changeTheme}
          colors={currentTheme}
        />
      )}

      {/* Apple-style Feedback */}
      <AppleStyleFeedback
        visible={feedback.visible}
        message={feedback.message}
        type={feedback.type}
        onHide={() => setFeedback({ ...feedback, visible: false })}
      />

      {/* Theme Selector Modal */}
      <ThemeSelector
        visible={showThemeSelector}
        currentThemeIndex={currentThemeIndex}
        onThemeSelect={handleThemeSelect}
        onClose={() => setShowThemeSelector(false)}
      />
    </View>
    </MobileFullscreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Mobile-specific fullscreen styles
    ...(Platform.OS !== 'web' && {
      paddingTop: 0,
      paddingBottom: 0,
    }),
    // Web mobile fullscreen styles
    ...(Platform.OS === 'web' && {
      minHeight: '100vh',
      minWidth: '100vw',
    }),
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Ensure canvas takes full screen on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: 'transparent',
    }),
    // Web mobile canvas styles
    ...(Platform.OS === 'web' && {
      minHeight: '100vh',
      minWidth: '100vw',
    }),
  },
  touchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: isSmallScreen ? 100 : 120, // Unified bottom spacing for all platforms
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  gameUI: {
    position: 'absolute',
    top: Platform.OS === 'web' ? (isSmallScreen ? 30 : 50) : 40,
    right: isSmallScreen ? 10 : 20,
    alignItems: 'flex-end',
    pointerEvents: 'box-none',
    maxWidth: isSmallScreen ? 120 : 150,
  },
  scoreContainer: {
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingVertical: isSmallScreen ? 12 : 16,
    borderRadius: isSmallScreen ? 16 : 20, // Apple's preferred radius
    alignItems: 'center',
    marginBottom: isSmallScreen ? 8 : 12,
    backdropFilter: 'blur(20px)', // Stronger blur for Apple effect
    borderWidth: 1, // More visible border
    minWidth: isSmallScreen ? 90 : 110,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  gameScore: {
    fontSize: isSmallScreen ? 36 : (isTablet ? 60 : 52),
    fontWeight: '800', // Apple's extra bold
    letterSpacing: -0.6, // Apple's letter spacing
    lineHeight: isSmallScreen ? 40 : (isTablet ? 64 : 56),
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  bestScoreSmall: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.9,
    marginTop: 4,
    letterSpacing: -0.08,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  gameStats: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16, // Apple's radius
    justifyContent: 'space-between',
    minWidth: 90,
    backdropFilter: 'blur(20px)',
    borderWidth: 1, // More visible border
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statText: {
    fontSize: 15,
    fontWeight: '600', // Apple's preferred weight
    opacity: 1,
    letterSpacing: -0.24,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  nextThemeIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  nextThemeText: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.8,
    textAlign: 'center',
  },
  inGamePauseButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? (isSmallScreen ? 50 : 60) : (isSmallScreen ? 30 : 40),
    left: isSmallScreen ? 15 : 20,
    zIndex: 1000,
  },


  // Pause screen styles
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: isSmallScreen ? 12 : (isTablet ? 20 : 16),
    zIndex: 1000,
  },
  pauseContent: {
    alignItems: 'center',
    maxWidth: isSmallScreen ? 320 : (isTablet ? 450 : 350),
    width: '100%',
  },
  pauseTitle: {
    fontSize: isSmallScreen ? 28 : (isTablet ? 42 : 36),
    fontWeight: '700', // Apple's bold weight
    marginBottom: isSmallScreen ? 16 : (isTablet ? 24 : 20),
    textAlign: 'center',
    letterSpacing: -0.6, // Apple's letter spacing for large text
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  pauseStatsContainer: {
    width: '100%',
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.08)', // iOS Blue tint
    borderWidth: 0.5,
    borderColor: 'rgba(0, 122, 255, 0.2)',
    backdropFilter: Platform.OS === 'web' ? 'blur(20px)' : undefined,
  },
  pauseStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pauseStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  pauseStatLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
    marginBottom: 4,
    letterSpacing: -0.08, // Apple's subtle letter spacing
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  pauseStatValue: {
    fontSize: 24,
    fontWeight: '700', // Apple's bold weight
    letterSpacing: -0.5,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  pausePrimaryActions: {
    width: '100%',
    gap: 12,
    marginBottom: 18,
  },
  primaryButton: {
    marginBottom: 8,
    alignSelf: 'center',
  },
  themeControls: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 14,
    backgroundColor: 'rgba(142, 142, 147, 0.06)', // iOS Gray tint
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(142, 142, 147, 0.15)',
    backdropFilter: Platform.OS === 'web' ? 'blur(20px)' : undefined,
  },
  themeButton: {
    marginBottom: 6,
    alignSelf: 'center',
  },
  themeInfo: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
    textAlign: 'center',
  },
  pauseInstructions: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 18,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: isSmallScreen ? 20 : (isTablet ? 60 : 40),
    zIndex: 1000,
  },
  title: {
    fontSize: isSmallScreen ? 34 : (isTablet ? 56 : 46),
    fontWeight: '800', // Extra bold for Apple-style impact
    marginBottom: isSmallScreen ? 20 : 24,
    textAlign: 'center',
    letterSpacing: -0.8, // Apple's letter spacing for large titles
    lineHeight: isSmallScreen ? 38 : (isTablet ? 60 : 50),
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 25,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  finalScore: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bestScore: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    opacity: 0.8,
  },
  themeIndicator: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingVertical: isSmallScreen ? 6 : 8,
    borderRadius: isSmallScreen ? 16 : 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: isSmallScreen ? 15 : 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIndicatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeIndicatorText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.9,
  },
  mainStartButton: {
    alignSelf: 'center',
    marginBottom: isSmallScreen ? 25 : (isTablet ? 45 : 35),
  },
  startScreenActions: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 25,
  },
  actionButton: {
    marginBottom: 10,
    alignSelf: 'center',
  },
  themeCounter: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
    textAlign: 'center',
  },
  instructionsContainer: {
    alignItems: 'center',
  },
  instructions: {
    fontSize: isSmallScreen ? 12 : (isTablet ? 16 : 14),
    textAlign: 'center',
    lineHeight: isSmallScreen ? 16 : (isTablet ? 24 : 20),
    opacity: 0.7,
    paddingHorizontal: isSmallScreen ? 10 : 0,
  },
});