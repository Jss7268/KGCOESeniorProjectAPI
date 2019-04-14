var router = require('express').Router();
var outputTypesController = require('./../../controllers/output_types.controller');

router.get('/output_types',  outputTypesController.listOutputTypes);
router.post('/output_types', outputTypesController.createOutputType);
router.get('/output_types/:id', outputTypesController.getOneOutputType);
router.get('/output_types/name/:name', outputTypesController.getOneOutputTypeName);
router.put('/output_types/:id/units', outputTypesController.changeUnits);
router.put('/output_types/name/:name/units', outputTypesController.changeUnitsName);
router.delete('/output_types/:id', outputTypesController.deleteOutputType);
router.delete('/output_types/name/:name', outputTypesController.deleteOutputTypeName);

module.exports = router;