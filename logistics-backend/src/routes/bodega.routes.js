const { Router } = require('express');
const ctrl = require('../controllers/BodegaController');

const router = Router();

router.get('/',               ctrl.consultar);
router.get('/ciudad/:ciudad', ctrl.consultarPorCiudad);
router.get('/:id',            ctrl.consultarPorId);
router.post('/',              ctrl.CrearActualizar);
router.delete('/:id',         ctrl.eliminar);

module.exports = router;
