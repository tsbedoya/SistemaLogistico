const { Router } = require('express');
const ctrl = require('../controllers/ClienteController');

const router = Router();

router.get('/',                     ctrl.consultar);
router.get('/documento/:documento', ctrl.consultarPorDocumento);
router.get('/:id',                  ctrl.consultarPorId);
router.post('/',                    ctrl.CrearActualizar);
router.put('/:id',                  ctrl.actualizar);
router.delete('/:id',               ctrl.eliminar);

module.exports = router;
