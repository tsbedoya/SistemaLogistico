const objController = {}
const modelo = require('../models/Cliente');

objController.CrearActualizar = (req, res, next) => {
    const {
        nombre,
        email,
        telefono,
        documento,
    } = req.body

    modelo.findOne({
        where: { documento }
    }).then((obj) => {
        if (obj) {
            obj.update({ nombre, email, telefono, documento })
                .then((result) => { res.json({ success: true, data: result }) })
                .catch(next)
        } else {
            modelo.create({ nombre, email, telefono, documento })
                .then((result) => { res.json({ success: true, data: result }) })
                .catch(next)
        }
    }).catch(next)
}

objController.consultar = (req, res, next) => {
    modelo.findAll()
        .then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

objController.consultarPorId = (req, res, next) => {
    modelo.findByPk(req.params.id)
        .then((result) => {
            if (!result) return res.json({ success: false, data: 'Cliente no encontrado' })
            res.json({ success: true, data: result })
        })
        .catch(next)
}

objController.consultarPorDocumento = (req, res, next) => {
    modelo.findOne({
        where: { documento: req.params.documento }
    }).then((result) => {
        if (!result) return res.json({ success: false, data: 'Cliente no encontrado' })
        res.json({ success: true, data: result })
    }).catch(next)
}

objController.actualizar = (req, res, next) => {
    const { nombre, email, telefono, documento } = req.body

    modelo.update(
        { nombre, email, telefono, documento },
        { where: { id: req.params.id }, validate: true }
    )
    .then((result) => { res.json({ success: true, data: result }) })
    .catch(next)
}

objController.eliminar = (req, res, next) => {
    modelo.destroy({
        where: { id: req.params.id }
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

module.exports = objController
