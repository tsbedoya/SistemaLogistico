// Punto central que carga todos los modelos y define las asociaciones
// Importar este archivo en lugar de cada modelo individualmente

const sequelize = require('./database');

const Cliente          = require('../models/Cliente');
const Producto         = require('../models/Producto');
const Bodega           = require('../models/Bodega');
const Puerto           = require('../models/Puerto');
const Vehiculo         = require('../models/Vehiculos');
const Flota            = require('../models/Flota');
const EnvioTerrestre   = require('../models/EnvioTerrestre');
const EnvioMaritimo    = require('../models/EnvioMaritimo');
const Usuario          = require('../models/Usuario');

// ── Asociaciones ─────────────────────────────────────────────

Cliente.hasMany(EnvioTerrestre, { foreignKey: 'cliente_id', as: 'enviosTerrestre' });
EnvioTerrestre.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

Cliente.hasMany(EnvioMaritimo, { foreignKey: 'cliente_id', as: 'enviosMaritimo' });
EnvioMaritimo.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

Producto.hasMany(EnvioTerrestre, { foreignKey: 'producto_id', as: 'enviosTerrestre' });
EnvioTerrestre.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

Producto.hasMany(EnvioMaritimo, { foreignKey: 'producto_id', as: 'enviosMaritimo' });
EnvioMaritimo.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

// Bodega alberga varios vehículos — el vehículo tiene una bodega base
Bodega.hasMany(Vehiculo, { foreignKey: 'bodega_id', as: 'vehiculos' });
Vehiculo.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });

// Puerto alberga varias flotas — la flota tiene un puerto base
Puerto.hasMany(Flota, { foreignKey: 'puerto_id', as: 'flotas' });
Flota.belongsTo(Puerto, { foreignKey: 'puerto_id', as: 'puerto' });

// Bodega como destino de entrega en envíos terrestres
Bodega.hasMany(EnvioTerrestre, { foreignKey: 'bodega_id', as: 'envios' });
EnvioTerrestre.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });

// Puerto como destino de entrega en envíos marítimos
Puerto.hasMany(EnvioMaritimo, { foreignKey: 'puerto_id', as: 'envios' });
EnvioMaritimo.belongsTo(Puerto, { foreignKey: 'puerto_id', as: 'puerto' });

// Un vehículo puede realizar muchos envíos terrestres
Vehiculo.hasMany(EnvioTerrestre, { foreignKey: 'vehiculo_id', as: 'envios' });
EnvioTerrestre.belongsTo(Vehiculo, { foreignKey: 'vehiculo_id', as: 'vehiculo' });

// Una flota puede realizar muchos envíos marítimos
Flota.hasMany(EnvioMaritimo, { foreignKey: 'flota_id', as: 'envios' });
EnvioMaritimo.belongsTo(Flota, { foreignKey: 'flota_id', as: 'flota' });

module.exports = {
  sequelize,
  Cliente,
  Producto,
  Bodega,
  Puerto,
  Vehiculo,
  Flota,
  EnvioTerrestre,
  EnvioMaritimo,
  Usuario,
};
