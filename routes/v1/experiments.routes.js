var router = require('express').Router();
var experimentsController = require('./../../controllers/experiments.controller');
var Experiment = require('./../../models/experiment');
var UserAccess = require('./../../models/user_access');
var Verifier = require('../../validators/verifier')(UserAccess);

router.get('/experiments',  experimentsController.listExperiments(Experiment, Verifier));
router.post('/experiments', experimentsController.createExperiment(Experiment, Verifier));
router.get('/experiments/:id', experimentsController.getOneExperiment(Experiment, Verifier));
router.put('/experiments/:id/start_time', experimentsController.changeStartTime(Experiment, Verifier));
router.delete('/experiments/:id', experimentsController.deleteExperiment(Experiment, Verifier));

module.exports = router;