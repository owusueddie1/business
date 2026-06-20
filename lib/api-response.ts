import { NextResponse } from 'next/server';
import { logger } from './logger';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  requestId?: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function success<T>(data: T, statusCode: number = 200, requestId?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      requestId,
    } as ApiResponse<T>,
    { status: statusCode }
  );
}

export function error(
  statusCode: number,
  message: string,
  context?: Record<string, any>,
  requestId?: string
): NextResponse<ApiResponse> {
  logger.error(message, undefined, { statusCode, context });

  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
      requestId,
    } as ApiResponse,
    { status: statusCode }
  );
}

export function badRequest(message: string = 'Bad Request', context?: Record<string, any>, requestId?: string): NextResponse<ApiResponse> {
  return error(400, message, context, requestId);
}

export function unauthorized(message: string = 'Unauthorized', context?: Record<string, any>, requestId?: string): NextResponse<ApiResponse> {
  return error(401, message, context, requestId);
}

export function forbidden(message: string = 'Forbidden', context?: Record<string, any>, requestId?: string): NextResponse<ApiResponse> {
  return error(403, message, context, requestId);
}

export function notFound(message: string = 'Not Found', context?: Record<string, any>, requestId?: string): NextResponse<ApiResponse> {
  return error(404, message, context, requestId);
}

export function conflict(message: string = 'Conflict', context?: Record<string, any>, requestId?: string): NextResponse<ApiResponse> {
  return error(409, message, context, requestId);
}

export function tooManyRequests(message: string = 'Too Many Requests', context?: Record<string, any>, requestId?: string): NextResponse<ApiResponse> {
  const response = error(429, message, context, requestId);
  response.headers.set('Retry-After', '60');
  return response;
}

export function internalError(message: string = 'Internal Server Error', context?: Record<string, any>, requestId?: string): NextResponse<ApiResponse> {
  return error(500, message, context, requestId);
}

export function handleApiError(err: unknown, requestId?: string): NextResponse<ApiResponse> {
  if (err instanceof ApiError) {
    return error(err.statusCode, err.message, err.context, requestId);
  }

  if (err instanceof Error) {
    logger.error('Unhandled error', err);
    return internalError('An unexpected error occurred', { originalMessage: err.message }, requestId);
  }

  logger.error('Unknown error type', err);
  return internalError('An unexpected error occurred', undefined, requestId);
}
