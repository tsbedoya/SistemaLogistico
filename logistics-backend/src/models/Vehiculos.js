const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehiculo = sequelize.define('Vehiculo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bodega_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'bodegas', key: 'id' },
  },
  placa: {
    type: DataTypes.STRING(6),
    allowNull: false,
    unique: { msg: 'Ya existe un vehículo con esa placa' },
    validate: {
      is: {
        args: /^[A-Z]{3}[0-9]{3}$/,
        msg: 'La placa debe tener el formato AAA123 (3 letras y 3 números)',
      },
    },
  },
  marca: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'vehiculos',
});

module.exports = Vehiculo;
