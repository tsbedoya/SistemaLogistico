const objController = {}
const modelo = require('../models/Bodega');

objController.CrearActualizar = (req, res) => {
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
                .catch((error) => { res.json({ success: false, data: error }) })
        } else {
            modelo.create({ nombre, direccion, ciudad, pais })
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
            if (!result) return res.json({ success: false, data: 'Bodega no encontrada' })
            res.json({ success: true, data: result })
        })
        .catch((error) => { res.json({ success: false, data: error }) })
}

objController.consultarPorCiudad = (req, res) => {
    modelo.findAll({
        where: { ciudad: req.params.ciudad }
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch((error) => { res.json({ success: false, data: error }) })
}

objController.eliminar = (req, res) => {
    modelo.destroy({
        where: { id: req.params.id }
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch((error) => { res.json({ success: false, data: error }) })
}

module.exports = objController
