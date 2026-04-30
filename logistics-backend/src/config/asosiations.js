// Punto central que carga todos los modelos y define las asociaciones
// Importar este archivo en lugar de cada modelo individualmente

const sequelize = require('./database');

const Cliente          = require('../models/Cliente');
const Producto         = require('../models/Producto');
const Bodega           = require('../models/Bodega');
const Puerto           = require('../models/Puerto');
const EnvioTerrestre   = require('../models/EnvioTerrestre');
const EnvioMaritimo    = require('../models/EnvioMaritimo');
const Usuario          = require('../models/Usuario');

// ── Asociaciones ─────────────────────────────────────────────

Cliente.hasMany(EnvioTerrestre, { foreignKey: 'cliente_id', as: 'enviosTerrestre' });
EnvioTerrestre.belongsTo(Cliente,  { foreignKey: 'cliente_id', as: 'cliente'  });


Cliente.hasMany(EnvioMaritimo,  { foreignKey: 'cliente_id', as: 'enviosMaritimo'  });
EnvioMaritimo.belongsTo(Cliente,   { foreignKey: 'cliente_id',  as: 'cliente'  });

Producto.hasMany(EnvioTerrestre, { foreignKey: 'producto_id', as: 'enviosTerrestre' });
EnvioTerrestre.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });


Producto.hasMany(EnvioMaritimo,  { foreignKey: 'producto_id', as: 'enviosMaritimo'  });
EnvioMaritimo.belongsTo(Producto,  { foreignKey: 'producto_id', as: 'producto' });

Bodega.hasMany(EnvioTerrestre,   { foreignKey: 'bodega_id',   as: 'envios' });
EnvioTerrestre.belongsTo(Bodega,   { foreignKey: 'bodega_id',   as: 'bodega'   });

Puerto.hasMany(EnvioMaritimo,    { foreignKey: 'puerto_id',   as: 'envios' });
EnvioMaritimo.belongsTo(Puerto,    { foreignKey: 'puerto_id',   as: 'puerto'   });


module.exports = {
  sequelize,
  Cliente,
  Producto,
  Bodega,
  Puerto,
  EnvioTerrestre,
  EnvioMaritimo,
  Usuario,
};
