/**
 * Business logic service for classes
 */

import { groupClassesByYear } from '../lib/groupers';
import { pluralize } from '../lib/formatters';
import { transformClassForApi } from '../lib/transformers';

/**
 * Calculate statistics for classes
 * @param {Array} classes - Array of classes
 * @returns {object} Statistics object
 */
export const calculateClassStats = (classes) => {
    const totalClasses = classes.length;
    const totalStudents = classes.reduce(
        (sum, klass) => sum + (klass.studentCount ?? 0),
        0
    );
    const avgClassSize =
        totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;

    return {
        totalClasses,
        totalStudents,
        avgClassSize,
    };
};

/**
 * Group classes by year with sorting
 * @param {Array} classes - Array of classes
 * @returns {Array} Grouped and sorted classes
 */
export const getGroupedClasses = (classes) => {
    return groupClassesByYear(classes);
};

/**
 * Format class display name
 * @param {object} klass - Class object
 * @returns {string} Formatted display name
 */
export const getClassDisplayName = (klass) => {
    if (!klass) return '';

    const parts = [klass.name];

    if (klass.grade) {
        parts.push(`(${klass.grade} класс)`);
    }

    if (klass.year) {
        parts.push(`[${klass.year}]`);
    }

    return parts.join(' ');
};

/**
 * Format student count with proper plural form
 * @param {number} count - Number of students
 * @returns {string} Formatted student count
 */
export const formatStudentCount = (count) => {
    if (count === 0) return 'Нет студентов';
    return `${count} ${pluralize(count, ['студент', 'студента', 'студентов'])}`;
};

/**
 * Validate class form data
 * @param {object} formData - Form data to validate
 * @returns {object} Validation result with isValid and errors
 */
export const validateClassForm = (formData) => {
    const errors = {};

    if (!formData.name || !formData.name.trim()) {
        errors.name = 'Название класса обязательно';
    }

    if (formData.grade) {
        const grade = Number.parseInt(formData.grade, 10);
        if (Number.isNaN(grade) || grade < 1 || grade > 12) {
            errors.grade = 'Класс должен быть от 1 до 12';
        }
    }

    if (formData.year) {
        const year = Number.parseInt(formData.year, 10);
        if (Number.isNaN(year) || year < 2000 || year > 2099) {
            errors.year = 'Год должен быть между 2000 и 2099';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Prepare class data for API submission
 * @param {object} formData - Form data
 * @returns {object} API-ready data
 */
export const prepareClassForApi = (formData) => {
    return transformClassForApi(formData);
};

/**
 * Check if class has students
 * @param {object} klass - Class object
 * @returns {boolean} True if class has students
 */
export const hasStudents = (klass) => {
    return (klass?.studentCount ?? 0) > 0;
};

/**
 * Get year label for display
 * @param {string|number} year - Year value
 * @returns {string} Display label
 */
export const getYearLabel = (year) => {
    if (!year || year === 'No year') return 'Год не указан';
    return `Учебный год: ${year}`;
};

export const classService = {
    calculateClassStats,
    getGroupedClasses,
    getClassDisplayName,
    formatStudentCount,
    validateClassForm,
    prepareClassForApi,
    hasStudents,
    getYearLabel,
};
