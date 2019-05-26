const router = require('express').Router();
const Injector = require('../../config/injector')
const OutputTypesController = Injector.OutputTypesController

router.get('/output_types', OutputTypesController.listOutputTypes);
router.post('/output_types', OutputTypesController.createOutputType);
router.get('/output_types/:id', OutputTypesController.getOneOutputType);
router.get('/output_types/name/:output_type_name', OutputTypesController.getOneOutputTypeName);
router.put('/output_types/:id/units', OutputTypesController.changeUnits);
router.put('/output_types/name/:output_type_name/units', OutputTypesController.changeUnitsName);
router.delete('/output_types/:id', OutputTypesController.deleteOutputType);
router.delete('/output_types/name/:output_type_name', OutputTypesController.deleteOutputTypeName);

module.exports = router;