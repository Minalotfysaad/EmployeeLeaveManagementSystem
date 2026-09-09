import { AxiosError } from 'axios';
import { ApiProblemDetails } from '../types/api.types';

export function getErrorMessage(error: unknown): string {
  if (!error) return 'An unknown error occurred.';

  if (typeof error === 'string') return error;

  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiProblemDetails | undefined;
    if (data) {
      // If validation dictionary exists
      if (data.errors && Object.keys(data.errors).length > 0) {
        const errorMessages = Object.values(data.errors).flat();
        return errorMessages[0] || data.title || 'Validation error occurred.';
      }
      if (data.detail) return data.detail;
      if (data.title) return data.title;
    }

    if (error.message === 'Network Error') {
      return 'Cannot reach backend server. Please verify the API is running.';
    }

    if (error.response?.status === 401) {
      return 'Invalid email or password. Please try again.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (error.response?.status === 404) {
      return 'The requested resource was not found.';
    }
    return error.message;
  }

  if (error instanceof Error) return error.message;

  return 'An unexpected error occurred.';
}
