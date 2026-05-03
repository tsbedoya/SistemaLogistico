const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const crypto = require('crypto');

// Descuento del 3% si la cantidad supera 10 unidades (regla de negocio #3)
const DESCUENTO_MARITIMO = 0.03;
const LIMITE_DESCUENTO = 10;


const EnvioMaritimo = sequelize.define('EnvioMaritimo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'clientes', key: 'id' },
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'productos', key: 'id' },
  },
  puerto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'puertos', key: 'id' },
  },
  cantidad_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'La cantidad debe ser mayor a 0' },
    },
  },
  precio_base: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0.01], msg: 'El precio debe ser mayor a 0' },
    },
  },
  precio_final: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  flota_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'flotas', key: 'id' },
  },
  numero_guia: {
    type: DataTypes.STRING(10),
    unique: true,
    defaultValue: () => crypto.randomBytes(5).toString('hex').toUpperCase(),
  },
  fecha_registro: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  fecha_entrega: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      esPosterior(value) {
        if (value < this.fecha_registro) {
          throw new Error('La fecha de entrega debe ser posterior a la fecha de registro');
        }
      },
    },
  },
}, {
  tableName: 'envios_maritimos',
  timestamps: false,
});

module.exports = EnvioMaritimo;
