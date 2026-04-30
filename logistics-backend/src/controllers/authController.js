const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// POST /api/auth/registro
async function registro(req, res, next) {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, message: 'nombre, email y password son requeridos' });
    }

    // El hook beforeCreate del modelo hashea la contraseña automáticamente
    const usuario = await Usuario.create({
      nombre,
      email,
      password_hash: password,
      rol: rol || 'OPERADOR',
    });

    return res.status(201).json({
      ok: true,
      message: 'Usuario creado exitosamente',
      data: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'email y password son requeridos' });
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !(await usuario.verificarPassword(password))) {
      return res.status(401).json({ ok: false, message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return res.json({
      ok: true,
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { registro, login };
