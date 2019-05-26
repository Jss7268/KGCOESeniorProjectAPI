const router = require('express').Router();
const Injector = require('../../config/injector');
const ExperimentsController = Injector.ExperimentsController;

router.get('/experiments', ExperimentsController.listExperiments);
router.post('/experiments', ExperimentsController.createExperiment);
router.get('/experiments/:id', ExperimentsController.getOneExperiment);
router.put('/experiments/:id/start_time', ExperimentsController.changeStartTime);
router.delete('/experiments/:id', ExperimentsController.deleteExperiment);

module.exports = router;