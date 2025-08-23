import * as THREE from 'three';

/**
 * Memory management and cleanup system for pillars
 * Handles proper resource disposal and memory leak prevention
 */
export class PillarMemoryManager {
  constructor() {
    // Use plain objects instead of Map for Hermes compatibility
    this.geometryPool = {};
    this.materialPool = {};
    // Use arrays instead of Set for Hermes compatibility
    this.activeInstances = [];
    this.disposedInstances = [];
    this.memoryUsage = {
      geometries: 0,
      materials: 0,
      textures: 0,
      totalBytes: 0
    };
  }

  /**
   * Get or create geometry from pool
   */
  getGeometry(radius, segments = 24) {
    const key = 'cylinder_' + radius + '_' + segments;
    
    if (this.geometryPool[key]) {
      return this.geometryPool[key];
    }

    // Create new geometry
    const geometry = new THREE.CylinderGeometry(
      radius, 
      radius, 
      18, // CONFIG.PILLAR_HEIGHT
      segments,
      1
    );

    // Store in pool
    this.geometryPool[key] = geometry;
    this.memoryUsage.geometries++;
    
    return geometry;
  }

  /**
   * Get or create material from pool
   */
  getMaterial(color, opacity = 1) {
    const key = 'material_' + color + '_' + opacity;
    
    if (this.materialPool[key]) {
      return this.materialPool[key];
    }

    // Create new material
    const material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: opacity < 1,
      opacity: opacity,
      shininess: 30,
      specular: 0x111111,
      fog: true
    });

    // Add subtle emission for distant pillars
    if (opacity < 0.8) {
      material.emissive = new THREE.Color(color).multiplyScalar(0.05);
    }

    // Store in pool
    this.materialPool[key] = material;
    this.memoryUsage.materials++;
    
    return material;
  }

  /**
   * Register active instance
   */
  registerInstance(instance) {
    if (this.activeInstances.indexOf(instance) === -1) {
      this.activeInstances.push(instance);
    }
  }

  /**
   * Unregister and cleanup instance
   */
  unregisterInstance(instance) {
    const index = this.activeInstances.indexOf(instance);
    if (index !== -1) {
      this.activeInstances.splice(index, 1);
      if (this.disposedInstances.indexOf(instance) === -1) {
        this.disposedInstances.push(instance);
      }
      
      // Cleanup instance-specific resources if needed
      this.cleanupInstance(instance);
    }
  }

  /**
   * Cleanup specific instance
   */
  cleanupInstance(instance) {
    try {
      // Remove from scene if still attached
      if (instance.parent) {
        instance.parent.remove(instance);
      }
      
      // Clear any custom properties
      if (instance.userData) {
        instance.userData = {};
      }
      
    } catch (error) {
      // Error cleaning up pillar instance
    }
  }

  /**
   * Cleanup unused resources from pools
   */
  cleanupUnusedResources() {
    try {
      // Clean up geometries that are no longer referenced
      const geometryKeys = Object.keys(this.geometryPool);
      for (let i = 0; i < geometryKeys.length; i++) {
        const key = geometryKeys[i];
        const geometry = this.geometryPool[key];
        if (this.isGeometryUnused(geometry)) {
          geometry.dispose();
          delete this.geometryPool[key];
          this.memoryUsage.geometries--;
        }
      }

      // Clean up materials that are no longer referenced
      const materialKeys = Object.keys(this.materialPool);
      for (let i = 0; i < materialKeys.length; i++) {
        const key = materialKeys[i];
        const material = this.materialPool[key];
        if (this.isMaterialUnused(material)) {
          material.dispose();
          delete this.materialPool[key];
          this.memoryUsage.materials--;
        }
      }

      // Clear disposed instances
      this.disposedInstances.clear();
      
    } catch (error) {
      // Error during resource cleanup
    }
  }

  /**
   * Check if geometry is unused (simplified check)
   */
  isGeometryUnused(geometry) {
    // In a real implementation, you'd check if any active meshes use this geometry
    // For now, we'll keep geometries in the pool for reuse
    return false;
  }

  /**
   * Check if material is unused (simplified check)
   */
  isMaterialUnused(material) {
    // In a real implementation, you'd check if any active meshes use this material
    // For now, we'll keep materials in the pool for reuse
    return false;
  }

  /**
   * Force cleanup all resources (for game restart)
   */
  forceCleanupAll() {
    try {
      // Dispose all geometries
      const geometryKeys = Object.keys(this.geometryPool);
      for (let i = 0; i < geometryKeys.length; i++) {
        this.geometryPool[geometryKeys[i]].dispose();
      }
      this.geometryPool = {};

      // Dispose all materials
      const materialKeys = Object.keys(this.materialPool);
      for (let i = 0; i < materialKeys.length; i++) {
        this.materialPool[materialKeys[i]].dispose();
      }
      this.materialPool = {};

      // Clear all instances
      this.activeInstances = [];
      this.disposedInstances = [];

      // Reset memory usage
      this.memoryUsage = {
        geometries: 0,
        materials: 0,
        textures: 0,
        totalBytes: 0
      };

    } catch (error) {
      // Error during force cleanup
    }
  }

  /**
   * Get memory usage statistics
   */
  getMemoryUsage() {
    return { ...this.memoryUsage };
  }

  /**
   * Get pool statistics
   */
  getPoolStats() {
    return {
      geometryPoolSize: this.geometryPool.size,
      materialPoolSize: Object.keys(this.materialPool).length,
      activeInstances: this.activeInstances.length,
      disposedInstances: this.disposedInstances.length
    };
  }

  /**
   * Optimize pools based on usage
   */
  optimizePools() {
    try {
      // Clean up unused resources
      this.cleanupUnusedResources();
      
      // If pools are getting too large, force cleanup of least recently used items
      const maxPoolSize = 50;
      
      const geometryKeys = Object.keys(this.geometryPool);
      if (geometryKeys.length > maxPoolSize) {
        const toRemoveCount = geometryKeys.length - maxPoolSize;
        
        for (let i = 0; i < toRemoveCount; i++) {
          const key = geometryKeys[i];
          const geometry = this.geometryPool[key];
          geometry.dispose();
          delete this.geometryPool[key];
          this.memoryUsage.geometries--;
        }
      }
      
      const materialKeys = Object.keys(this.materialPool);
      if (materialKeys.length > maxPoolSize) {
        const toRemoveCount = materialKeys.length - maxPoolSize;
        
        for (let i = 0; i < toRemoveCount; i++) {
          const key = materialKeys[i];
          const material = this.materialPool[key];
          material.dispose();
          delete this.materialPool[key];
          this.memoryUsage.materials--;
        }
      }
      
    } catch (error) {
      // Error during pool optimization
    }
  }

  /**
   * Monitor memory pressure and trigger cleanup if needed
   */
  checkMemoryPressure() {
    const stats = this.getPoolStats();
    const totalInstances = stats.activeInstances + stats.disposedInstances;
    
    // If we have too many instances, trigger cleanup
    if (totalInstances > 100) {
      this.optimizePools();
    }
    
    // If pools are getting large, trigger optimization
    if (stats.geometryPoolSize > 30 || stats.materialPoolSize > 30) {
      this.optimizePools();
    }
  }

  /**
   * Dispose of the memory manager
   */
  dispose() {
    this.forceCleanupAll();
  }
}

// Singleton instance for global memory management
export const pillarMemoryManager = new PillarMemoryManager();