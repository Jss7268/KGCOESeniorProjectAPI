var router = require('express').Router();
var deviceOutputsController = require('./../../controllers/device_outputs.controller');
var DeviceOutput = require('./../../models/device_output');
var UserAccess = require('./../../models/user_access');
var Verifier = require('../../validators/verifier')(UserAccess);

router.get('/device_outputs',  deviceOutputsController(DeviceOutput, Verifier).listDeviceOutputs);
router.post('/device_outputs', deviceOutputsController(DeviceOutput, Verifier).createDeviceOutput);
router.get('/device_outputs/experiment/:experiment_id', deviceOutputsController(DeviceOutput, Verifier).listDeviceOutputsByExperiment);
router.get('/device_outputs/device/:device_id', deviceOutputsController(DeviceOutput, Verifier).listDeviceOutputsByDevice);
router.get('/device_outputs/:device_id/:experiment_id', deviceOutputsController(DeviceOutput, Verifier).listDeviceOutputsByDeviceExperiment);
router.get('/device_outputs/:id', deviceOutputsController(DeviceOutput, Verifier).getOneDeviceOutput);
router.put('/device_outputs/:experiment_id/:device_id/:output_type_id/output_value', deviceOutputsController(DeviceOutput, Verifier).changeOutputValue);
router.get('/device_outputs/:experiment_id/:device_id/:output_type_id', deviceOutputsController(DeviceOutput, Verifier).getOneDeviceOutput);
router.delete('/device_outputs/:id', deviceOutputsController(DeviceOutput, Verifier).deleteDeviceOutput);

module.exports = router;