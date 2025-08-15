import { CONFIG } from '../../config/gameConfig';

/**
 * Centralized pillar state management system
 * Handles pillar lifecycle, state transitions, and validation
 */
export class PillarStateManager {
  constructor() {
    this.state = {
      pillars: [],
      worldOffset: { x: 0, z: 0 },
      targetWorldOffset: { x: 0, z: 0 },
      isTransitioning: false,
      renderingState: 'initializing'
    };

    this.listeners = [];
    this.lastValidOffset = { x: 0, z: 0 };
  }

  /**
   * Add state change listener
   */
  addListener(callback) {
    if (this.listeners.indexOf(callback) === -1) {
      this.listeners.push(callback);
    }
  }

  /**
   * Remove state change listener
   */
  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners of state changes
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.state);
      } catch (error) {
        // Error in state listener
      }
    });
  }

  /**
   * Complete state reset for new games
   */
  resetPillarState() {
    try {
      // Store previous state for cleanup
      const previousState = { ...this.state };

      // Reset to initial state
      this.state = {
        pillars: [],
        worldOffset: { x: 0, z: 0 },
        targetWorldOffset: { x: 0, z: 0 },
        isTransitioning: false,
        renderingState: 'initializing'
      };

      this.lastValidOffset = { x: 0, z: 0 };

      // Cleanup previous state resources
      this.cleanupPreviousState(previousState);

      this.notifyListeners();

      return true;
    } catch (error) {
      // Error resetting pillar state
      return false;
    }
  }

  /**
   * Validate pillar array integrity
   */
  validatePillarArray(pillars) {
    if (!Array.isArray(pillars)) {
      // Pillars is not an array
      return false;
    }

    for (let i = 0; i < pillars.length; i++) {
      const pillar = pillars[i];

      // Check required properties
      if (typeof pillar.x !== 'number' || typeof pillar.z !== 'number' || typeof pillar.r !== 'number') {
        // Invalid pillar at index
        return false;
      }

      // Check for NaN or infinite values
      if (!this.isValidCoordinate(pillar.x) || !this.isValidCoordinate(pillar.z) || !this.isValidCoordinate(pillar.r)) {
        // Invalid coordinates in pillar
        return false;
      }

      // Check reasonable bounds
      if (pillar.r <= 0 || pillar.r > 20) {
        // Invalid radius in pillar
        return false;
      }
    }

    return true;
  }

  /**
   * Update pillars with validation
   */
  updatePillars(newPillars) {
    if (!this.validatePillarArray(newPillars)) {
      // Invalid pillar array, keeping previous state
      return false;
    }

    this.state.pillars = [...newPillars];
    this.state.renderingState = 'ready';
    this.notifyListeners();
    return true;
  }

  /**
   * Update world offset with validation and smooth transitions
   */
  updateWorldOffset(offset) {
    if (!this.isValidCoordinate(offset.x) || !this.isValidCoordinate(offset.z)) {
      // Invalid world offset coordinates, using last valid offset
      offset = { ...this.lastValidOffset };
    }

    this.state.targetWorldOffset = { ...offset };
    this.state.isTransitioning = true;
    this.lastValidOffset = { ...offset };

    this.notifyListeners();
  }

  /**
   * Set current world offset (for smooth interpolation)
   */
  setCurrentWorldOffset(offset) {
    if (!this.isValidCoordinate(offset.x) || !this.isValidCoordinate(offset.z)) {
      return;
    }

    this.state.worldOffset = { ...offset };

    // Check if we've reached the target
    const threshold = 0.01;
    const reachedTarget =
      Math.abs(this.state.worldOffset.x - this.state.targetWorldOffset.x) < threshold &&
      Math.abs(this.state.worldOffset.z - this.state.targetWorldOffset.z) < threshold;

    if (reachedTarget && this.state.isTransitioning) {
      this.state.isTransitioning = false;
      this.notifyListeners();
    }
  }

  /**
   * Check if coordinate is valid (not NaN or infinite)
   */
  isValidCoordinate(value) {
    return typeof value === 'number' && isFinite(value) && !isNaN(value);
  }

  /**
   * Cleanup previous state resources
   */
  cleanupPreviousState(previousState) {
    try {
      // Clear any references that might cause memory leaks
      if (previousState.pillars) {
        previousState.pillars.length = 0;
      }

      // Reset any cached calculations
      this.cachedDistances = null;
      this.cachedLODLevels = null;

    } catch (error) {
      // Error during state cleanup
    }
  }

  /**
   * Get current state (read-only)
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Get pillar by index with bounds checking
   */
  getPillar(index) {
    if (index < 0 || index >= this.state.pillars.length) {
      return null;
    }
    return this.state.pillars[index];
  }

  /**
   * Get pillars count
   */
  getPillarCount() {
    return this.state.pillars.length;
  }

  /**
   * Check if state is ready for rendering
   */
  isReady() {
    return this.state.renderingState === 'ready' && this.state.pillars.length > 0;
  }

  /**
   * Set rendering state
   */
  setRenderingState(state) {
    const validStates = ['initializing', 'ready', 'transitioning', 'cleanup'];
    if (validStates.includes(state)) {
      this.state.renderingState = state;
      this.notifyListeners();
    }
  }

  /**
   * Dispose of the state manager
   */
  dispose() {
    this.cleanupPreviousState(this.state);
    this.listeners = [];
    this.state = null;
  }
}

// Singleton instance for global state management
export const pillarStateManager = new PillarStateManager();