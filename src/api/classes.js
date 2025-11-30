import http from './http';
import { createCrudApi, extendApi } from './baseApi';

/**
 * @typedef {Object} Class
 * @property {string} id - Class ID
 * @property {string} name - Class name
 * @property {number} [grade] - Grade level (1-12)
 * @property {number} [year] - Academic year
 * @property {number} studentCount - Number of students
 * @property {string} createdUtc - Creation timestamp
 */

/**
 * @typedef {Object} ClassMember
 * @property {string} userId - User ID
 * @property {string} email - User email
 * @property {string} [firstName] - First name
 * @property {string} [lastName] - Last name
 */

// Base CRUD operations
const baseClassesApi = createCrudApi('teachers/classes');

/**
 * Classes API
 * @type {Object}
 */
export const classesApi = extendApi(baseClassesApi, {
  /**
   * Get all students across all classes
   * @returns {Promise<Array>} All students
   */
  allStudents: () =>
    http.get('/v1/teachers/classes/allStudents').then((res) => res.data),

  /**
   * Add members to a class
   * @param {string} classId - Class ID
   * @param {Object} payload - Members data
   * @param {string[]} payload.emails - Array of member emails
   * @returns {Promise<Object>} Response
   */
  addMembers: (classId, payload) =>
    http
      .post(`/v1/teachers/classes/${classId}/members`, payload)
      .then((res) => res.data),

  /**
   * Remove member from class
   * @param {string} classId - Class ID
   * @param {string} userId - User ID to remove
   * @returns {Promise<void>}
   */
  removeMember: (classId, userId) =>
    http.delete(`/v1/teachers/classes/${classId}/members/${userId}`),

  /**
   * List class members
   * @param {string} classId - Class ID
   * @returns {Promise<ClassMember[]>} Array of members
   */
  listMembers: (classId) =>
    http.get(`/v1/classes/${classId}/members`).then((res) => res.data),
});
