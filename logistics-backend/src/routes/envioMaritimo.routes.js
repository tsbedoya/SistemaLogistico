const { Router } = require('express');
const ctrl = require('../controllers/EnvioMaritimoController');

const router = Router();

router.get('/',            ctrl.consultar);
router.get('/cliente/:id', ctrl.consultarPorCliente);
router.get('/puerto/:id',  ctrl.consultarPorPuerto);
router.get('/:id',         ctrl.consultarPorId);
router.post('/',           ctrl.CrearActualizar);
router.delete('/:id',      ctrl.eliminar);

module.exports = router;
