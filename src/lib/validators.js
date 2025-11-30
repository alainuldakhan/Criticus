/**
 * Validation utilities
 */

import { validation } from '../constants/validation';

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    return validation.rules.email.pattern.test(email);
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {boolean} True if valid
 */
export const isValidPassword = (password) => {
    if (!password) return false;
    return password.length >= validation.rules.password.minLength;
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} True if valid (not empty)
 */
export const isRequired = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
};

/**
 * Validate grade (1-12)
 * @param {number} grade - Grade to validate
 * @returns {boolean} True if valid
 */
export const isValidGrade = (grade) => {
    const num = Number(grade);
    if (Number.isNaN(num)) return false;
    return num >= validation.rules.grade.min && num <= validation.rules.grade.max;
};

/**
 * Validate year (2000-2099)
 * @param {number} year - Year to validate
 * @returns {boolean} True if valid
 */
export const isValidYear = (year) => {
    const num = Number(year);
    if (Number.isNaN(num)) return false;
    return num >= validation.rules.year.min && num <= validation.rules.year.max;
};

/**
 * Get validation error message for a field
 * @param {string} fieldName - Field name
 * @param {any} value - Field value
 * @param {object} rules - Validation rules for this field
 * @returns {string|null} Error message or null if valid
 */
export const getValidationError = (fieldName, value, rules = {}) => {
    if (rules.required && !isRequired(value)) {
        return validation.rules.required.message;
    }

    if (rules.email && value && !isValidEmail(value)) {
        return validation.rules.email.message;
    }

    if (rules.password && value && !isValidPassword(value)) {
        return validation.rules.password.message;
    }

    if (rules.grade && value && !isValidGrade(value)) {
        return validation.rules.grade.message;
    }

    if (rules.year && value && !isValidYear(value)) {
        return validation.rules.year.message;
    }

    return null;
};

/**
 * Validate entire form
 * @param {object} formData - Form data to validate
 * @param {object} validationRules - Validation rules for each field
 * @returns {object} Object with field names as keys and error messages as values
 */
export const validateForm = (formData, validationRules) => {
    const errors = {};

    Object.keys(validationRules).forEach((fieldName) => {
        const error = getValidationError(
            fieldName,
            formData[fieldName],
            validationRules[fieldName]
        );
        if (error) {
            errors[fieldName] = error;
        }
    });

    return errors;
};
