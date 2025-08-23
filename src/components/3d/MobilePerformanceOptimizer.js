import { Platform, Dimensions } from 'react-native';

/**
 * Mobile performance optimizer with device capability detection
 * Handles dynamic quality adjustment and performance monitoring
 */
export class MobilePerformanceOptimizer {
  constructor() {
    this.deviceCapabilities = this.detectDeviceCapabilities();
    this.performanceMetrics = {
      frameRate: 60,
      averageFrameTime: 16.67,
      memoryUsage: 0,
      renderTime: 0,
      lastFrameTime: performance.now()
    };
    
    this.qualitySettings = this.initializeQualitySettings();
    this.frameTimeHistory = [];
    this.maxHistoryLength = 60; // 1 second at 60fps
    this.adaptiveQualityEnabled = true;
    this.lastQualityAdjustment = 0;
    this.qualityAdjustmentCooldown = 2000; // 2 seconds
  }

  /**
   * Detect device capabilities
   */
  detectDeviceCapabilities() {
    const { width, height } = Dimensions.get('window');
    const screenArea = width * height;
    const isWeb = Platform.OS === 'web';
    const isTablet = width >= 768;
    
    // Detect device tier based on screen size and platform
    let deviceTier = 'low';
    
    if (isWeb) {
      deviceTier = 'high';
    } else if (isTablet || screenArea > 800000) {
      deviceTier = 'medium';
    } else if (screenArea > 400000) {
      deviceTier = 'medium';
    }
    
    // Additional capability detection
    const capabilities = {
      deviceTier,
      screenWidth: width,
      screenHeight: height,
      screenArea,
      pixelRatio: isWeb ? (window.devicePixelRatio || 1) : 2,
      isTablet,
      isWeb,
      isMobile: Platform.OS !== 'web',
      
      // Estimated capabilities
      supportsHighQualityShaders: deviceTier !== 'low',
      supportsComplexGeometry: deviceTier === 'high' || isTablet,
      supportsShadows: deviceTier !== 'low',
      supportsAntialiasing: deviceTier === 'high',
      supportsHighResTextures: deviceTier === 'high' || isTablet,
      
      // Performance targets
      targetFPS: deviceTier === 'high' ? 60 : (deviceTier === 'medium' ? 45 : 30),
      maxGeometryComplexity: deviceTier === 'high' ? 32 : (deviceTier === 'medium' ? 16 : 8)
    };
    
    return capabilities;
  }

  /**
   * Initialize quality settings based on device capabilities
   */
  initializeQualitySettings() {
    const caps = this.deviceCapabilities;
    
    return {
      // Geometry quality
      pillarSegments: caps.maxGeometryComplexity,
      ballSegments: Math.min(caps.maxGeometryComplexity, 16),
      
      // Rendering quality
      pixelRatio: Math.min(caps.pixelRatio, caps.deviceTier === 'high' ? 2 : 1.5),
      shadowMapSize: caps.supportsShadows ? 
        (caps.deviceTier === 'high' ? 2048 : 1024) : 512,
      
      // Effects
      enableShadows: caps.supportsShadows,
      enableAntialiasing: caps.supportsAntialiasing,
      enableFog: true,
      enableBloom: caps.deviceTier === 'high',
      
      // LOD settings
      pillarLODDistance: caps.deviceTier === 'high' ? 50 : 30,
      ballLODDistance: caps.deviceTier === 'high' ? 30 : 20,
      
      // Performance
      targetFrameTime: 1000 / caps.targetFPS,
      qualityLevel: caps.deviceTier
    };
  }

  /**
   * Update performance metrics
   */
  updatePerformanceMetrics(frameTime) {
    const now = performance.now();
    const deltaTime = now - this.performanceMetrics.lastFrameTime;
    
    this.performanceMetrics.lastFrameTime = now;
    this.performanceMetrics.renderTime = frameTime || deltaTime;
    
    // Update frame time history
    this.frameTimeHistory.push(deltaTime);
    if (this.frameTimeHistory.length > this.maxHistoryLength) {
      this.frameTimeHistory.shift();
    }
    
    // Calculate average frame rate
    if (this.frameTimeHistory.length > 0) {
      const avgFrameTime = this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length;
      this.performanceMetrics.averageFrameTime = avgFrameTime;
      this.performanceMetrics.frameRate = 1000 / avgFrameTime;
    }
    
    // Check if quality adjustment is needed
    if (this.adaptiveQualityEnabled) {
      this.checkAndAdjustQuality();
    }
  }

  /**
   * Check performance and adjust quality if needed
   */
  checkAndAdjustQuality() {
    const now = performance.now();
    
    // Cooldown check
    if (now - this.lastQualityAdjustment < this.qualityAdjustmentCooldown) {
      return;
    }
    
    const targetFrameTime = this.qualitySettings.targetFrameTime;
    const currentFrameTime = this.performanceMetrics.averageFrameTime;
    const frameRateRatio = targetFrameTime / currentFrameTime;
    
    // If performance is significantly below target, reduce quality
    if (frameRateRatio < 0.8 && this.qualitySettings.qualityLevel !== 'low') {
      this.reduceQuality();
      this.lastQualityAdjustment = now;
    }
    // If performance is significantly above target, increase quality
    else if (frameRateRatio > 1.2 && this.qualitySettings.qualityLevel !== 'high') {
      this.increaseQuality();
      this.lastQualityAdjustment = now;
    }
  }

