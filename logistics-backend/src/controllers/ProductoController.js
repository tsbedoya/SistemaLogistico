const objController = {}
const modelo = require('../models/Producto');

objController.CrearActualizar = (req, res) => {
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
                .catch((error) => { res.json({ success: false, data: error }) })
        } else {
            modelo.create({ nombre, descripcion, tipo })
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
            if (!result) return res.json({ success: false, data: 'Producto no encontrado' })
            res.json({ success: true, data: result })
        })
        .catch((error) => { res.json({ success: false, data: error }) })
}

objController.consultarPorTipo = (req, res) => {
    modelo.findAll({
        where: { tipo: req.params.tipo }
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
