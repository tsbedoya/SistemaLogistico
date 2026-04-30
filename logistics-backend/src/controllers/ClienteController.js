const objController = {}
const modelo = require('../models/Cliente');

objController.CrearActualizar = (req, res) => {
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
                .catch((error) => { res.json({ success: false, data: error }) })
        } else {
            modelo.create({ nombre, email, telefono, documento })
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
            if (!result) return res.json({ success: false, data: 'Cliente no encontrado' })
            res.json({ success: true, data: result })
        })
        .catch((error) => { res.json({ success: false, data: error }) })
}

objController.consultarPorDocumento = (req, res) => {
    modelo.findOne({
        where: { documento: req.params.documento }
    }).then((result) => {
        if (!result) return res.json({ success: false, data: 'Cliente no encontrado' })
        res.json({ success: true, data: result })
    }).catch((error) => { res.json({ success: false, data: error }) })
}

objController.eliminar = (req, res) => {
    modelo.destroy({
        where: { id: req.params.id }
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch((error) => { res.json({ success: false, data: error }) })
}

module.exports = objController
