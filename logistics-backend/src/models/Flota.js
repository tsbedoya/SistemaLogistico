const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Flota = sequelize.define('Flota', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  puerto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'puertos', key: 'id' },
  },
  numero_flota: {
    type: DataTypes.STRING(8),
    allowNull: false,
    unique: { msg: 'Ya existe una flota con ese número' },
    validate: {
      is: {
        args: /^[A-Z]{3}[0-9]{4}[A-Z]$/,
        msg: 'El número de flota debe tener el formato AAA1234A',
      },
    },
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  tableName: 'flotas',
});

module.exports = Flota;
