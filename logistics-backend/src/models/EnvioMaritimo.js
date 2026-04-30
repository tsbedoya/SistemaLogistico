const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  // Formato: AAA1234A — validado con regex
  numero_flota: {
    type: DataTypes.STRING(8),
    allowNull: false,
    validate: {
      is: {
        args: /^[A-Z]{3}[0-9]{4}[A-Z]$/,
        msg: 'El número de flota debe tener el formato AAA1234A',
      },
    },
  },
  numero_guia: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: { msg: 'El número de guía ya existe' },
    validate: {
      is: {
        args: /^[A-Z0-9]{10}$/,
        msg: 'El número de guía debe tener 10 caracteres alfanuméricos en mayúscula',
      },
    },
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
  hooks: {
    beforeCreate: calcularPrecioFinal,
    beforeUpdate: calcularPrecioFinal,
  },
});

function calcularPrecioFinal(envio) {
  const cantidad = envio.cantidad_producto;
  const precioBase = parseFloat(envio.precio_base);
  envio.precio_final = cantidad > LIMITE_DESCUENTO
    ? precioBase * (1 - DESCUENTO_MARITIMO)
    : precioBase;
}

module.exports = EnvioMaritimo;
