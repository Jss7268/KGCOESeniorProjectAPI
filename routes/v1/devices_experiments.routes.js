var router = require('express').Router();
var devicesExperimentsController = require('./../../controllers/devices_experiments.controller');
var DeviceExperiment = require('./../../models/device_experiment');

router.get('/devices_experiments',  devicesExperimentsController.listDevicesExperiments(DeviceExperiment));
router.post('/devices_experiments', devicesExperimentsController.createDeviceExperiment(DeviceExperiment));
router.get('/devices_experiments/:device_id/experiments', devicesExperimentsController.listExperimentsByDevice(DeviceExperiment));
router.get('/devices_experiments/:experiment_id/devices', devicesExperimentsController.listDevicesByExperiment(DeviceExperiment));
router.get('/devices_experiments/:device_id/:experiment_id', devicesExperimentsController.getOneDeviceExperiment(DeviceExperiment));
router.delete('/devices_experiments/:device_id/:experiment_id', devicesExperimentsController.deleteDeviceExperiment(DeviceExperiment));

module.exports = router;