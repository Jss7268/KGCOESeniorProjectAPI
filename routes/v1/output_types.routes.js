var router = require('express').Router();
var outputTypesController = require('./../../controllers/output_types.controller');
var OutputType = require('./../../models/output_type');

router.get('/output_types',  outputTypesController.listOutputTypes(OutputType));
router.post('/output_types', outputTypesController.createOutputType(OutputType));
router.get('/output_types/:id', outputTypesController.getOneOutputType(OutputType));
router.get('/output_types/name/:output_type_name', outputTypesController.getOneOutputTypeName(OutputType));
router.put('/output_types/:id/units', outputTypesController.changeUnits(OutputType));
router.put('/output_types/name/:output_type_name/units', outputTypesController.changeUnitsName(OutputType));
router.delete('/output_types/:id', outputTypesController.deleteOutputType(OutputType));
router.delete('/output_types/name/:output_type_name', outputTypesController.deleteOutputTypeName(OutputType));

module.exports = router;