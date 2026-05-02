const { Router } = require('express');
const ctrl = require('../controllers/VehiculoController');

const router = Router();

router.get('/',              ctrl.consultar);
router.get('/placa/:placa',  ctrl.consultarPorPlaca);
router.get('/bodega/:id',    ctrl.consultarPorBodega);
router.get('/:id',           ctrl.consultarPorId);
router.post('/',          ctrl.CrearActualizar);
router.put('/:id',        ctrl.actualizar);
router.delete('/:id',     ctrl.eliminar);

module.exports = router;
