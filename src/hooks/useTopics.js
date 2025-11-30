/**
 * Custom hook for managing topics
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ragStudentApi } from '../api/ragStudent';
import { queryKeys } from '../constants/queryKeys';
import { topicService } from '../services/topicService';

/**
 * Hook to fetch student topics with filters
 * @param {object} filters - Filter options
 * @returns {object} Query result with topics
 */
export const useStudentTopics = (filters = {}) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: queryKeys.student.topics(filters),
        queryFn: () =>
            ragStudentApi.listTopics({
                page: filters.page || 1,
                pageSize: filters.pageSize || 10,
            }),
        keepPreviousData: true,
    });

    const topics = data?.items ?? [];
    const total = data?.total ?? 0;

    return {
        topics,
        total,
        isLoading,
        isError,
        error,
        isEmpty: !isLoading && topics.length === 0,
    };
};

/**
 * Hook to fetch a single topic by ID
 * @param {string} topicId - Topic ID
 * @returns {object} Query result with topic data
 */
export const useStudentTopic = (topicId) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: queryKeys.student.topic(topicId),
        queryFn: () => ragStudentApi.getTopic(topicId),
        enabled: Boolean(topicId),
    });

    return {
        topic: data,
        questionCount: topicService.getQuestionCount(data),
        isLoading,
        isError,
        error,
    };
};
