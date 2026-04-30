const { Router } = require('express');
const ctrl = require('../controllers/ProductoController');

const router = Router();

router.get('/',          ctrl.consultar);
router.get('/tipo/:tipo', ctrl.consultarPorTipo);
router.get('/:id',       ctrl.consultarPorId);
router.post('/',         ctrl.CrearActualizar);
router.delete('/:id',    ctrl.eliminar);

module.exports = router;
