import * as THREE from 'three';

/**
 * Enhanced world coordinate system management
 * Handles smooth transitions and coordinate validation
 */
export class WorldOffsetController {
  constructor() {
    this.worldState = {
      offset: { x: 0, z: 0 },
      targetOffset: { x: 0, z: 0 },
      isTransitioning: false,
      transitionProgress: 0,
      lastValidOffset: { x: 0, z: 0 }
    };
    
    this.transitionSpeed = 0.1;
    this.jumpTransitionSpeed = 0.05;
    this.listeners = [];
  }

  /**
   * Add listener for offset changes
   */
  addListener(callback) {
    if (this.listeners.indexOf(callback) === -1) {
      this.listeners.push(callback);
    }
  }

  /**
   * Remove listener
   */
  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Notify listeners of changes
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.worldState);
      } catch (error) {
        console.warn('Error in world offset listener:', error);
      }
    });
  }

  /**
   * Set target offset with validation
   */
  setTargetOffset(offset, isJumping = false) {
    // Validate coordinates
    if (!this.isValidCoordinate(offset.x) || !this.isValidCoordinate(offset.z)) {
      console.warn('Invalid target offset coordinates, using fallback');
      offset = { ...this.worldState.lastValidOffset };
    }

    this.worldState.targetOffset = { ...offset };
    this.worldState.isTransitioning = true;
    this.worldState.transitionProgress = 0;
    
    // Adjust transition speed based on context
    this.transitionSpeed = isJumping ? this.jumpTransitionSpeed : 0.1;
    
    // Store as last valid offset
    this.worldState.lastValidOffset = { ...offset };
    
    this.notifyListeners();
  }

  /**
   * Update current offset with smooth interpolation
   */
  update(deltaTime = 0.016) {
    if (!this.worldState.isTransitioning) {
      return this.worldState.offset;
    }

    const current = this.worldState.offset;
    const target = this.worldState.targetOffset;
    
    // Smooth interpolation
    const newX = THREE.MathUtils.lerp(current.x, target.x, this.transitionSpeed);
    const newZ = THREE.MathUtils.lerp(current.z, target.z, this.transitionSpeed);
    
    // Validate interpolated values
    if (this.isValidCoordinate(newX) && this.isValidCoordinate(newZ)) {
      this.worldState.offset.x = newX;
      this.worldState.offset.z = newZ;
    } else {
      console.warn('Invalid interpolated coordinates, stopping transition');
      this.worldState.isTransitioning = false;
      return this.worldState.offset;
    }
    
    // Calculate transition progress
    const distanceToTarget = Math.sqrt(
      Math.pow(target.x - current.x, 2) + Math.pow(target.z - current.z, 2)
    );
    
    // Check if transition is complete
    const threshold = 0.01;
    if (distanceToTarget < threshold) {
      this.worldState.offset = { ...target };
      this.worldState.isTransitioning = false;
      this.worldState.transitionProgress = 1;
      this.notifyListeners();
    } else {
      // Update progress (approximate)
      this.worldState.transitionProgress = Math.min(
        this.worldState.transitionProgress + this.transitionSpeed,
        0.99
      );
    }
    
    return this.worldState.offset;
  }

  /**
   * Reset to origin with proper cleanup
   */
  reset() {
    try {
      this.worldState = {
        offset: { x: 0, z: 0 },
        targetOffset: { x: 0, z: 0 },
        isTransitioning: false,
        transitionProgress: 0,
        lastValidOffset: { x: 0, z: 0 }
      };
      
      this.transitionSpeed = 0.1;
      this.notifyListeners();
      
      return true;
    } catch (error) {
      console.error('Error resetting world offset:', error);
      return false;
    }
  }

  /**
   * Validate coordinate values
   */
  isValidCoordinate(value) {
    return typeof value === 'number' && 
           isFinite(value) && 
           !isNaN(value) && 
           Math.abs(value) < 10000; // Reasonable bounds check
  }

  /**
   * Get current offset
   */
  getCurrentOffset() {
    return { ...this.worldState.offset };
  }

  /**
   * Get target offset
   */
  getTargetOffset() {
    return { ...this.worldState.targetOffset };
  }

  /**
   * Check if transitioning
   */
  isTransitioning() {
    return this.worldState.isTransitioning;
  }

  /**
   * Get transition progress (0-1)
   */
  getTransitionProgress() {
    return this.worldState.transitionProgress;
  }

  /**
   * Force complete transition (emergency fallback)
   */
  forceCompleteTransition() {
    if (this.worldState.isTransitioning) {
      this.worldState.offset = { ...this.worldState.targetOffset };
      this.worldState.isTransitioning = false;
      this.worldState.transitionProgress = 1;
      this.notifyListeners();
    }
  }

  /**
   * Get world state (read-only)
   */
  getState() {
    return { ...this.worldState };
  }

  /**
   * Set transition speed
   */
  setTransitionSpeed(speed) {
    if (typeof speed === 'number' && speed > 0 && speed <= 1) {
      this.transitionSpeed = speed;
    }
  }

  /**
   * Dispose of the controller
   */
  dispose() {
    this.listeners = [];
    this.worldState = null;
  }
}

// Singleton instance for global world offset management
export const worldOffsetController = new WorldOffsetController();