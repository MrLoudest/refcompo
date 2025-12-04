export type AppErrorCode =
  | 'VALIDATION_ERROR'
  | 'FORMAT_ERROR'
  | 'LOOKUP_ERROR'
  | 'EXTERNAL_SERVICE_ERROR'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  code: AppErrorCode;
  status: number;
  details?: unknown;
  constructor(code: AppErrorCode, message: string, status = 400, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const badRequest = (message: string, details?: unknown) =>
  new AppError('VALIDATION_ERROR', message, 400, details);
export const notFound = (message: string) => new AppError('LOOKUP_ERROR', message, 404);
export const serviceUnavailable = (message: string, details?: unknown) =>
  new AppError('EXTERNAL_SERVICE_ERROR', message, 503, details);
export const internal = (message: string, details?: unknown) =>
  new AppError('INTERNAL_ERROR', message, 500, details);


