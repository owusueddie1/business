/**
 * Production-grade logging utility
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogContext {
  [key: string]: any;
}

function getTimestamp(): string {
  return new Date().toISOString();
}

function formatLog(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = getTimestamp();
  const contextStr = context ? ` ${JSON.stringify(context)}` : '';
  return `[${timestamp}] [${level}] ${message}${contextStr}`;
}

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatLog(LogLevel.DEBUG, message, context));
    }
  },

  info: (message: string, context?: LogContext) => {
    console.log(formatLog(LogLevel.INFO, message, context));
  },

  warn: (message: string, context?: LogContext) => {
    console.warn(formatLog(LogLevel.WARN, message, context));
  },

  error: (message: string, error?: Error | unknown, context?: LogContext) => {
    const errorDetails = error instanceof Error ? { message: error.message, stack: error.stack } : error;
    console.error(formatLog(LogLevel.ERROR, message, { ...context, error: errorDetails }));
  },
};

export function captureException(error: unknown, context?: LogContext): void {
  logger.error('Uncaught exception', error, context);
  // TODO: Send to Sentry or other error tracking service
  // Sentry.captureException(error, { extra: context });
}

export function captureMessage(message: string, level: LogLevel = LogLevel.INFO, context?: LogContext): void {
  logger[level.toLowerCase() as keyof typeof logger](message, context);
  // TODO: Send to Sentry or other monitoring service
  // Sentry.captureMessage(message, level);
}
