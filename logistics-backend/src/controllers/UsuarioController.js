const objController = {}
const modelo = require('../models/Usuario');

objController.CrearActualizar = (req, res, next) => {
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
                .catch(next)
        } else {
            modelo.create({ nombre, email, password_hash, rol })
                .then((result) => { res.json({ success: true, data: result }) })
                .catch(next)
        }
    }).catch(next)
}

objController.consultar = (req, res, next) => {
    modelo.findAll({
        attributes: { exclude: ['password_hash'] }
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

objController.consultarPorId = (req, res, next) => {
    modelo.findByPk(req.params.id, {
        attributes: { exclude: ['password_hash'] }
    }).then((result) => {
        if (!result) return res.json({ success: false, data: 'Usuario no encontrado' })
        res.json({ success: true, data: result })
    }).catch(next)
}

objController.consultarPorRol = (req, res, next) => {
    modelo.findAll({
        where: { rol: req.params.rol },
        attributes: { exclude: ['password_hash'] }
    }).then((result) => { res.json({ success: true, data: result }) })
        .catch(next)
}

objController.actualizar = (req, res, next) => {
    const { nombre, email, rol } = req.body

    modelo.update(
        { nombre, email, rol },
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
