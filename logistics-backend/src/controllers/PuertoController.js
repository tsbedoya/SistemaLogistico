const objController = {}
const modelo = require('../models/Puerto');

objController.CrearActualizar = (req, res, next) => {
    const {
        nombre,
        codigo,
        ciudad,
        pais,
    } = req.body

    modelo.findOne({
        where: { codigo }
    }).then((obj) => {
        if (obj) {
            obj.update({ nombre, codigo, ciudad, pais })
                .then((result) => { res.json({ success: true, data: result }) })
                .catch(next)
        } else {
            modelo.create({ nombre, codigo, ciudad, pais })
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
            if (!result) return res.json({ success: false, data: 'Puerto no encontrado' })
            res.json({ success: true, data: result })
        })
        .catch(next)
}

objController.consultarPorCodigo = (req, res, next) => {
    modelo.findOne({
        where: { codigo: req.params.codigo }
    }).then((result) => {
        if (!result) return res.json({ success: false, data: 'Puerto no encontrado' })
        res.json({ success: true, data: result })
    }).catch(next)
}

objController.actualizar = (req, res, next) => {
    const { nombre, codigo, ciudad, pais } = req.body

    modelo.update(
        { nombre, codigo, ciudad, pais },
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
