/**
 * Custom hook for managing form state
 */

import { useState, useCallback } from 'react';

/**
 * Generic form management hook
 * @param {object} initialValues - Initial form values
 * @param {function} onSubmit - Submit handler
 * @param {function} validate - Validation function
 * @returns {object} Form state and handlers
 */
export const useForm = (initialValues, onSubmit, validate) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((event) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === 'checkbox' ? checked : value;

        setValues((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    }, [errors]);

    const handleSubmit = useCallback(
        async (event) => {
            if (event) {
                event.preventDefault();
            }

            // Validate if validator provided
            if (validate) {
                const validationResult = validate(values);
                if (!validationResult.isValid) {
                    setErrors(validationResult.errors);
                    return;
                }
            }

            setIsSubmitting(true);
            setErrors({});

            try {
                await onSubmit(values);
            } catch (error) {
                // Error handling is done in the onSubmit callback
            } finally {
                setIsSubmitting(false);
            }
        },
        [values, validate, onSubmit]
    );

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setIsSubmitting(false);
    }, [initialValues]);

    const setFieldValue = useCallback((name, value) => {
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const setFieldError = useCallback((name, error) => {
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    }, []);

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        resetForm,
        setFieldValue,
        setFieldError,
        setValues,
    };
};
