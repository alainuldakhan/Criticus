import http from './http';

/**
 * API для получения статистики дашборда учителя
 */
export const dashboardApi = {
    /**
     * Получить общую статистику дашборда
     * @returns {Promise<{
     *   totalClasses: number,
     *   totalStudents: number,
     *   totalSessions: number,
     *   totalTopics: number,
     *   weeklyStats: {
     *     newStudents: number,
     *     completedSessions: number,
     *     activeClasses: number,
     *     avgEngagement: number
     *   }
     * }>}
     */
    getOverview: async () => {
        const response = await http.get('/teacher/dashboard/overview');
        return response.data;
    },

    /**
     * Получить последние активности
     * @param {Object} params
     * @param {number} params.limit - Количество активностей
     * @returns {Promise<Array<{
     *   id: string,
     *   type: 'session' | 'student' | 'achievement',
     *   text: string,
     *   time: string,
     *   createdAt: string
     * }>>}
     */
    getRecentActivities: async ({ limit = 10 } = {}) => {
        const response = await http.get('/teacher/dashboard/activities', {
            params: { limit },
        });
        return response.data;
    },

    /**
     * Получить предстоящие события
     * @returns {Promise<Array<{
     *   id: string,
     *   title: string,
     *   date: string,
     *   time: string
     * }>>}
     */
    getUpcomingEvents: async () => {
        const response = await http.get('/teacher/dashboard/events');
        return response.data;
    },

    /**
     * Получить топ студентов
     * @param {Object} params
     * @param {number} params.limit - Количество студентов
     * @param {string} params.period - Период ('month' | 'week')
     * @returns {Promise<Array<{
     *   id: string,
     *   name: string,
     *   score: number,
     *   class: string
     * }>>}
     */
    getTopStudents: async ({ limit = 10, period = 'month' } = {}) => {
        const response = await http.get('/teacher/dashboard/top-students', {
            params: { limit, period },
        });
        return response.data;
    },
};
