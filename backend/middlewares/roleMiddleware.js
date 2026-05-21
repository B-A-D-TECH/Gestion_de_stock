const roleMiddleware = (allowedRoles = []) => (req, res, next) => {
  const { role } = req.user || {};

  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ success: false, message: 'Accès refusé' });
  }

  next();
};
