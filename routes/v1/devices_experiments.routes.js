var router = require('express').Router();
var devicesExperimentsController = require('./../../controllers/devices_experiments.controller');

router.get('/devices_experiments',  devicesExperimentsController.listDevicesExperiments);
router.post('/devices_experiments', devicesExperimentsController.createDeviceExperiment);
router.get('/devices_experiments/:device_id/experiments', devicesExperimentsController.listExperimentsByDevice);
router.get('/devices_experiments/:experiment_id/devices', devicesExperimentsController.listDevicesByExperiment);
router.get('/devices_experiments/:device_id/:experiment_id', devicesExperimentsController.getOneDeviceExperiment);
router.delete('/devices_experiments/:device_id/:experiment_id', devicesExperimentsController.deleteDeviceExperiment);

module.exports = router;