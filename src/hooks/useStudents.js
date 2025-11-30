/**
 * Custom hooks for managing students
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../api/students';
import { queryKeys } from '../constants/queryKeys';

/**
 * Hook to fetch students with filters
 * @param {Object} [filters={}] - Filter options
 * @param {string} [filters.q] - Search query
 * @param {string} [filters.classId] - Filter by class
 * @param {number} [filters.page] - Page number
 * @param {number} [filters.pageSize] - Items per page
 * @returns {{
 *   students: Array,
 *   total: number,
 *   isLoading: boolean,
 *   isError: boolean,
 *   error: Error | null,
 *   isEmpty: boolean
 * }}
 */
export const useStudents = (filters = {}) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: queryKeys.teacher.students(filters),
        queryFn: () => studentsApi.search(filters),
    });

    const students = data?.items ?? [];
    const total = data?.total ?? 0;

    return {
        students,
        total,
        isLoading,
        isError,
        error,
        isEmpty: !isLoading && students.length === 0,
    };
};

/**
 * Hook to fetch a single student by ID
 * @param {string} studentId - Student ID
 * @returns {{
 *   student: Object | null,
 *   isLoading: boolean,
 *   isError: boolean,
 *   error: Error | null
 * }}
 */
export const useStudent = (studentId) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: queryKeys.teacher.student(studentId),
        queryFn: () => studentsApi.getById(studentId),
        enabled: Boolean(studentId),
    });

    return {
        student: data,
        isLoading,
        isError,
        error,
    };
};

/**
 * Hook to create a new student
 * @param {Object} [options={}] - Hook options
 * @param {Function} [options.onSuccess] - Success callback
 * @param {Function} [options.onError] - Error callback
 * @returns {Object} Mutation object
 */
export const useCreateStudent = ({ onSuccess, onError } = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: studentsApi.create,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.teacher.students() });
            onSuccess?.(data);
        },
        onError: (error) => {
            onError?.(error);
        },
    });
};

/**
 * Hook to update a student
 * @param {string} studentId - Student ID
 * @param {Object} [options={}] - Hook options
 * @returns {Object} Mutation object
 */
export const useUpdateStudent = (studentId, { onSuccess, onError } = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => studentsApi.update(studentId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.teacher.students() });
            queryClient.invalidateQueries({ queryKey: queryKeys.teacher.student(studentId) });
            onSuccess?.(data);
        },
        onError: (error) => {
            onError?.(error);
        },
    });
};

/**
 * Hook to deactivate a student
 * @param {Object} [options={}] - Hook options
 * @returns {Object} Mutation object
 */
export const useDeactivateStudent = ({ onSuccess, onError } = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: studentsApi.deactivate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.teacher.students() });
            onSuccess?.();
        },
        onError: (error) => {
            onError?.(error);
        },
    });
};

/**
 * Hook to reset student password
 * @param {Object} [options={}] - Hook options
 * @returns {Object} Mutation object
 */
export const useResetStudentPassword = ({ onSuccess, onError } = {}) => {
    return useMutation({
        mutationFn: studentsApi.resetPassword,
        onSuccess: (data) => {
            onSuccess?.(data);
        },
        onError: (error) => {
            onError?.(error);
        },
    });
};
