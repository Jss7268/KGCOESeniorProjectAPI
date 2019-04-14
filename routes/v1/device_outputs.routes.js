var router = require('express').Router();
var deviceOutputsController = require('./../../controllers/device_outputs.controller');

router.get('/device_outputs',  deviceOutputsController.listDeviceOutputs);
router.post('/device_outputs', deviceOutputsController.createDeviceOutput);
router.get('/device_outputs/:experiment_id/:device_id/:output_type_id', deviceOutputsController.getOneDeviceOutput);
router.put('/device_outputs/:experiment_id/:device_id/:output_type_id/output_value', deviceOutputsController.changeOutputValue);
router.delete('/device_outputs/:experiment_id/:device_id/:output_type_id', deviceOutputsController.deleteDeviceOutput);

module.exports = router;