var router = require('express').Router();
var deviceOutputsController = require('./../../controllers/device_outputs.controller');
var DeviceOutput = require('./../../models/device_output');

router.get('/device_outputs',  deviceOutputsController.listDeviceOutputs(DeviceOutput));
router.post('/device_outputs', deviceOutputsController.createDeviceOutput(DeviceOutput));
router.get('/device_outputs/experiment/:experiment_id', deviceOutputsController.listDeviceOutputsByExperiment(DeviceOutput));
router.get('/device_outputs/device/:device_id', deviceOutputsController.listDeviceOutputsByDevice(DeviceOutput));
router.get('/device_outputs/:device_id/:experiment_id', deviceOutputsController.listDeviceOutputsByDeviceExperiment(DeviceOutput));
router.get('/device_outputs/:id', deviceOutputsController.getOneDeviceOutput(DeviceOutput));
router.put('/device_outputs/:experiment_id/:device_id/:output_type_id/output_value', deviceOutputsController.changeOutputValue(DeviceOutput));
router.get('/device_outputs/:experiment_id/:device_id/:output_type_id', deviceOutputsController.getOneDeviceOutput(DeviceOutput));
router.delete('/device_outputs/:id', deviceOutputsController.deleteDeviceOutput(DeviceOutput));

module.exports = router;