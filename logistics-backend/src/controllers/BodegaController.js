const objController = {}
const modelo = require('../models/Bodega');

objController.CrearActualizar = (req, res, next) => {
    const {
        nombre,
        direccion,
        ciudad,
        pais,
    } = req.body

    modelo.findOne({
        where: { nombre, ciudad, pais }
    }).then((obj) => {
        if (obj) {
            obj.update({ nombre, direccion, ciudad, pais })
                .then((result) => { res.json({ success: true, data: result }) })
                .catch(next)
        } else {
            modelo.create({ nombre, direccion, ciudad, pais })
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
            if (!result) return res.json({ success: false, data: 'Bodega no encontrada' })
            res.json({ success: true, data: result })
        })
        .catch(next)
}

objController.consultarPorCiudad = (req, res, next) => {
    modelo.findAll({
        where: { ciudad: req.params.ciudad }
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

objController.actualizar = (req, res, next) => {
    const { nombre, direccion, ciudad, pais } = req.body

    modelo.update(
        { nombre, direccion, ciudad, pais },
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
