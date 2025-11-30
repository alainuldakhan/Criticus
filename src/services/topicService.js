/**
 * Business logic service for topics
 */

import { pluralize } from '../lib/formatters';
import { transformTopicForApi } from '../lib/transformers';

/**
 * Format question count with proper plural form
 * @param {number} count - Number of questions
 * @returns {string} Formatted question count
 */
export const formatQuestionCount = (count) => {
    if (count === 0) return 'Нет вопросов';
    const forms = ['вопрос', 'вопроса', 'вопросов'];
    return `${count} ${pluralize(count, forms)}`;
};

/**
 * Get topic title or default
 * @param {object} topic - Topic object
 * @returns {string} Topic title
 */
export const getTopicTitle = (topic) => {
    return topic?.title || 'Без названия';
};

/**
 * Get question count from topic
 * @param {object} topic - Topic object
 * @returns {number} Number of questions
 */
export const getQuestionCount = (topic) => {
    return topic?.questions?.length || 0;
};

/**
 * Validate topic form data
 * @param {object} formData - Form data to validate
 * @returns {object} Validation result with isValid and errors
 */
export const validateTopicForm = (formData) => {
    const errors = {};

    if (!formData.title || !formData.title.trim()) {
        errors.title = 'Название темы обязательно';
    }

    if (!formData.conspect || !formData.conspect.trim()) {
        errors.conspect = 'Конспект обязателен';
    }

    if (!formData.questions || formData.questions.length === 0) {
        errors.questions = 'Добавьте хотя бы один вопрос';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Prepare topic data for API submission
 * @param {object} formData - Form data
 * @returns {object} API-ready data
 */
export const prepareTopicForApi = (formData) => {
    return transformTopicForApi(formData);
};

/**
 * Check if topic has questions
 * @param {object} topic - Topic object
 * @returns {boolean} True if topic has questions
 */
export const hasQuestions = (topic) => {
    return getQuestionCount(topic) > 0;
};

/**
 * Filter topics by search term
 * @param {Array} topics - Array of topics
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered topics
 */
export const filterTopicsBySearch = (topics, searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return topics;

    const term = searchTerm.toLowerCase().trim();
    return topics.filter((topic) =>
        topic.title?.toLowerCase().includes(term)
    );
};

/**
 * Sort topics by creation date (newest first)
 * @param {Array} topics - Array of topics
 * @returns {Array} Sorted topics
 */
export const sortTopicsByDate = (topics) => {
    return [...topics].sort((a, b) => {
        const dateA = new Date(a.createdUtc || 0);
        const dateB = new Date(b.createdUtc || 0);
        return dateB - dateA;
    });
};

/**
 * Get topic statistics
 * @param {Array} topics - Array of topics
 * @returns {object} Statistics object
 */
export const getTopicStats = (topics) => {
    const totalTopics = topics.length;
    const totalQuestions = topics.reduce(
        (sum, topic) => sum + getQuestionCount(topic),
        0
    );
    const avgQuestionsPerTopic =
        totalTopics > 0 ? Math.round(totalQuestions / totalTopics) : 0;

    return {
        totalTopics,
        totalQuestions,
        avgQuestionsPerTopic,
    };
};

export const topicService = {
    formatQuestionCount,
    getTopicTitle,
    getQuestionCount,
    validateTopicForm,
    prepareTopicForApi,
    hasQuestions,
    filterTopicsBySearch,
    sortTopicsByDate,
    getTopicStats,
};
