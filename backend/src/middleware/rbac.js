export function requireRole(...allowedRoles) {
  return async (request, reply) => {
    const userRoles = request.user?.roles || [];

    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return reply.status(403).send({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Requires one of these roles: ${allowedRoles.join(', ')}`,
        },
      });
    }
  };
}

export function requireAdmin(request, reply) {
  return requireRole('admin', 'super_admin')(request, reply);
}
