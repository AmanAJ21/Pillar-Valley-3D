/**
 * Comprehensive error handling and validation utilities
 * Provides robust error recovery and logging for pillar-related issues
 */

// Error types for categorization
export const ERROR_TYPES = {
    COORDINATE_VALIDATION: 'COORDINATE_VALIDATION',
    PILLAR_STATE: 'PILLAR_STATE',
    MEMORY_MANAGEMENT: 'MEMORY_MANAGEMENT',
    PERFORMANCE: 'PERFORMANCE',
    RENDERING: 'RENDERING',
    GAME_STATE: 'GAME_STATE'
};

// Error severity levels
export const ERROR_SEVERITY = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
};

/**
 * Enhanced error logger with categorization and mobile-friendly output
 */
export class ErrorLogger {
    constructor() {
        this.errorHistory = [];
        this.maxHistoryLength = 100;
        this.errorCounts = {};
    }

    /**
     * Log error with context and categorization
     */
    logError(error, type = ERROR_TYPES.GAME_STATE, severity = ERROR_SEVERITY.MEDIUM, context = {}) {
        const errorEntry = {
            timestamp: Date.now(),
            message: error.message || String(error),
            stack: error.stack,
            type,
            severity,
            context,
            id: this.generateErrorId()
        };

        // Add to history
        this.errorHistory.push(errorEntry);
        if (this.errorHistory.length > this.maxHistoryLength) {
            this.errorHistory.shift();
        }

        // Update error counts
        this.errorCounts[type] = (this.errorCounts[type] || 0) + 1;

        // Log to console with appropriate level
        const logMethod = this.getLogMethod(severity);
        logMethod('[' + type + '] ' + errorEntry.message, {
            severity,
            context,
            id: errorEntry.id
        });

        // Return error ID for tracking
        return errorEntry.id;
    }

    /**
     * Generate unique error ID
     */
    generateErrorId() {
        return 'err_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
    }

    /**
     * Get appropriate console method based on severity
     */
    getLogMethod(severity) {
        switch (severity) {
            case ERROR_SEVERITY.CRITICAL:
                return console.error;
            case ERROR_SEVERITY.HIGH:
                return console.error;
            case ERROR_SEVERITY.MEDIUM:
                return console.warn;
            case ERROR_SEVERITY.LOW:
                return console.log;
            default:
                return console.log;
        }
    }

    /**
     * Get error statistics
     */
    getErrorStats() {
        return {
            totalErrors: this.errorHistory.length,
            errorCounts: { ...this.errorCounts },
            recentErrors: this.errorHistory.slice(-10)
        };
    }

    /**
     * Clear error history
     */
    clearHistory() {
        this.errorHistory = [];
        this.errorCounts = {};
    }
}

// Singleton error logger
export const errorLogger = new ErrorLogger();

/**
 * Coordinate validation utilities
 */
export const CoordinateValidator = {
    /**
     * Validate single coordinate value
     */
    isValidCoordinate(value, name = 'coordinate') {
        if (typeof value !== 'number') {
            errorLogger.logError(
                new Error(`${name} is not a number: ${typeof value}`),
                ERROR_TYPES.COORDINATE_VALIDATION,
                ERROR_SEVERITY.MEDIUM,
                { value, name }
            );
            return false;
        }

        if (isNaN(value)) {
            errorLogger.logError(
                new Error(`${name} is NaN`),
                ERROR_TYPES.COORDINATE_VALIDATION,
                ERROR_SEVERITY.HIGH,
                { value, name }
            );
            return false;
        }

        if (!isFinite(value)) {
            errorLogger.logError(
                new Error(`${name} is not finite: ${value}`),
                ERROR_TYPES.COORDINATE_VALIDATION,
                ERROR_SEVERITY.HIGH,
                { value, name }
            );
            return false;
        }

        // Reasonable bounds check
        if (Math.abs(value) > 10000) {
            errorLogger.logError(
                new Error(`${name} is outside reasonable bounds: ${value}`),
                ERROR_TYPES.COORDINATE_VALIDATION,
                ERROR_SEVERITY.MEDIUM,
                { value, name }
            );
            return false;
        }

        return true;
    },

    /**
     * Validate 2D position
     */
    isValidPosition2D(position, name = 'position') {
        if (!position || typeof position !== 'object') {
            errorLogger.logError(
                new Error(`${name} is not an object`),
                ERROR_TYPES.COORDINATE_VALIDATION,
                ERROR_SEVERITY.MEDIUM,
                { position, name }
            );
            return false;
        }

        return this.isValidCoordinate(position.x, `${name}.x`) &&
            this.isValidCoordinate(position.z, `${name}.z`);
    },

    /**
     * Validate 3D position array
     */
    isValidPosition3D(position, name = 'position') {
        if (!Array.isArray(position) || position.length !== 3) {
            errorLogger.logError(
                new Error(`${name} is not a valid 3D position array`),
                ERROR_TYPES.COORDINATE_VALIDATION,
                ERROR_SEVERITY.MEDIUM,
                { position, name }
            );
            return false;
        }

        return this.isValidCoordinate(position[0], `${name}[0]`) &&
            this.isValidCoordinate(position[1], `${name}[1]`) &&
            this.isValidCoordinate(position[2], `${name}[2]`);
    },

    /**
     * Sanitize coordinate value
     */
    sanitizeCoordinate(value, fallback = 0, name = 'coordinate') {
        if (this.isValidCoordinate(value, name)) {
            return value;
        }

        errorLogger.logError(
            new Error(`Sanitizing invalid ${name}, using fallback: ${fallback}`),
            ERROR_TYPES.COORDINATE_VALIDATION,
            ERROR_SEVERITY.LOW,
            { originalValue: value, fallback, name }
        );

        return fallback;
    },

    /**
     * Sanitize 2D position
     */
    sanitizePosition2D(position, fallback = { x: 0, z: 0 }, name = 'position') {
        if (this.isValidPosition2D(position, name)) {
            return position;
        }

        return {
            x: this.sanitizeCoordinate(position && position.x, fallback.x, `${name}.x`),
            z: this.sanitizeCoordinate(position && position.z, fallback.z, `${name}.z`)
        };
    }
};

