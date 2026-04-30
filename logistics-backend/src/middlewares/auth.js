const jwt = require('jsonwebtoken');

// Valida que el request tenga un Bearer token válido (Bonus #5)
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      ok: false,
      message: 'Token de autorización requerido',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, email, rol }
    next();
  } catch (err) {
    return res.status(401).json({
      ok: false,
      message: 'Token inválido o expirado',
    });
  }
}

// Middleware de autorización por rol (Bonus #7)
// Uso: router.delete('/:id', auth, authorize('ADMIN'), controller.eliminar)
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.usuario?.rol)) {
      return res.status(403).json({
        ok: false,
        message: 'No tienes permiso para realizar esta acción',
      });
    }
    next();
  };
}

module.exports = { authMiddleware, authorize };
