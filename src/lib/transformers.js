/**
 * Data transformation utilities
 */

/**
 * Transform API response to standardized format
 * @param {object} response - API response
 * @returns {object} Transformed data
 */
export const transformApiResponse = (response) => {
    if (!response) return null;
    return response.data ?? response;
};

/**
 * Transform form data for API submission
 * @param {object} formData - Form data
 * @param {object} schema - Schema defining transformations
 * @returns {object} Transformed data ready for API
 */
export const transformFormForApi = (formData, schema = {}) => {
    const result = {};

    Object.keys(formData).forEach((key) => {
        const value = formData[key];
        const transform = schema[key];

        if (transform === 'number') {
            result[key] = value ? Number.parseInt(value, 10) : undefined;
        } else if (transform === 'trim') {
            result[key] = typeof value === 'string' ? value.trim() : value;
        } else if (typeof transform === 'function') {
            result[key] = transform(value);
        } else {
            result[key] = value;
        }
    });

    // Remove undefined values
    Object.keys(result).forEach((key) => {
        if (result[key] === undefined) {
            delete result[key];
        }
    });

    return result;
};

/**
 * Transform class data for API
 * @param {object} formData - Class form data
 * @returns {object} API-ready class data
 */
export const transformClassForApi = (formData) => {
    return transformFormForApi(formData, {
        name: 'trim',
        grade: 'number',
        year: 'number',
    });
};

/**
 * Transform topic data for API
 * @param {object} formData - Topic form data
 * @returns {object} API-ready topic data
 */
export const transformTopicForApi = (formData) => {
    return {
        title: formData.title?.trim(),
        conspect: formData.conspect?.trim(),
        questions: formData.questions || [],
    };
};

/**
 * Safe JSON parse
 * @param {string} json - JSON string to parse
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} Parsed value or default
 */
export const safeJsonParse = (json, defaultValue = null) => {
    try {
        return JSON.parse(json);
    } catch {
        return defaultValue;
    }
};

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Merge objects deeply
 * @param {object} target - Target object
 * @param {object} source - Source object
 * @returns {object} Merged object
 */
export const deepMerge = (target, source) => {
    const result = { ...target };

    Object.keys(source).forEach((key) => {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(result[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    });

    return result;
};
