const objController = {}
const modelo = require('../models/Usuario');

objController.CrearActualizar = (req, res) => {
    const {
        nombre,
        email,
        password_hash,
        rol,
    } = req.body

    modelo.findOne({
        where: { email }
    }).then((obj) => {
        if (obj) {
            obj.update({ nombre, email, rol })
                .then((result) => { res.json({ success: true, data: result }) })
                .catch((error) => { res.json({ success: false, data: error }) })
        } else {
            modelo.create({ nombre, email, password_hash, rol })
                .then((result) => { res.json({ success: true, data: result }) })
                .catch((error) => { res.json({ success: false, data: error }) })
        }
    }).catch((error) => {
        res.json({ success: false, data: error })
    })
}

objController.consultar = (req, res) => {
    modelo.findAll({
        attributes: { exclude: ['password_hash'] }
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch((error) => { res.json({ success: false, data: error }) })
}

objController.consultarPorId = (req, res) => {
    modelo.findByPk(req.params.id, {
        attributes: { exclude: ['password_hash'] }
    }).then((result) => {
        if (!result) return res.json({ success: false, data: 'Usuario no encontrado' })
        res.json({ success: true, data: result })
    }).catch((error) => { res.json({ success: false, data: error }) })
}

objController.consultarPorRol = (req, res) => {
    modelo.findAll({
        where: { rol: req.params.rol },
        attributes: { exclude: ['password_hash'] }
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch((error) => { res.json({ success: false, data: error }) })
}

objController.actualizar = (req, res) => {
    const { nombre, email, rol } = req.body

    modelo.update(
        { nombre, email, rol },
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
