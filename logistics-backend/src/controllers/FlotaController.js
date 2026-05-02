const objController = {}
const modelo = require('../models/Flota');
const modeloPuerto = require('../models/Puerto');

objController.CrearActualizar = (req, res, next) => {
    const { puerto_id, numero_flota, nombre } = req.body;

    modelo.findOne({ where: { numero_flota } }).then((obj) => {
        if (obj) {
            obj.update({ puerto_id, numero_flota, nombre })
                .then((result) => { res.json({ success: true, data: result }) })
                .catch(next)
        } else {
            modelo.create({ puerto_id, numero_flota, nombre })
                .then((result) => { res.json({ success: true, data: result }) })
                .catch(next)
        }
    }).catch(next)
}

objController.consultar = (req, res, next) => {
    modelo.findAll({ include: [{ model: modeloPuerto, as: 'puerto' }] })
        .then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

objController.consultarPorId = (req, res, next) => {
    modelo.findByPk(req.params.id, { include: [{ model: modeloPuerto, as: 'puerto' }] })
        .then((result) => {
            if (!result) return res.json({ success: false, data: 'Flota no encontrada' })
            res.json({ success: true, data: result })
        })
        .catch(next)
}

objController.consultarPorNumero = (req, res, next) => {
    modelo.findOne({
        where: { numero_flota: req.params.numero },
        include: [{ model: modeloPuerto, as: 'puerto' }],
    }).then((result) => {
            if (!result) return res.json({ success: false, data: 'Flota no encontrada' })
            res.json({ success: true, data: result })
        })
        .catch(next)
}

objController.consultarPorPuerto = (req, res, next) => {
    modelo.findAll({
        where: { puerto_id: req.params.id },
        include: [{ model: modeloPuerto, as: 'puerto' }],
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

objController.actualizar = (req, res, next) => {
    const { puerto_id, numero_flota, nombre } = req.body;
    modelo.update({ puerto_id, numero_flota, nombre }, { where: { id: req.params.id }, validate: true })
        .then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

objController.eliminar = (req, res, next) => {
    modelo.destroy({ where: { id: req.params.id } })
        .then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

module.exports = objController;
