/**
 * Formatting utilities for dates, numbers, and strings
 */

/**
 * Format date to locale string
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale string (default: 'ru-RU')
 * @returns {string} Formatted date
 */
export const formatDate = (date, locale = 'ru-RU') => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale);
};

/**
 * Format date and time to locale string
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale string (default: 'ru-RU')
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date, locale = 'ru-RU') => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString(locale);
};

/**
 * Format relative time (e.g., "2 дня назад")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now - dateObj;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Сегодня';
    if (diffInDays === 1) return 'Вчера';
    if (diffInDays < 7) return `${diffInDays} дней назад`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} недель назад`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} месяцев назад`;
    return `${Math.floor(diffInDays / 365)} лет назад`;
};

/**
 * Format number with thousands separator
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString('ru-RU');
};

/**
 * Pluralize Russian word based on count
 * @param {number} count - Count
 * @param {string[]} forms - Array of 3 forms [1, 2-4, 5+]
 * @returns {string} Correct form
 * @example pluralize(1, ['студент', 'студента', 'студентов']) // 'студент'
 */
export const pluralize = (count, forms) => {
    const absCount = Math.abs(count) % 100;
    const num = absCount % 10;

    if (absCount > 10 && absCount < 20) return forms[2];
    if (num > 1 && num < 5) return forms[1];
    if (num === 1) return forms[0];
    return forms[2];
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};
