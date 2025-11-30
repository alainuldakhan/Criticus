import http from './http';
import { createCrudApi, extendApi } from './baseApi';

/**
 * @typedef {Object} Student
 * @property {string} id - Student ID
 * @property {string} email - Student email
 * @property {string} [firstName] - First name
 * @property {string} [lastName] - Last name
 * @property {string} [classId] - Associated class ID
 * @property {boolean} isActive - Active status
 * @property {string} createdUtc - Creation timestamp
 */

// Create base students API with custom 'list' method name
const baseStudentsApi = {
  ...createCrudApi('teachers/students'),
  // Alias list to search for backwards compatibility
  list: (params) => http.get('/v1/teachers/students', { params }).then((res) => res.data),
};

/**
 * Students API
 * @type {Object}
 */
export const studentsApi = extendApi(baseStudentsApi, {
  /**
   * Search students with filters
   * @param {Object} [params] - Search parameters
   * @param {string} [params.q] - Search query
   * @param {string} [params.classId] - Filter by class
   * @param {number} [params.page] - Page number
   * @param {number} [params.pageSize] - Items per page
   * @returns {Promise<{items: Student[], total: number}>} Paginated students
   */
  search: (params) =>
    http.get('/v1/teachers/students', { params }).then((res) => res.data),

  /**
   * Deactivate student account
   * @param {string} userId - Student ID
   * @returns {Promise<Object>} Response
   */
  deactivate: (userId) =>
    http.post(`/v1/teachers/students/${userId}/deactivate`),

  /**
   * Reset student password
   * @param {string} userId - Student ID
   * @returns {Promise<{temporaryPassword: string}>} New temporary password
   */
  resetPassword: (userId) =>
    http
      .post(`/v1/teachers/students/${userId}/reset-password`)
      .then((res) => res.data),
});
