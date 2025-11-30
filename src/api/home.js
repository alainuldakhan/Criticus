import http from './http';

/**
 * API для главной страницы (публичной)
 */
export const homeApi = {
    /**
     * Получить общую статистику платформы для главной страницы
     * @returns {Promise<{
     *   studentsCount: number,
     *   teachersCount: number,
     *   topicsCount: number,
     *   successRate: number
     * }>}
     */
    getStatistics: async () => {
        const response = await http.get('/v1/public/statistics');
        return response.data;
    },

    /**
     * Получить список feature-карточек для главной страницы
     * @returns {Promise<Array<{
     *   id: string,
     *   title: string,
     *   description: string,
     *   icon: string,
     *   order: number
     * }>>}
     */
    getFeatures: async () => {
        const response = await http.get('/v1/public/features');
        return response.data;
    },

    /**
     * Получить список преимуществ для главной страницы
     * @returns {Promise<Array<{
     *   id: string,
     *   category: 'teachers' | 'students',
     *   title: string,
     *   items: string[],
     *   order: number
     * }>>}
     */
    getBenefits: async () => {
        const response = await http.get('/v1/public/benefits');
        return response.data;
    },

    /**
     * Получить конфигурацию главной страницы (все данные за один запрос)
     * @returns {Promise<{
     *   statistics: {
     *     studentsCount: number,
     *     teachersCount: number,
     *     topicsCount: number,
     *     successRate: number
     *   },
     *   features: Array<{
     *     id: string,
     *     title: string,
     *     description: string,
     *     icon: string,
     *     order: number
     *   }>,
     *   benefits: Array<{
     *     id: string,
     *     category: 'teachers' | 'students',
     *     title: string,
     *     items: string[],
     *     order: number
     *   }>
     * }>}
     */
    getConfig: async () => {
        const response = await http.get('/v1/public/home-config');
        return response.data;
    },
};

