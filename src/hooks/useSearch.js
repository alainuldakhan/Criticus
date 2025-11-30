/**
 * Custom hook for search functionality
 */

import { useState, useMemo, useCallback } from 'react';

/**
 * Search hook with debouncing
 * @param {Array} items - Items to search
 * @param {Function} searchFn - Function to filter items
 * @param {number} debounceMs - Debounce delay in ms
 * @returns {object} Search state and handlers
 */
export const useSearch = (items, searchFn, debounceMs = 300) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');

    // Debounce search term
    const handleSearchChange = useCallback(
        (event) => {
            const value = event.target.value;
            setSearchTerm(value);

            // Simple debounce implementation
            const timer = setTimeout(() => {
                setDebouncedTerm(value);
            }, debounceMs);

            return () => clearTimeout(timer);
        },
        [debounceMs]
    );

    // Filter items based on search term
    const filteredItems = useMemo(() => {
        if (!debouncedTerm || !debouncedTerm.trim()) {
            return items;
        }
        return searchFn(items, debouncedTerm);
    }, [items, debouncedTerm, searchFn]);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setDebouncedTerm('');
    }, []);

    return {
        searchTerm,
        debouncedTerm,
        filteredItems,
        handleSearchChange,
        clearSearch,
        isSearching: searchTerm !== debouncedTerm,
        hasResults: filteredItems.length > 0,
        isEmpty: filteredItems.length === 0 && debouncedTerm.trim().length > 0,
    };
};

/**
 * Simple search hook without debouncing
 * @param {Array} items - Items to search
 * @param {Function} searchFn - Function to filter items
 * @returns {object} Search state and handlers
 */
export const useSimpleSearch = (items, searchFn) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = useCallback((event) => {
        setSearchTerm(event.target.value);
    }, []);

    const filteredItems = useMemo(() => {
        if (!searchTerm || !searchTerm.trim()) {
            return items;
        }
        return searchFn(items, searchTerm);
    }, [items, searchTerm, searchFn]);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
    }, []);

    return {
        searchTerm,
        filteredItems,
        handleSearchChange,
        clearSearch,
        hasResults: filteredItems.length > 0,
        isEmpty: filteredItems.length === 0 && searchTerm.trim().length > 0,
    };
};
