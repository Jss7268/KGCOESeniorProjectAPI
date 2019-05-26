var router = require('express').Router();
var outputTypesController = require('./../../controllers/output_types.controller');
var OutputType = require('./../../models/output_type');
var UserAccess = require('./../../models/user_access');
var Verifier = require('../../validators/verifier')(UserAccess);

router.get('/output_types',  outputTypesController(OutputType, Verifier).listOutputTypes);
router.post('/output_types', outputTypesController(OutputType, Verifier).createOutputType);
router.get('/output_types/:id', outputTypesController(OutputType, Verifier).getOneOutputType);
router.get('/output_types/name/:output_type_name', outputTypesController(OutputType, Verifier).getOneOutputTypeName);
router.put('/output_types/:id/units', outputTypesController(OutputType, Verifier).changeUnits);
router.put('/output_types/name/:output_type_name/units', outputTypesController(OutputType, Verifier).changeUnitsName);
router.delete('/output_types/:id', outputTypesController(OutputType, Verifier).deleteOutputType);
router.delete('/output_types/name/:output_type_name', outputTypesController(OutputType, Verifier).deleteOutputTypeName);

module.exports = router;