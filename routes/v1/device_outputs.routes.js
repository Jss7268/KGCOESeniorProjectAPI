const router = require('express').Router();
const Injector = require('../../config/injector')
const DeviceOutputsController = Injector.DeviceOutputsController;

router.get('/device_outputs',  DeviceOutputsController.listDeviceOutputs);
router.post('/device_outputs', DeviceOutputsController.createDeviceOutput);
router.get('/device_outputs/experiment/:experiment_id', DeviceOutputsController.listDeviceOutputsByExperiment);
router.get('/device_outputs/device/:device_id', DeviceOutputsController.listDeviceOutputsByDevice);
router.get('/device_outputs/:device_id/:experiment_id', DeviceOutputsController.listDeviceOutputsByDeviceExperiment);
router.get('/device_outputs/:id', DeviceOutputsController.getOneDeviceOutput);
router.put('/device_outputs/:id/output_value', DeviceOutputsController.changeOutputValue);
router.delete('/device_outputs/:id', DeviceOutputsController.deleteDeviceOutput);

module.exports = router;