/**
 * Pillar validation utilities
 */
export const PillarValidator = {
    /**
     * Validate single pillar object
     */
    isValidPillar(pillar, index = 0) {
        if (!pillar || typeof pillar !== 'object') {
            errorLogger.logError(
                new Error(`Pillar at index ${index} is not an object`),
                ERROR_TYPES.PILLAR_STATE,
                ERROR_SEVERITY.HIGH,
                { pillar, index }
            );
            return false;
        }

        // Check required properties
        const requiredProps = ['x', 'z', 'r'];
        for (let i = 0; i < requiredProps.length; i++) {
            const prop = requiredProps[i];
            if (!(prop in pillar)) {
                errorLogger.logError(
                    new Error(`Pillar at index ${index} missing property: ${prop}`),
                    ERROR_TYPES.PILLAR_STATE,
                    ERROR_SEVERITY.HIGH,
                    { pillar, index, missingProperty: prop }
                );
                return false;
            }
        }

        // Validate coordinates
        if (!CoordinateValidator.isValidCoordinate(pillar.x, `pillar[${index}].x`) ||
            !CoordinateValidator.isValidCoordinate(pillar.z, `pillar[${index}].z`)) {
            return false;
        }

        // Validate radius
        if (!CoordinateValidator.isValidCoordinate(pillar.r, `pillar[${index}].r`)) {
            return false;
        }

        if (pillar.r <= 0) {
            errorLogger.logError(
                new Error(`Pillar at index ${index} has invalid radius: ${pillar.r}`),
                ERROR_TYPES.PILLAR_STATE,
                ERROR_SEVERITY.HIGH,
                { pillar, index }
            );
            return false;
        }

        if (pillar.r > 20) {
            errorLogger.logError(
                new Error(`Pillar at index ${index} has unreasonably large radius: ${pillar.r}`),
                ERROR_TYPES.PILLAR_STATE,
                ERROR_SEVERITY.MEDIUM,
                { pillar, index }
            );
            return false;
        }

        return true;
    },

    /**
     * Validate pillar array
     */
    isValidPillarArray(pillars) {
        if (!Array.isArray(pillars)) {
            errorLogger.logError(
                new Error('Pillars is not an array'),
                ERROR_TYPES.PILLAR_STATE,
                ERROR_SEVERITY.HIGH,
                { pillars }
            );
            return false;
        }

        if (pillars.length === 0) {
            errorLogger.logError(
                new Error('Pillar array is empty'),
                ERROR_TYPES.PILLAR_STATE,
                ERROR_SEVERITY.MEDIUM,
                { pillars }
            );
            return false;
        }

        // Validate each pillar
        for (let i = 0; i < pillars.length; i++) {
            if (!this.isValidPillar(pillars[i], i)) {
                return false;
            }
        }

        return true;
    },

    /**
     * Sanitize pillar object
     */
    sanitizePillar(pillar, index = 0, fallback = { x: 0, z: 0, r: 3, id: 0 }) {
        if (this.isValidPillar(pillar, index)) {
            return pillar;
        }

        errorLogger.logError(
            new Error(`Sanitizing invalid pillar at index ${index}`),
            ERROR_TYPES.PILLAR_STATE,
            ERROR_SEVERITY.MEDIUM,
            { originalPillar: pillar, index, fallback }
        );

        return {
            x: CoordinateValidator.sanitizeCoordinate(pillar && pillar.x, fallback.x, `pillar[${index}].x`),
            z: CoordinateValidator.sanitizeCoordinate(pillar && pillar.z, fallback.z, `pillar[${index}].z`),
            r: CoordinateValidator.sanitizeCoordinate(pillar && pillar.r, fallback.r, `pillar[${index}].r`),
            id: (pillar && pillar.id) || fallback.id || index
        };
    }
};

