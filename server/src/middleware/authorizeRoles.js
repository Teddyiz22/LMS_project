// Intended for routes after authentication middleware has populated req.user.
export function authorizeRoles(...allowedRoles) {
  return (request, response, next) => {
    if (!request.user) {
      return response.status(401).json({ success: false, error: 'Authentication required.' })
    }

    if (!allowedRoles.includes(request.user.role)) {
      return response.status(403).json({ success: false, error: 'Insufficient permissions.' })
    }

    return next()
  }
}
