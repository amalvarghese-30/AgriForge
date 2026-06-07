import { verifyAccessToken } from '../utils/jwt.js';

export async function authMiddleware(request, reply) {
  const header = request.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return reply.status(401).send({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' },
    });
  }

  const token = header.slice(7);

  try {
    const payload = verifyAccessToken(token);
    request.user = payload;
  } catch (err) {
    const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'UNAUTHORIZED';
    return reply.status(401).send({
      success: false,
      error: { code, message: err.message },
    });
  }
}

export async function optionalAuth(request, reply) {
  const header = request.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return;

  const token = header.slice(7);
  try {
    request.user = verifyAccessToken(token);
  } catch {
    // Token invalid — continue without auth
  }
}
