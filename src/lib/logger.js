/**
 * Logger utility for application logging
 * Centralizes logging for development and production environments
 */

const isDev = process.env.NODE_ENV === 'development';

/**
 * @typedef {Object} LogData
 * @property {string} [component] - Component name
 * @property {string} [action] - Action being performed
 * @property {any} [data] - Additional data
 */

/**
 * Log info message
 * @param {string} message - Log message
 * @param {LogData} [data] - Additional data
 */
const info = (message, data) => {
    if (isDev) {
        console.log(`ℹ️ ${message}`, data || '');
    }
};

/**
 * Log error message
 * @param {string} message - Error message
 * @param {Error|Object} error - Error object or data
 */
const error = (message, errorData) => {
    console.error(`❌ ${message}`, errorData);

    // In production, send to error tracking service (e.g., Sentry)
    if (!isDev && window.Sentry) {
        window.Sentry.captureException(errorData, {
            tags: { message },
        });
    }
};

/**
 * Log warning message
 * @param {string} message - Warning message
 * @param {LogData} [data] - Additional data
 */
const warn = (message, data) => {
    console.warn(`⚠️ ${message}`, data || '');
};

/**
 * Log event for analytics
 * @param {string} eventName - Event name
 * @param {Object} [data] - Event data
 */
const event = (eventName, data) => {
    if (isDev) {
        console.log(`📊 Event: ${eventName}`, data || '');
    }

    // In production, send to analytics service
    if (!isDev && window.gtag) {
        window.gtag('event', eventName, data);
    }
};

/**
 * Log debug message (development only)
 * @param {string} message - Debug message
 * @param {any} [data] - Debug data
 */
const debug = (message, data) => {
    if (isDev) {
        console.debug(`🐛 ${message}`, data || '');
    }
};

/**
 * Log performance metric
 * @param {string} metric - Metric name
 * @param {number} value - Metric value
 * @param {Object} [data] - Additional data
 */
const performance = (metric, value, data) => {
    if (isDev) {
        console.log(`⚡ Performance: ${metric} = ${value}ms`, data || '');
    }

    // In production, send to performance monitoring
    if (!isDev && window.gtag) {
        window.gtag('event', 'timing_complete', {
            name: metric,
            value: value,
            ...data,
        });
    }
};

export const logger = {
    info,
    error,
    warn,
    event,
    debug,
    performance,
};
