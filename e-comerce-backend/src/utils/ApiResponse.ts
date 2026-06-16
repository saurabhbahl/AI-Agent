import { Response } from 'express';

interface ApiResponseOptions<T> {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const sendResponse = <T>(res: Response, statusCode: number, options: ApiResponseOptions<T>) => {
  return res.status(statusCode).json({
    success: options.success ?? statusCode < 400,
    message: options.message,
    data: options.data,
    errors: options.errors,
    pagination: options.pagination,
  });
};
