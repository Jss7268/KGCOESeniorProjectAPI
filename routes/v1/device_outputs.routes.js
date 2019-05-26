var router = require('express').Router();
var deviceOutputsController = require('./../../controllers/device_outputs.controller');
var DeviceOutput = require('./../../models/device_output');
var Verifier = require('../../validators/verifier');

router.get('/device_outputs',  deviceOutputsController.listDeviceOutputs(DeviceOutput, Verifier));
router.post('/device_outputs', deviceOutputsController.createDeviceOutput(DeviceOutput, Verifier));
router.get('/device_outputs/experiment/:experiment_id', deviceOutputsController.listDeviceOutputsByExperiment(DeviceOutput, Verifier));
router.get('/device_outputs/device/:device_id', deviceOutputsController.listDeviceOutputsByDevice(DeviceOutput, Verifier));
router.get('/device_outputs/:device_id/:experiment_id', deviceOutputsController.listDeviceOutputsByDeviceExperiment(DeviceOutput, Verifier));
router.get('/device_outputs/:id', deviceOutputsController.getOneDeviceOutput(DeviceOutput, Verifier));
router.put('/device_outputs/:experiment_id/:device_id/:output_type_id/output_value', deviceOutputsController.changeOutputValue(DeviceOutput, Verifier));
router.get('/device_outputs/:experiment_id/:device_id/:output_type_id', deviceOutputsController.getOneDeviceOutput(DeviceOutput, Verifier));
router.delete('/device_outputs/:id', deviceOutputsController.deleteDeviceOutput(DeviceOutput, Verifier));

module.exports = router;