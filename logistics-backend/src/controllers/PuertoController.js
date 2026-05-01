const objController = {}
const modelo = require('../models/Puerto');

objController.CrearActualizar = (req, res) => {
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
                .catch((error) => { res.json({ success: false, data: error }) })
        } else {
            modelo.create({ nombre, codigo, ciudad, pais })
                .then((result) => { res.json({ success: true, data: result }) })
                .catch((error) => { res.json({ success: false, data: error }) })
        }
    }).catch((error) => {
        res.json({ success: false, data: error })
    })
}

objController.consultar = (req, res) => {
    modelo.findAll()
        .then((result) => { res.json({ success: true, data: result }) })
        .catch((error) => { res.json({ success: false, data: error }) })
}

objController.consultarPorId = (req, res) => {
    modelo.findByPk(req.params.id)
        .then((result) => {
            if (!result) return res.json({ success: false, data: 'Puerto no encontrado' })
            res.json({ success: true, data: result })
        })
        .catch((error) => { res.json({ success: false, data: error }) })
}

objController.consultarPorCodigo = (req, res) => {
    modelo.findOne({
        where: { codigo: req.params.codigo }
    }).then((result) => {
        if (!result) return res.json({ success: false, data: 'Puerto no encontrado' })
        res.json({ success: true, data: result })
    }).catch((error) => { res.json({ success: false, data: error }) })
}

objController.actualizar = (req, res) => {
    const { nombre, codigo, ciudad, pais } = req.body

    modelo.update(
        { nombre, codigo, ciudad, pais },
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
