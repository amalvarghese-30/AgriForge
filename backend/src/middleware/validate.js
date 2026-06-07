import { AppError } from '../utils/errors.js';

export function validate(schema, source = 'body') {
  return async (request, reply) => {
    const data = request[source];
    const result = schema.safeParse(data);

    if (!result.success) {
      throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', {
        details: result.error.flatten().fieldErrors,
      });
    }

    request.validated = result.data;
  };
}