  /**
   * Reduce quality settings
   */
  reduceQuality() {
    const settings = this.qualitySettings;
    
    // Reduce geometry complexity
    settings.pillarSegments = Math.max(8, settings.pillarSegments - 4);
    settings.ballSegments = Math.max(8, settings.ballSegments - 2);
    
    // Reduce rendering quality
    settings.pixelRatio = Math.max(1, settings.pixelRatio - 0.25);
    settings.shadowMapSize = Math.max(512, settings.shadowMapSize / 2);
    
    // Disable effects
    if (settings.enableBloom) {
      settings.enableBloom = false;
    } else if (settings.enableAntialiasing) {
      settings.enableAntialiasing = false;
    } else if (settings.enableShadows) {
      settings.enableShadows = false;
    }
    
    // Update quality level
    if (settings.qualityLevel === 'high') {
      settings.qualityLevel = 'medium';
    } else if (settings.qualityLevel === 'medium') {
      settings.qualityLevel = 'low';
    }
    
    // Performance: Quality reduced
  }

  /**
   * Increase quality settings
   */
  increaseQuality() {
    const settings = this.qualitySettings;
    const caps = this.deviceCapabilities;
    
    // Increase geometry complexity
    settings.pillarSegments = Math.min(caps.maxGeometryComplexity, settings.pillarSegments + 4);
    settings.ballSegments = Math.min(16, settings.ballSegments + 2);
    
    // Increase rendering quality
    settings.pixelRatio = Math.min(caps.pixelRatio, settings.pixelRatio + 0.25);
    settings.shadowMapSize = Math.min(2048, settings.shadowMapSize * 2);
    
    // Enable effects
    if (!settings.enableShadows && caps.supportsShadows) {
      settings.enableShadows = true;
    } else if (!settings.enableAntialiasing && caps.supportsAntialiasing) {
      settings.enableAntialiasing = true;
    } else if (!settings.enableBloom && caps.deviceTier === 'high') {
      settings.enableBloom = true;
    }
    
    // Update quality level
    if (settings.qualityLevel === 'low') {
      settings.qualityLevel = 'medium';
    } else if (settings.qualityLevel === 'medium') {
      settings.qualityLevel = 'high';
    }
    
    // Performance: Quality increased
  }

  /**
   * Get optimized geometry segments for pillar
   */
  getPillarSegments(distance = 0) {
    const baseSegments = this.qualitySettings.pillarSegments;
    
    // Apply LOD based on distance
    if (distance > this.qualitySettings.pillarLODDistance) {
      return Math.max(8, Math.floor(baseSegments * 0.5));
    } else if (distance > this.qualitySettings.pillarLODDistance * 0.5) {
      return Math.max(12, Math.floor(baseSegments * 0.75));
    }
    
    return baseSegments;
  }

  /**
   * Get optimized material settings
   */
  getMaterialSettings(distance = 0, opacity = 1) {
    const settings = {
      transparent: opacity < 1,
      opacity: opacity,
      fog: this.qualitySettings.enableFog
    };
    
    // Simplify materials for distant objects
    if (distance > this.qualitySettings.pillarLODDistance) {
      settings.shininess = 10;
      settings.specular = 0x000000;
    } else {
      settings.shininess = 30;
      settings.specular = 0x111111;
    }
    
    return settings;
  }

  /**
   * Check if shadows should be enabled for this object
   */
  shouldEnableShadows(distance = 0) {
    return this.qualitySettings.enableShadows && 
           distance < this.qualitySettings.pillarLODDistance;
  }

  /**
   * Get current quality settings
   */
  getQualitySettings() {
    return { ...this.qualitySettings };
  }

  /**
   * Get device capabilities
   */
  getDeviceCapabilities() {
    return { ...this.deviceCapabilities };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  /**
   * Enable/disable adaptive quality
   */
  setAdaptiveQuality(enabled) {
    this.adaptiveQualityEnabled = enabled;
  }

  /**
   * Force quality level
   */
  setQualityLevel(level) {
    if (['low', 'medium', 'high'].includes(level)) {
      this.qualitySettings.qualityLevel = level;
      this.qualitySettings = this.initializeQualitySettings();
      this.qualitySettings.qualityLevel = level;
    }
  }

  /**
   * Get memory usage estimate
   */
  estimateMemoryUsage() {
    const settings = this.qualitySettings;
    
    // Rough estimates in MB
    const geometryMemory = (settings.pillarSegments * 6 * 4) / 1024 / 1024; // vertices * pillars * bytes
    const textureMemory = (settings.shadowMapSize * settings.shadowMapSize * 4) / 1024 / 1024;
    
    return {
      geometry: geometryMemory,
      textures: textureMemory,
      total: geometryMemory + textureMemory
    };
  }

  /**
   * Dispose of the optimizer
   */
  dispose() {
    this.frameTimeHistory = [];
    this.performanceMetrics = null;
    this.qualitySettings = null;
    this.deviceCapabilities = null;
  }
}

// Singleton instance for global performance optimization
export const mobilePerformanceOptimizer = new MobilePerformanceOptimizer();