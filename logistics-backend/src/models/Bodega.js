const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bodega = sequelize.define('Bodega', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  ciudad: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  pais: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'bodegas',
  timestamps: false,
});

module.exports = Bodega;
