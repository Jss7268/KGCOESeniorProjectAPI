var router = require('express').Router();
var experimentsController = require('./../../controllers/experiments.controller');
var Experiment = require('./../../models/experiment');

router.get('/experiments',  experimentsController.listExperiments(Experiment));
router.post('/experiments', experimentsController.createExperiment(Experiment));
router.get('/experiments/:id', experimentsController.getOneExperiment(Experiment));
router.put('/experiments/:id/start_time', experimentsController.changeStartTime(Experiment));
router.delete('/experiments/:id', experimentsController.deleteExperiment(Experiment));

module.exports = router;