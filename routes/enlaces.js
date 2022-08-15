const express = require('express');
const router = express.Router();
const enlacesController = require('../controllers/enlacesController');
const archivosController = require('../controllers/archivosController');
const {check} = require('express-validator');
const auth = require('../middleware/auth');

router.post('/',
    [
        check('nombre', "selecciona un archivo").not().isEmpty(),
        check('nombre_original', "selecciona un archivo").not().isEmpty()
    ],
    auth,
    enlacesController.nuevoEnlace
);

router.get('/',
    enlacesController.obtenerTodos
);

router.get('/:url',
    enlacesController.tienePassword,
    enlacesController.obtenerEnlace
)

router.post('/:url',
    enlacesController.verificarPassword,
    enlacesController.obtenerEnlace
)


module.exports = router;