const { Router } = require('express');
const { authMiddleware } = require('../middlewares/auth');
const { registro, login } = require('../controllers/authController');

const bodegaRouter         = require('./bodega.routes');
const clienteRouter        = require('./cliente.routes');
const productoRouter       = require('./producto.routes');
const puertoRouter         = require('./puerto.routes');
const vehiculoRouter       = require('./vehiculo.routes');
const flotaRouter          = require('./flota.routes');
const envioTerrestreRouter = require('./envioTerrestre.routes');
const envioMaritimoRouter  = require('./envioMaritimo.routes');
const usuarioRouter        = require('./usuario.routes');

const router = Router();

// Rutas públicas
router.post('/auth/registro', registro);
router.post('/auth/login',    login);

// Todas las rutas siguientes requieren token Bearer
router.use(authMiddleware);

router.use('/bodegas',           bodegaRouter);
router.use('/clientes',          clienteRouter);
router.use('/productos',         productoRouter);
router.use('/puertos',           puertoRouter);
router.use('/vehiculos',         vehiculoRouter);
router.use('/flotas',            flotaRouter);
router.use('/envios/terrestres', envioTerrestreRouter);
router.use('/envios/maritimos',  envioMaritimoRouter);
router.use('/usuarios',          usuarioRouter);

module.exports = router;
