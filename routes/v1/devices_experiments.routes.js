var router = require('express').Router();
var devicesExperimentsController = require('./../../controllers/devices_experiments.controller');
var DeviceExperiment = require('./../../models/device_experiment');
var UserAccess = require('./../../models/user_access');
var Verifier = require('../../validators/verifier')(UserAccess);

router.get('/devices_experiments',  devicesExperimentsController.listDevicesExperiments(DeviceExperiment, Verifier));
router.post('/devices_experiments', devicesExperimentsController.createDeviceExperiment(DeviceExperiment, Verifier));
router.get('/devices_experiments/:device_id/experiments', devicesExperimentsController.listExperimentsByDevice(DeviceExperiment, Verifier));
router.get('/devices_experiments/:experiment_id/devices', devicesExperimentsController.listDevicesByExperiment(DeviceExperiment, Verifier));
router.get('/devices_experiments/:device_id/:experiment_id', devicesExperimentsController.getOneDeviceExperiment(DeviceExperiment, Verifier));
router.delete('/devices_experiments/:device_id/:experiment_id', devicesExperimentsController.deleteDeviceExperiment(DeviceExperiment, Verifier));

module.exports = router;