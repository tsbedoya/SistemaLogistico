const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  // Roles: ADMIN, OPERADOR
  rol: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'OPERADOR'
   },
}, {
  tableName: 'usuarios',
  timestamps: false,
  hooks: {
    // Hashea la contraseña antes de guardar
    beforeCreate: async (usuario) => {
      if (usuario.password_hash) {
        usuario.password_hash = await bcrypt.hash(usuario.password_hash, 10);
      }
    },
  },
});

// Método para verificar contraseña
Usuario.prototype.verificarPassword = function (password) {
  return bcrypt.compare(password, this.password_hash);
};

module.exports = Usuario;
