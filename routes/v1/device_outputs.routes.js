const router = require('express').Router();
const Injector = require('../../config/injector')
const DeviceOutputsController = Injector.DeviceOutputsController;

router.get('/device_outputs',  deviceOutputsController.listDeviceOutputs);
router.post('/device_outputs', deviceOutputsController.createDeviceOutput);
router.get('/device_outputs/experiment/:experiment_id', deviceOutputsController.listDeviceOutputsByExperiment);
router.get('/device_outputs/device/:device_id', deviceOutputsController.listDeviceOutputsByDevice);
router.get('/device_outputs/:device_id/:experiment_id', deviceOutputsController.listDeviceOutputsByDeviceExperiment);
router.get('/device_outputs/:id', deviceOutputsController.getOneDeviceOutput);
router.put('/device_outputs/:id/output_value', deviceOutputsController.changeOutputValue);
router.delete('/device_outputs/:id', deviceOutputsController.deleteDeviceOutput);

module.exports = router;