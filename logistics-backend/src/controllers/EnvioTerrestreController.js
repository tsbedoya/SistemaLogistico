const objController = {}
const modelo = require('../models/EnvioTerrestre');
const modeloCliente = require('../models/Cliente');
const modeloProducto = require('../models/Producto');
const modeloBodega = require('../models/Bodega');

objController.CrearActualizar = (req, res) => {
    const {
        cliente_id,
        producto_id,
        bodega_id,
        cantidad_producto,
        precio_base,
        placa_vehiculo,
        numero_guia,
        fecha_registro,
        fecha_entrega,
    } = req.body

    modelo.findOne({
        where: { numero_guia }
    }).then((obj) => {
        if (obj) {
            obj.update({
                cliente_id,
                producto_id,
                bodega_id,
                cantidad_producto,
                precio_base,
                placa_vehiculo,
                numero_guia,
                fecha_registro,
                fecha_entrega,
            }).then((result) => { res.json({ success: true, data: result }) })
                .catch((error) => { res.json({ success: false, data: error }) })
        } else {
            modelo.create({
                cliente_id,
                producto_id,
                bodega_id,
                cantidad_producto,
                precio_base,
                placa_vehiculo,
                numero_guia,
                fecha_registro,
                fecha_entrega,
            }).then((result) => { res.json({ success: true, data: result }) })
                .catch((error) => { res.json({ success: false, data: error }) })
        }
    }).catch((error) => {
        res.json({ success: false, data: error })
    })
}

objController.consultar = (req, res) => {
    modelo.findAll({
        include: [
            { model: modeloCliente,  as: 'cliente'  },
            { model: modeloProducto, as: 'producto' },
            { model: modeloBodega,   as: 'bodega'   },
        ]
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch((error) => { res.json({ success: false, data: error }) })
}

objController.consultarPorId = (req, res) => {
    modelo.findByPk(req.params.id, {
        include: [
            { model: modeloCliente,  as: 'cliente'  },
            { model: modeloProducto, as: 'producto' },
            { model: modeloBodega,   as: 'bodega'   },
        ]
    }).then((result) => {
        if (!result) return res.json({ success: false, data: 'Envío terrestre no encontrado' })
        res.json({ success: true, data: result })
    }).catch((error) => { res.json({ success: false, data: error }) })
}

objController.consultarPorCliente = (req, res) => {
    modelo.findAll({
        where: { cliente_id: req.params.id },
        include: [
            { model: modeloCliente,  as: 'cliente'  },
            { model: modeloProducto, as: 'producto' },
            { model: modeloBodega,   as: 'bodega'   },
        ]
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch((error) => { res.json({ success: false, data: error }) })
}

objController.consultarPorBodega = (req, res) => {
    modelo.findAll({
        where: { bodega_id: req.params.id },
        include: [
            { model: modeloCliente,  as: 'cliente'  },
            { model: modeloProducto, as: 'producto' },
            { model: modeloBodega,   as: 'bodega'   },
        ]
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch((error) => { res.json({ success: false, data: error }) })
}

objController.actualizar = (req, res) => {
    const {
        cliente_id, producto_id, bodega_id,
        cantidad_producto, precio_base,
        placa_vehiculo, numero_guia,
        fecha_registro, fecha_entrega,
    } = req.body

    modelo.update(
        { cliente_id, producto_id, bodega_id, cantidad_producto, precio_base, placa_vehiculo, numero_guia, fecha_registro, fecha_entrega },
        { where: { id: req.params.id } }
    )
    .then((result) => { res.json({ success: true, data: result }) })
    .catch((error) => { res.json({ success: false, data: error }) })
}

objController.eliminar = (req, res) => {
    modelo.destroy({
        where: { id: req.params.id }
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch((error) => { res.json({ success: false, data: error }) })
}

module.exports = objController
