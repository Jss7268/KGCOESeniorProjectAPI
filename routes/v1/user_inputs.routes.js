var router = require('express').Router();
const Injector = require('../../config/injector')
const UserInputsController = Injector.UserInputsController;

router.get('/user_inputs',  UserInputsController.listUserInputs);
router.post('/user_inputs', UserInputsController.createUserInput);
router.get('/user_inputs/experiment/:experiment_id', UserInputsController.listUserInputsByExperiment);
router.get('/user_inputs/device/:device_id', UserInputsController.listUserInputsByDevice);
router.get('/user_inputs/:id', UserInputsController.getOneUserInput);
router.delete('/user_inputs/:id', UserInputsController.deleteUserInput);
router.put('/user_inputs/description', UserInputsController.changeDescription);

module.exports = router;