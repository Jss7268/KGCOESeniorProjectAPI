var router = require('express').Router();
const Injector = require('../../config/injector')
const userInputsController = Injector.UserInputsController;

router.get('/user_inputs',  userInputsController.listUserInputs);
router.post('/user_inputs', userInputsController.createUserInput);
router.get('/user_inputs/experiment/:experiment_id', userInputsController.listUserInputsByExperiment);
router.get('/user_inputs/device/:device_id', userInputsController.listUserInputsByDevice);
router.get('/user_inputs/:id', userInputsController.getOneUserInput);
router.delete('/user_inputs/:id', userInputsController.deleteUserInput);
router.post('/user_inputs/description', userInputsController.changeDescription);
// router.get('/user_inputs/:device_id/:experiment_id', userInputsController.listUserInputsByDeviceExperiment); //needed?

module.exports = router;