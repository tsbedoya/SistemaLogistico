const objController = {}
const modelo = require('../models/EnvioMaritimo');
const modeloCliente = require('../models/Cliente');
const modeloProducto = require('../models/Producto');
const modeloPuerto = require('../models/Puerto');
const modeloFlota = require('../models/Flota');

const includes = [
    { model: modeloCliente,  as: 'cliente'  },
    { model: modeloProducto, as: 'producto' },
    { model: modeloPuerto,   as: 'puerto'   },
    { model: modeloFlota,    as: 'flota'    },
];

objController.CrearActualizar = (req, res, next) => {
    const {
        cliente_id, producto_id, puerto_id, flota_id,
        cantidad_producto, precio_base,
        fecha_registro, fecha_entrega,
    } = req.body

    modelo.create({
        cliente_id, producto_id, puerto_id, flota_id,
        cantidad_producto, precio_base,
        fecha_registro, fecha_entrega,
        precio_final : cantidad_producto > 10 ? precio_base * 0.97 :
        precio_base

    }).then((result) => { res.json({ success: true, data: result }) })
      .catch(next)
}

objController.consultar = (req, res, next) => {
    modelo.findAll({ include: includes })
        .then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

objController.consultarPorId = (req, res, next) => {
    modelo.findByPk(req.params.id, { include: includes })
        .then((result) => {
            if (!result) return res.json({ success: false, data: 'Envío marítimo no encontrado' })
            res.json({ success: true, data: result })
        })
        .catch(next)
}

objController.consultarPorCliente = (req, res, next) => {
    modelo.findAll({ where: { cliente_id: req.params.id }, include: includes })
        .then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

objController.consultarPorPuerto = (req, res, next) => {
    modelo.findAll({ where: { puerto_id: req.params.id }, include: includes })
        .then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

objController.actualizar = async (req, res, next) => {
    const {
        cliente_id, producto_id, puerto_id, flota_id,
        cantidad_producto, precio_base,
        fecha_registro, fecha_entrega,
    } = req.body

    try {
        const instance = await modelo.findByPk(req.params.id)
        if (!instance) return res.status(404).json({ ok: false, message: 'Envío marítimo no encontrado' })
        const precio_final = Number(cantidad_producto) > 10
            ? Number(precio_base) * 0.97
            : Number(precio_base)
        instance.set({ cliente_id, producto_id, puerto_id, flota_id, cantidad_producto, precio_base, precio_final, fecha_registro, fecha_entrega })
        const result = await instance.save()
        res.json({ success: true, data: result })
    } catch (err) {
        next(err)
    }
}

objController.eliminar = (req, res, next) => {
    modelo.destroy({
        where: { id: req.params.id }
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

module.exports = objController
