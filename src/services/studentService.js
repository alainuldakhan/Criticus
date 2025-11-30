/**
 * Business logic service for students
 */

import { pluralize } from '../lib/formatters';
import { isValidEmail } from '../lib/validators';

/**
 * Get student's full name or fallback to email
 * @param {Object} student - Student object
 * @param {string} [student.firstName] - First name
 * @param {string} [student.lastName] - Last name
 * @param {string} student.email - Email
 * @returns {string} Full name or email
 */
export const getFullName = (student) => {
    if (!student) return '';

    const firstName = student.firstName?.trim() || '';
    const lastName = student.lastName?.trim() || '';
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || student.email || 'Без имени';
};

/**
 * Get student's initials
 * @param {Object} student - Student object
 * @returns {string} Initials (e.g., "AB")
 */
export const getInitials = (student) => {
    if (!student) return '?';

    const firstName = student.firstName?.[0] || '';
    const lastName = student.lastName?.[0] || '';
    const initials = (firstName + lastName).toUpperCase();

    if (initials) return initials;

    // Fallback to first letter of email
    return student.email?.[0]?.toUpperCase() || '?';
};

/**
 * Get avatar color based on name
 * @param {string} name - Name or identifier
 * @returns {string} Hex color
 */
export const getAvatarColor = (name) => {
    const colors = [
        '#FF6B6B', // Red
        '#4ECDC4', // Teal
        '#45B7D1', // Blue
        '#96CEB4', // Green
        '#FFEAA7', // Yellow
        '#DDA15E', // Orange
        '#BC6C25', // Brown
        '#9B59B6', // Purple
    ];

    if (!name) return colors[0];

    const charCode = name.charCodeAt(0);
    const index = charCode % colors.length;
    return colors[index];
};

/**
 * Filter students by search term
 * @param {Array} students - Array of students
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered students
 */
export const filterBySearch = (students, searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) {
        return students;
    }

    const term = searchTerm.toLowerCase().trim();

    return students.filter((student) => {
        const fullName = getFullName(student).toLowerCase();
        const email = student.email?.toLowerCase() || '';

        return fullName.includes(term) || email.includes(term);
    });
};

/**
 * Filter students by class
 * @param {Array} students - Array of students
 * @param {string} classId - Class ID to filter by
 * @returns {Array} Filtered students
 */
export const filterByClass = (students, classId) => {
    if (!classId) {
        return students;
    }

    return students.filter((student) => student.classId === classId);
};

/**
 * Validate student form data
 * @param {Object} formData - Form data to validate
 * @param {boolean} [isUpdate=false] - Whether this is an update operation
 * @returns {{isValid: boolean, errors: Object}} Validation result
 */
export const validateStudentForm = (formData, isUpdate = false) => {
    const errors = {};

    // Email validation
    if (!formData.email?.trim()) {
        errors.email = 'Email обязателен';
    } else if (!isValidEmail(formData.email)) {
        errors.email = 'Некорректный email адрес';
    }

    // Password validation (only for new students)
    if (!isUpdate && !formData.password?.trim()) {
        errors.password = 'Пароль обязателен для нового студента';
    }

    // Optional: First name validation
    if (formData.firstName && formData.firstName.length > 100) {
        errors.firstName = 'Имя слишком длинное (макс. 100 символов)';
    }

    // Optional: Last name validation
    if (formData.lastName && formData.lastName.length > 100) {
        errors.lastName = 'Фамилия слишком длинная (макс. 100 символов)';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Prepare student data for API submission
 * @param {Object} formData - Form data
 * @returns {Object} API-ready data
 */
export const prepareForApi = (formData) => {
    const data = {
        email: formData.email?.trim(),
        firstName: formData.firstName?.trim() || undefined,
        lastName: formData.lastName?.trim() || undefined,
    };

    // Only include password if provided
    if (formData.password) {
        data.password = formData.password;
    }

    // Remove undefined values
    Object.keys(data).forEach((key) => {
        if (data[key] === undefined) {
            delete data[key];
        }
    });

    return data;
};

/**
 * Get student statistics
 * @param {Array} students - Array of students
 * @returns {{total: number, active: number, inactive: number}} Statistics
 */
export const getStudentStats = (students) => {
    const total = students.length;
    const active = students.filter((s) => s.isActive !== false).length;
    const inactive = total - active;

    return {
        total,
        active,
        inactive,
    };
};

/**
 * Sort students by name
 * @param {Array} students - Array of students
 * @param {string} [order='asc'] - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted students
 */
export const sortByName = (students, order = 'asc') => {
    return [...students].sort((a, b) => {
        const nameA = getFullName(a).toLowerCase();
        const nameB = getFullName(b).toLowerCase();

        if (order === 'desc') {
            return nameB.localeCompare(nameA);
        }
        return nameA.localeCompare(nameB);
    });
};

export const studentService = {
    getFullName,
    getInitials,
    getAvatarColor,
    filterBySearch,
    filterByClass,
    validateStudentForm,
    prepareForApi,
    getStudentStats,
    sortByName,
};
