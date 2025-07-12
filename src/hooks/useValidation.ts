import { useState, useCallback } from 'react';

export type ValidationRule<T = unknown> = {
  validator: (value: T) => boolean | Promise<boolean>;
  message: string;
  level?: 'error' | 'warning';
};

export type ValidationSchema<T = Record<string, unknown>> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export type ValidationErrors<T> = {
  [K in keyof T]?: string[];
};

export const useValidation = <T extends Record<string, unknown>>(
  schema: ValidationSchema<T>
) => {
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateField = useCallback(async (
    fieldName: keyof T,
    value: T[keyof T]
  ): Promise<string[]> => {
    const fieldRules = schema[fieldName];
    if (!fieldRules) return [];

    const fieldErrors: string[] = [];

    for (const rule of fieldRules) {
      try {
        const isValid = await rule.validator(value);
        if (!isValid) {
          fieldErrors.push(rule.message);
        }
      } catch (error) {
        fieldErrors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return fieldErrors;
  }, [schema]);

  const validateSingle = useCallback(async (
    fieldName: keyof T,
    value: T[keyof T]
  ) => {
    const fieldErrors = await validateField(fieldName, value);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors.length > 0 ? fieldErrors : undefined
    }));

    return fieldErrors.length === 0;
  }, [validateField]);

  const validateAll = useCallback(async (values: T): Promise<boolean> => {
    setIsValidating(true);
    const newErrors: ValidationErrors<T> = {};
    let isValid = true;

    for (const fieldName of Object.keys(schema) as (keyof T)[]) {
      const fieldErrors = await validateField(fieldName, values[fieldName]);
      if (fieldErrors.length > 0) {
        newErrors[fieldName] = fieldErrors;
        isValid = false;
      }
    }

    setErrors(newErrors);
    setIsValidating(false);
    return isValid;
  }, [schema, validateField]);

  const clearErrors = useCallback((fieldName?: keyof T) => {
    if (fieldName) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: undefined
      }));
    } else {
      setErrors({});
    }
  }, []);

  const hasErrors = useCallback((fieldName?: keyof T) => {
    if (fieldName) {
      return !!(errors[fieldName]?.length);
    }
    return Object.values(errors).some(fieldErrors => fieldErrors?.length);
  }, [errors]);

  const getFieldError = useCallback((fieldName: keyof T) => {
    return errors[fieldName]?.[0]; // Return first error message
  }, [errors]);

  const getFieldErrors = useCallback((fieldName: keyof T) => {
    return errors[fieldName] || [];
  }, [errors]);

  return {
    errors,
    isValidating,
    validateSingle,
    validateAll,
    clearErrors,
    hasErrors,
    getFieldError,
    getFieldErrors,
  };
};

// Common validation rules
export const validationRules = {
  required: <T>(message = 'This field is required'): ValidationRule<T> => ({
    validator: (value) => {
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return value != null;
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validator: (value) => !value || value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validator: (value) => !value || value.length <= max,
    message: message || `Must be no more than ${max} characters`,
  }),

  email: (message = 'Invalid email address'): ValidationRule<string> => ({
    validator: (value) => {
      if (!value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  url: (message = 'Invalid URL'): ValidationRule<string> => ({
    validator: (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),

  json: (message = 'Invalid JSON'): ValidationRule<string> => ({
    validator: (value) => {
      if (!value) return true;
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule<string> => ({
    validator: (value) => !value || regex.test(value),
    message,
  }),

  custom: <T>(
    validator: (value: T) => boolean | Promise<boolean>,
    message: string
  ): ValidationRule<T> => ({
    validator,
    message,
  }),
};