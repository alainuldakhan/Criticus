/**
 * Custom hook for managing classes
 */

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../api/classes';
import { queryKeys } from '../constants/queryKeys';
import { classService } from '../services/classService';

/**
 * Hook to fetch and manage classes list
 * @returns {object} Query result with classes and helpers
 */
export const useClasses = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: queryKeys.teacher.classes(),
        queryFn: classesApi.list,
    });

    const classes = data ?? [];
    const groupedClasses = useMemo(
        () => classService.getGroupedClasses(classes),
        [classes]
    );
    const stats = useMemo(() => classService.calculateClassStats(classes), [classes]);

    return {
        classes,
        groupedClasses,
        stats,
        isLoading,
        isError,
        error,
        isEmpty: !isLoading && classes.length === 0,
    };
};

/**
 * Hook to fetch a single class by ID
 * @param {string} classId - Class ID
 * @returns {object} Query result with class data
 */
export const useClass = (classId) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: queryKeys.teacher.class(classId),
        queryFn: () => classesApi.getById(classId),
        enabled: Boolean(classId),
    });

    return {
        class: data,
        isLoading,
        isError,
        error,
    };
};

/**
 * Hook to create a new class
 * @param {object} options - Hook options
 * @param {function} options.onSuccess - Success callback
 * @param {function} options.onError - Error callback
 * @returns {object} Mutation object
 */
export const useCreateClass = ({ onSuccess, onError } = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData) => {
            const apiData = classService.prepareClassForApi(formData);
            return classesApi.create(apiData);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.teacher.classes() });
            onSuccess?.(data);
        },
        onError: (error) => {
            onError?.(error);
        },
    });
};

/**
 * Hook to update a class
 * @param {string} classId - Class ID
 * @param {object} options - Hook options
 * @returns {object} Mutation object
 */
export const useUpdateClass = (classId, { onSuccess, onError } = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData) => {
            const apiData = classService.prepareClassForApi(formData);
            return classesApi.update(classId, apiData);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.teacher.classes() });
            queryClient.invalidateQueries({ queryKey: queryKeys.teacher.class(classId) });
            onSuccess?.(data);
        },
        onError: (error) => {
            onError?.(error);
        },
    });
};

/**
 * Hook to delete a class
 * @param {object} options - Hook options
 * @returns {object} Mutation object
 */
export const useDeleteClass = ({ onSuccess, onError } = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (classId) => classesApi.remove(classId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.teacher.classes() });
            onSuccess?.();
        },
        onError: (error) => {
            onError?.(error);
        },
    });
};

/**
 * Hook to fetch class members
 * @param {string} classId - Class ID
 * @returns {object} Query result with members
 */
export const useClassMembers = (classId) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: queryKeys.teacher.classMembers(classId),
        queryFn: () => classesApi.listMembers(classId),
        enabled: Boolean(classId),
    });

    return {
        members: data ?? [],
        isLoading,
        isError,
        error,
    };
};
