/**
 * Custom hook for error handling
 */

import { useState, useCallback } from 'react';
import { handleApiError } from '../lib/errorHandler';
import { logger } from '../lib/logger';

/**
 * Hook for managing error state and handling errors
 * @param {Object} options - Hook options
 * @param {Function} [options.onError] - Callback when error occurs
 * @returns {{
 *   error: string | null,
 *   hasError: boolean,
 *   handleError: (error: Error, context?: Object) => void,
 *   clearError: () => void,
 *   setError: (message: string) => void
 * }}
 */
export const useErrorHandler = ({ onError } = {}) => {
    const [error, setErrorState] = useState(null);

    const handleError = useCallback(
        (err, context = {}) => {
            const errorMessage = handleApiError(err);
            setErrorState(errorMessage);

            // Log error
            logger.error('Error occurred', {
                error: err,
                context,
                message: errorMessage,
            });

            // Call custom error handler if provided
            if (onError) {
                onError(err, errorMessage);
            }
        },
        [onError]
    );

    const clearError = useCallback(() => {
        setErrorState(null);
    }, []);

    const setError = useCallback((message) => {
        setErrorState(message);
    }, []);

    return {
        error,
        hasError: error !== null,
        handleError,
        clearError,
        setError,
    };
};
