/**
 * Error handling utilities
 * Centralized error processing for API and application errors
 */

/**
 * Extract meaningful error message from API error
 * @param {Error} error - Error object from API call
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error) => {
  // Server responded with error
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data?.error || 'Некорректные данные';
      case 401:
        return 'Требуется авторизация. Пожалуйста, войдите в систему.';
      case 403:
        return 'Доступ запрещен. У вас нет прав для этого действия.';
      case 404:
        return 'Запрашиваемый ресурс не найден.';
      case 409:
        return data?.error || 'Конфликт данных. Возможно, ресурс уже существует.';
      case 422:
        return data?.error || 'Ошибка валидации данных.';
      case 500:
        return 'Внутренняя ошибка сервера. Попробуйте позже.';
      case 503:
        return 'Сервис временно недоступен. Попробуйте позже.';
      default:
        return data?.error || data?.message || `Ошибка сервера (${status})`;
    }
  }
  
  // Request was made but no response received
  if (error.request) {
    return 'Нет связи с сервером. Проверьте подключение к интернету.';
  }
  
  // Something happened in setting up the request
  return error.message || 'Произошла неизвестная ошибка';
};

/**
 * Get error type for categorization
 * @param {Error} error - Error object
 * @returns {string} Error type
 */
export const getErrorType = (error) => {
  if (!error.response) {
    return 'network';
  }
  
  const status = error.response.status;
  if (status >= 500) return 'server';
  if (status >= 400) return 'client';
  return 'unknown';
};

/**
 * Check if error is authentication related
 * @param {Error} error - Error object
 * @returns {boolean} True if auth error
 */
export const isAuthError = (error) => {
  return error.response?.status === 401 || error.response?.status === 403;
};

/**
 * Check if error is network related
 * @param {Error} error - Error object
 * @returns {boolean} True if network error
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

/**
 * Format error for logging/debugging
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 * @returns {Object} Formatted error object
 */
export const formatErrorForLog = (error, context = {}) => {
  return {
    message: error.message,
    type: getErrorType(error),
    status: error.response?.status,
    url: error.config?.url,
    method: error.config?.method,
    data: error.response?.data,
    context,
    timestamp: new Date().toISOString(),
  };
};
