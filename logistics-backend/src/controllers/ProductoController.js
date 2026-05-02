const objController = {}
const modelo = require('../models/Producto');

objController.CrearActualizar = (req, res, next) => {
    const {
        nombre,
        descripcion,
        tipo,
    } = req.body

    modelo.findOne({
        where: { nombre, tipo }
    }).then((obj) => {
        if (obj) {
            obj.update({ nombre, descripcion, tipo })
                .then((result) => { res.json({ success: true, data: result }) })
                .catch(next)
        } else {
            modelo.create({ nombre, descripcion, tipo })
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
            if (!result) return res.json({ success: false, data: 'Producto no encontrado' })
            res.json({ success: true, data: result })
        })
        .catch(next)
}

objController.consultarPorTipo = (req, res, next) => {
    modelo.findAll({
        where: { tipo: req.params.tipo }
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

objController.actualizar = (req, res, next) => {
    const { nombre, descripcion, tipo } = req.body

    modelo.update(
        { nombre, descripcion, tipo },
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
