const objController = {}
const modelo = require('../models/Vehiculos');
const modeloBodega = require('../models/Bodega');

objController.CrearActualizar = (req, res, next) => {
    const { bodega_id, placa, marca } = req.body;

    modelo.findOne({ where: { placa } }).then((obj) => {
        if (obj) {
            obj.update({ bodega_id, placa, marca })
                .then((result) => { res.json({ success: true, data: result }) })
                .catch(next)
        } else {
            modelo.create({ bodega_id, placa, marca })
                .then((result) => { res.json({ success: true, data: result }) })
                .catch(next)
        }
    }).catch(next)
}

objController.consultar = (req, res, next) => {
    modelo.findAll({ include: [{ model: modeloBodega, as: 'bodega' }] })
        .then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

objController.consultarPorId = (req, res, next) => {
    modelo.findByPk(req.params.id, { include: [{ model: modeloBodega, as: 'bodega' }] })
        .then((result) => {
            if (!result) return res.json({ success: false, data: 'Vehículo no encontrado' })
            res.json({ success: true, data: result })
        })
        .catch(next)
}

objController.consultarPorPlaca = (req, res, next) => {
    modelo.findOne({
        where: { placa: req.params.placa },
        include: [{ model: modeloBodega, as: 'bodega' }],
    }).then((result) => {
            if (!result) return res.json({ success: false, data: 'Vehículo no encontrado' })
            res.json({ success: true, data: result })
        })
        .catch(next)
}

objController.consultarPorBodega = (req, res, next) => {
    modelo.findAll({
        where: { bodega_id: req.params.id },
        include: [{ model: modeloBodega, as: 'bodega' }],
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

objController.actualizar = (req, res, next) => {
    const { bodega_id, placa, marca } = req.body;
    modelo.update({ bodega_id, placa, marca }, { where: { id: req.params.id }, validate: true })
        .then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

objController.eliminar = (req, res, next) => {
    modelo.destroy({ where: { id: req.params.id } })
        .then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

module.exports = objController;
