const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Puerto = sequelize.define('Puerto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  codigo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
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
  tableName: 'puertos',
});

module.exports = Puerto;
