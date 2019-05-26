const router = require('express').Router();
const Injector = require('../../config/injector')
const DevicesExperimentsController = Injector.DevicesExperimentsController;

router.get('/devices_experiments', DevicesExperimentsController.listDevicesExperiments);
router.post('/devices_experiments', DevicesExperimentsController.createDeviceExperiment);
router.get('/devices_experiments/:device_id/experiments', DevicesExperimentsController.listExperimentsByDevice);
router.get('/devices_experiments/:experiment_id/devices', DevicesExperimentsController.listDevicesByExperiment);
router.get('/devices_experiments/:device_id/:experiment_id', DevicesExperimentsController.getOneDeviceExperiment);
router.delete('/devices_experiments/:device_id/:experiment_id', DevicesExperimentsController.deleteDeviceExperiment);

module.exports = router;