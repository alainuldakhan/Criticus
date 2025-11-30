/**
 * Business logic service for sessions
 */

import { formatDate, formatRelativeTime } from '../lib/formatters';

/**
 * Format session date
 * @param {object} session - Session object
 * @returns {string} Formatted date
 */
export const getSessionDate = (session) => {
    return formatDate(session?.createdUtc);
};

/**
 * Get relative session time
 * @param {object} session - Session object
 * @returns {string} Relative time string
 */
export const getSessionRelativeTime = (session) => {
    return formatRelativeTime(session?.createdUtc);
};

/**
 * Check if session is completed
 * @param {object} session - Session object
 * @returns {boolean} True if session is completed
 */
export const isSessionCompleted = (session) => {
    return session?.status === 'completed' || session?.endedUtc != null;
};

/**
 * Get session duration in minutes
 * @param {object} session - Session object
 * @returns {number|null} Duration in minutes or null
 */
export const getSessionDuration = (session) => {
    if (!session?.createdUtc) return null;

    const start = new Date(session.createdUtc);
    const end = session.endedUtc ? new Date(session.endedUtc) : new Date();

    const durationMs = end - start;
    return Math.round(durationMs / (1000 * 60));
};

/**
 * Format session duration
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatSessionDuration = (minutes) => {
    if (!minutes || minutes < 0) return '0 мин';

    if (minutes < 60) {
        return `${minutes} мин`;
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) {
        return `${hours} ч`;
    }

    return `${hours} ч ${mins} мин`;
};

/**
 * Get session score percentage
 * @param {object} session - Session object
 * @returns {number|null} Score percentage or null
 */
export const getSessionScore = (session) => {
    if (!session?.score && session?.score !== 0) return null;
    return Math.round(session.score * 100);
};

/**
 * Filter sessions by student
 * @param {Array} sessions - Array of sessions
 * @param {string} studentId - Student ID
 * @returns {Array} Filtered sessions
 */
export const filterSessionsByStudent = (sessions, studentId) => {
    if (!studentId) return sessions;
    return sessions.filter((session) => session.studentId === studentId);
};

/**
 * Filter sessions by topic
 * @param {Array} sessions - Array of sessions
 * @param {string} topicId - Topic ID
 * @returns {Array} Filtered sessions
 */
export const filterSessionsByTopic = (sessions, topicId) => {
    if (!topicId) return sessions;
    return sessions.filter((session) => session.topicId === topicId);
};

/**
 * Sort sessions by date (newest first)
 * @param {Array} sessions - Array of sessions
 * @returns {Array} Sorted sessions
 */
export const sortSessionsByDate = (sessions) => {
    return [...sessions].sort((a, b) => {
        const dateA = new Date(a.createdUtc || 0);
        const dateB = new Date(b.createdUtc || 0);
        return dateB - dateA;
    });
};

/**
 * Get session statistics
 * @param {Array} sessions - Array of sessions
 * @returns {object} Statistics object
 */
export const getSessionStats = (sessions) => {
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(isSessionCompleted).length;
    const averageScore =
        sessions.length > 0
            ? sessions
                .filter((s) => s.score != null)
                .reduce((sum, s) => sum + s.score, 0) / sessions.length
            : 0;

    return {
        totalSessions,
        completedSessions,
        averageScore: Math.round(averageScore * 100),
    };
};

export const sessionService = {
    getSessionDate,
    getSessionRelativeTime,
    isSessionCompleted,
    getSessionDuration,
    formatSessionDuration,
    getSessionScore,
    filterSessionsByStudent,
    filterSessionsByTopic,
    sortSessionsByDate,
    getSessionStats,
};
