/**
 * Custom hook for pagination
 */

import { useState, useMemo, useCallback } from 'react';

/**
 * Pagination hook
 * @param {object} options - Pagination options
 * @param {number} options.initialPage - Initial page number (default: 1)
 * @param {number} options.pageSize - Items per page (default: 10)
 * @param {number} options.total - Total items count
 * @returns {object} Pagination state and handlers
 */
export const usePagination = ({ initialPage = 1, pageSize = 10, total = 0 } = {}) => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(total / pageSize));
    }, [total, pageSize]);

    const canGoNext = useMemo(() => {
        return currentPage < totalPages;
    }, [currentPage, totalPages]);

    const canGoPrevious = useMemo(() => {
        return currentPage > 1;
    }, [currentPage]);

    const goToPage = useCallback(
        (page) => {
            const validPage = Math.max(1, Math.min(page, totalPages));
            setCurrentPage(validPage);
        },
        [totalPages]
    );

    const nextPage = useCallback(() => {
        if (canGoNext) {
            setCurrentPage((prev) => prev + 1);
        }
    }, [canGoNext]);

    const previousPage = useCallback(() => {
        if (canGoPrevious) {
            setCurrentPage((prev) => prev - 1);
        }
    }, [canGoPrevious]);

    const reset = useCallback(() => {
        setCurrentPage(initialPage);
    }, [initialPage]);

    // Calculate offset for API calls
    const offset = useMemo(() => {
        return (currentPage - 1) * pageSize;
    }, [currentPage, pageSize]);

    return {
        currentPage,
        totalPages,
        pageSize,
        canGoNext,
        canGoPrevious,
        goToPage,
        nextPage,
        previousPage,
        reset,
        offset,
    };
};

/**
 * Client-side pagination hook (for already loaded data)
 * @param {Array} items - All items to paginate
 * @param {number} pageSize - Items per page
 * @returns {object} Pagination state and paginated items
 */
export const useClientPagination = (items = [], pageSize = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(items.length / pageSize));
    }, [items.length, pageSize]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return items.slice(start, end);
    }, [items, currentPage, pageSize]);

    const canGoNext = currentPage < totalPages;
    const canGoPrevious = currentPage > 1;

    const nextPage = useCallback(() => {
        if (canGoNext) {
            setCurrentPage((prev) => prev + 1);
        }
    }, [canGoNext]);

    const previousPage = useCallback(() => {
        if (canGoPrevious) {
            setCurrentPage((prev) => prev - 1);
        }
    }, [canGoPrevious]);

    const goToPage = useCallback(
        (page) => {
            const validPage = Math.max(1, Math.min(page, totalPages));
            setCurrentPage(validPage);
        },
        [totalPages]
    );

    return {
        paginatedItems,
        currentPage,
        totalPages,
        canGoNext,
        canGoPrevious,
        nextPage,
        previousPage,
        goToPage,
    };
};
