const { Router } = require('express');
const ctrl = require('../controllers/PuertoController');

const router = Router();

router.get('/',              ctrl.consultar);
router.get('/codigo/:codigo', ctrl.consultarPorCodigo);
router.get('/:id',           ctrl.consultarPorId);
router.post('/',             ctrl.CrearActualizar);
router.delete('/:id',        ctrl.eliminar);

module.exports = router;
