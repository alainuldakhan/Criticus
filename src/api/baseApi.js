/**
 * Base API factory
 * Creates standardized CRUD API for resources
 */

import http from './http';

/**
 * @template T
 * @typedef {Object} PaginatedResponse
 * @property {T[]} items - Array of items
 * @property {number} total - Total count
 * @property {number} [page] - Current page
 * @property {number} [pageSize] - Items per page
 */

/**
 * @template T
 * @typedef {Object} CrudApi
 * @property {(params?: Object) => Promise<PaginatedResponse<T> | T[]>} list - List all items
 * @property {(id: string) => Promise<T>} getById - Get item by ID
 * @property {(data: Partial<T>) => Promise<T>} create - Create new item
 * @property {(id: string, data: Partial<T>) => Promise<T>} update - Update item
 * @property {(id: string) => Promise<void>} remove - Delete item
 */

/**
 * Create CRUD API for a resource
 * @template T
 * @param {string} resource - Resource name (e.g., 'teachers/classes', 'students')
 * @param {Object} [options] - Configuration options
 * @param {string} [options.prefix='v1'] - API version prefix
 * @param {boolean} [options.paginated=true] - Whether list returns paginated response
 * @returns {CrudApi<T>} CRUD API methods
 * 
 * @example
 * const classesApi = createCrudApi('teachers/classes')
 * const students = await classesApi.list({ page: 1 })
 */
export const createCrudApi = (resource, options = {}) => {
    const { prefix = 'v1' } = options;
    const basePath = `/${prefix}/${resource}`;

    return {
        /**
         * List all items with optional params
         * @param {Object} [params] - Query parameters (page, pageSize, filters, etc.)
         * @returns {Promise<PaginatedResponse<T> | T[]>}
         */
        list: (params) =>
            http.get(basePath, { params }).then((res) => res.data),

        /**
         * Get single item by ID
         * @param {string} id - Item ID
         * @returns {Promise<T>}
         */
        getById: (id) =>
            http.get(`${basePath}/${id}`).then((res) => res.data),

        /**
         * Create new item
         * @param {Partial<T>} data - Item data
         * @returns {Promise<T>} Created item
         */
        create: (data) =>
            http.post(basePath, data).then((res) => res.data),

        /**
         * Update existing item
         * @param {string} id - Item ID
         * @param {Partial<T>} data - Update data
         * @returns {Promise<T>} Updated item
         */
        update: (id, data) =>
            http.put(`${basePath}/${id}`, data).then((res) => res.data),

        /**
         * Delete item
         * @param {string} id - Item ID
         * @returns {Promise<void>}
         */
        remove: (id) =>
            http.delete(`${basePath}/${id}`),
    };
};

/**
 * Extend base API with custom methods
 * @template T
 * @param {CrudApi<T>} baseApi - Base CRUD API
 * @param {Object} customMethods - Custom API methods
 * @returns {CrudApi<T> & Object} Extended API
 * 
 * @example
 * const classesApi = extendApi(
 *   createCrudApi('teachers/classes'),
 *   { addMembers: (id, data) => http.post(`/v1/teachers/classes/${id}/members`, data) }
 * )
 */
export const extendApi = (baseApi, customMethods) => {
    return {
        ...baseApi,
        ...customMethods,
    };
};
