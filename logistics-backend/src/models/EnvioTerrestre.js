const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const crypto = require('crypto');

// Descuento del 5% si la cantidad supera 10 unidades (regla de negocio #2)
const DESCUENTO_TERRESTRE = 0.05;
const LIMITE_DESCUENTO = 10;

const generateNumericId = () => {
  return Date.now().toString() + Math.floor(Math.random() * 1000000).toString();
};

const EnvioTerrestre = sequelize.define('EnvioTerrestre', {
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
  bodega_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'bodegas', key: 'id' },
  },
  vehiculo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'vehiculos', key: 'id' },
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
  // precio_final se calcula con el hook beforeCreate/beforeUpdate
  precio_final: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  // Formato: AAA123 — validado con regex en el middleware de validación
  
  // 10 caracteres alfanuméricos, único globalmente
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
      esPosteriror(value) {
        if (value < this.fecha_registro) {
          throw new Error('La fecha de entrega debe ser posterior a la fecha de registro');
        }
      },
    },
  },
}, {
  tableName: 'envios_terrestres',
  timestamps: false,
  hooks: {
    beforeValidate: calcularPrecioFinal,
  },
});

function calcularPrecioFinal(envio) {
  const cantidad = envio.cantidad_producto;
  const precioBase = parseFloat(envio.precio_base);
  envio.precio_final = cantidad > LIMITE_DESCUENTO
    ? precioBase * (1 - DESCUENTO_TERRESTRE)
    : precioBase;
}

module.exports = EnvioTerrestre;
