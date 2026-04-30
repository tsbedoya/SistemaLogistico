const { Router } = require('express');
const ctrl = require('../controllers/EnvioTerrestreController');

const router = Router();

router.get('/',            ctrl.consultar);
router.get('/cliente/:id', ctrl.consultarPorCliente);
router.get('/bodega/:id',  ctrl.consultarPorBodega);
router.get('/:id',         ctrl.consultarPorId);
router.post('/',           ctrl.CrearActualizar);
router.delete('/:id',      ctrl.eliminar);

module.exports = router;
