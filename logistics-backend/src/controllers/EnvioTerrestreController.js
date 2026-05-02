const objController = {};
const modelo = require("../models/EnvioTerrestre");
const modeloCliente = require("../models/Cliente");
const modeloProducto = require("../models/Producto");
const modeloBodega = require("../models/Bodega");
const modeloVehiculo = require("../models/Vehiculos");

const includes = [
  { model: modeloCliente, as: "cliente" },
  { model: modeloProducto, as: "producto" },
  { model: modeloBodega, as: "bodega" },
  { model: modeloVehiculo, as: "vehiculo" },
];

objController.CrearActualizar = (req, res, next) => {
  const {
    cliente_id,
    producto_id,
    bodega_id,
    vehiculo_id,
    cantidad_producto,
    precio_base,
    fecha_registro,
    fecha_entrega,
  } = req.body;

  modelo
    .create({
      cliente_id,
      producto_id,
      bodega_id,
      vehiculo_id,
      cantidad_producto,
      precio_base,
      fecha_registro,
      fecha_entrega,
      precio_final: cantidad_producto > 10
      ? precio_base * 0.95
      : precio_base

    })
    .then((result) => {
      res.json({ success: true, data: result });
    })
    .catch(next);
};

objController.consultar = (req, res, next) => {
  modelo
    .findAll({ include: includes })
    .then((result) => {
      res.json({ success: true, data: result });
    })
    .catch(next);
};

objController.consultarPorId = (req, res, next) => {
  modelo
    .findByPk(req.params.id, { include: includes })
    .then((result) => {
      if (!result)
        return res.json({
          success: false,
          data: "Envío terrestre no encontrado",
        });
      res.json({ success: true, data: result });
    })
    .catch(next);
};

objController.consultarPorCliente = (req, res, next) => {
  modelo
    .findAll({ where: { cliente_id: req.params.id }, include: includes })
    .then((result) => {
      res.json({ success: true, data: result });
    })
    .catch(next);
};

objController.consultarPorBodega = (req, res, next) => {
  modelo
    .findAll({ where: { bodega_id: req.params.id }, include: includes })
    .then((result) => {
      res.json({ success: true, data: result });
    })
    .catch(next);
};

objController.actualizar = async (req, res, next) => {
  const {
    cliente_id,
    producto_id,
    bodega_id,
    vehiculo_id,
    cantidad_producto,
    precio_base,
    fecha_registro,
    fecha_entrega,
  } = req.body;

  try {
    const instance = await modelo.findByPk(req.params.id);
    if (!instance)
      return res
        .status(404)
        .json({ ok: false, message: "Envío terrestre no encontrado" });
    const precio_final = Number(cantidad_producto) > 10
      ? Number(precio_base) * 0.95
      : Number(precio_base);
    instance.set({
      cliente_id,
      producto_id,
      bodega_id,
      vehiculo_id,
      cantidad_producto,
      precio_base,
      precio_final,
      fecha_registro,
      fecha_entrega,
    });
    const result = await instance.save();
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

objController.eliminar = (req, res, next) => {
  modelo
    .destroy({ where: { id: req.params.id } })
    .then((result) => {
      res.json({ success: true, data: result });
    })
    .catch(next);
};

module.exports = objController;
