const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

// Manejador centralizado de errores — Bonus #6
// Express lo reconoce como error handler por tener 4 parámetros (err, req, res, next)
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Error de validación de Sequelize (campo inválido, regex fallido, etc.)
  if (err instanceof ValidationError) {
    return res.status(422).json({
      ok: false,
      message: 'Error de validación',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  // Campo único duplicado (numero_guia, email, etc.)
  if (err instanceof UniqueConstraintError) {
    return res.status(400).json({
      ok: false,
      message: 'Ya existe un registro con ese valor',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  // FK inválida (cliente_id, bodega_id, etc. que no existen)
  if (err instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      ok: false,
      message: 'El recurso relacionado no existe',
    });
  }

  // Error genérico
  return res.status(500).json({
    ok: false,
    message: 'Error interno del servidor',
  });
}

module.exports = errorHandler;
