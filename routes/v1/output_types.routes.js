var router = require('express').Router();
var outputTypesController = require('./../../controllers/output_types.controller');
var OutputType = require('./../../models/output_type');
var UserAccess = require('./../../models/user_access');
var Verifier = require('../../validators/verifier')(UserAccess);

router.get('/output_types',  outputTypesController.listOutputTypes(OutputType, Verifier));
router.post('/output_types', outputTypesController.createOutputType(OutputType, Verifier));
router.get('/output_types/:id', outputTypesController.getOneOutputType(OutputType, Verifier));
router.get('/output_types/name/:output_type_name', outputTypesController.getOneOutputTypeName(OutputType, Verifier));
router.put('/output_types/:id/units', outputTypesController.changeUnits(OutputType, Verifier));
router.put('/output_types/name/:output_type_name/units', outputTypesController.changeUnitsName(OutputType, Verifier));
router.delete('/output_types/:id', outputTypesController.deleteOutputType(OutputType, Verifier));
router.delete('/output_types/name/:output_type_name', outputTypesController.deleteOutputTypeName(OutputType, Verifier));

module.exports = router;