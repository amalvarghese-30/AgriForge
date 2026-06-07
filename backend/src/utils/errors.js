export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', extra = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.assign(this, extra);
  }
}

export function errorHandler(error, request, reply) {
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';

  if (statusCode === 500) {
    request.log.error(error);
    try { const Sentry = require('@sentry/node'); Sentry.captureException(error); } catch {}
  }

  return reply.status(statusCode).send({
    success: false,
    error: {
      code,
      message: statusCode === 500 ? 'Internal server error' : error.message,
      ...(error.details && { details: error.details }),
    },
  });
}
