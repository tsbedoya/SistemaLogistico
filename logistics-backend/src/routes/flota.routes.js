const { Router } = require('express');
const ctrl = require('../controllers/FlotaController');

const router = Router();

router.get('/',              ctrl.consultar);
router.get('/numero/:numero', ctrl.consultarPorNumero);
router.get('/puerto/:id',    ctrl.consultarPorPuerto);
router.get('/:id',           ctrl.consultarPorId);
router.post('/',             ctrl.CrearActualizar);
router.put('/:id',           ctrl.actualizar);
router.delete('/:id',        ctrl.eliminar);

module.exports = router;
