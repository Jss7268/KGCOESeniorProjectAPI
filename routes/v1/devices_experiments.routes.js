var router = require('express').Router();
var devicesExperimentsController = require('./../../controllers/devices_experiments.controller');
var DeviceExperiment = require('./../../models/device_experiment');
var UserAccess = require('./../../models/user_access');
var Verifier = require('../../validators/verifier')(UserAccess);

router.get('/devices_experiments',  devicesExperimentsController(DeviceExperiment, Verifier).listDevicesExperiments);
router.post('/devices_experiments', devicesExperimentsController(DeviceExperiment, Verifier).createDeviceExperiment);
router.get('/devices_experiments/:device_id/experiments', devicesExperimentsController(DeviceExperiment, Verifier).listExperimentsByDevice);
router.get('/devices_experiments/:experiment_id/devices', devicesExperimentsController(DeviceExperiment, Verifier).listDevicesByExperiment);
router.get('/devices_experiments/:device_id/:experiment_id', devicesExperimentsController(DeviceExperiment, Verifier).getOneDeviceExperiment);
router.delete('/devices_experiments/:device_id/:experiment_id', devicesExperimentsController(DeviceExperiment, Verifier).deleteDeviceExperiment);

module.exports = router;