/**
 * Game state validation utilities
 */
export const GameStateValidator = {
    /**
     * Validate game state object
     */
    isValidGameState(gameState) {
        if (!gameState || typeof gameState !== 'object') {
            errorLogger.logError(
                new Error('Game state is not an object'),
                ERROR_TYPES.GAME_STATE,
                ERROR_SEVERITY.CRITICAL,
                { gameState }
            );
            return false;
        }

        // Check required properties
        const requiredProps = ['playing', 'pillars', 'ballAngle', 'ballSpeed', 'ballScale'];
        for (let i = 0; i < requiredProps.length; i++) {
            const prop = requiredProps[i];
            if (!(prop in gameState)) {
                errorLogger.logError(
                    new Error(`Game state missing property: ${prop}`),
                    ERROR_TYPES.GAME_STATE,
                    ERROR_SEVERITY.HIGH,
                    { gameState, missingProperty: prop }
                );
                return false;
            }
        }

        // Validate pillars
        if (!PillarValidator.isValidPillarArray(gameState.pillars)) {
            return false;
        }

        // Validate numeric properties
        const numericProps = ['ballAngle', 'ballSpeed', 'ballScale', 'score', 'targetPillarIndex'];
        for (let i = 0; i < numericProps.length; i++) {
            const prop = numericProps[i];
            if (prop in gameState && !CoordinateValidator.isValidCoordinate(gameState[prop], prop)) {
                return false;
            }
        }

        return true;
    }
};

/**
 * Safe execution wrapper with error recovery
 */
export function safeExecute(fn, fallback = null, context = {}) {
    try {
        return fn();
    } catch (error) {
        errorLogger.logError(
            error,
            ERROR_TYPES.GAME_STATE,
            ERROR_SEVERITY.MEDIUM,
            { context, functionName: fn.name }
        );

        if (typeof fallback === 'function') {
            try {
                return fallback();
            } catch (fallbackError) {
                errorLogger.logError(
                    fallbackError,
                    ERROR_TYPES.GAME_STATE,
                    ERROR_SEVERITY.HIGH,
                    { context, originalError: error.message }
                );
                return null;
            }
        }

        return fallback;
    }
}

/**
 * Performance monitoring utilities
 */
export const PerformanceMonitor = {
    /**
     * Monitor function execution time
     */
    timeFunction(fn, name = 'function') {
        const start = performance.now();
        try {
            const result = fn();
            const duration = performance.now() - start;

            if (duration > 16.67) { // More than one frame at 60fps
                errorLogger.logError(
                    new Error(`${name} took ${duration.toFixed(2)}ms (> 16.67ms)`),
                    ERROR_TYPES.PERFORMANCE,
                    ERROR_SEVERITY.MEDIUM,
                    { functionName: name, duration }
                );
            }

            return result;
        } catch (error) {
            const duration = performance.now() - start;
            errorLogger.logError(
                error,
                ERROR_TYPES.PERFORMANCE,
                ERROR_SEVERITY.HIGH,
                { functionName: name, duration }
            );
            throw error;
        }
    }
};

/**
 * Memory leak detection utilities
 */
export const MemoryMonitor = {
    /**
     * Check for potential memory leaks
     */
    checkMemoryUsage() {
        if (typeof performance !== 'undefined' && performance.memory) {
            const memory = performance.memory;
            const usedMB = memory.usedJSHeapSize / 1024 / 1024;
            const totalMB = memory.totalJSHeapSize / 1024 / 1024;
            const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;

            // Warn if using more than 80% of available memory
            if (usedMB / limitMB > 0.8) {
                errorLogger.logError(
                    new Error(`High memory usage: ${usedMB.toFixed(2)}MB / ${limitMB.toFixed(2)}MB`),
                    ERROR_TYPES.MEMORY_MANAGEMENT,
                    ERROR_SEVERITY.HIGH,
                    { usedMB, totalMB, limitMB }
                );
            }

            return { usedMB, totalMB, limitMB };
        }

        return null;
    }
};