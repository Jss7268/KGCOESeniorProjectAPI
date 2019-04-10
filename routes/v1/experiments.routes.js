var router = require('express').Router();
var experimentsController = require('./../../controllers/experiments.controller');

router.get('/experiments',  experimentsController.listExperiments);
router.post('/experiments', experimentsController.createExperiment);
router.get('/experiments/me',  experimentsController.getSelfExperiment);
router.get('/experiments/:id', experimentsController.getOneExperiment);
router.put('/experiments/:id/start_time', experimentsController.changeStartTime);
router.delete('/experiments/:id', experimentsController.deleteExperiment);

module.exports = router;