var router = require('express').Router();
var experimentsController = require('./../../controllers/experiments.controller');
var Experiment = require('./../../models/experiment');
var UserAccess = require('./../../models/user_access');
var Verifier = require('../../validators/verifier')(UserAccess);

router.get('/experiments',  experimentsController(Experiment, Verifier).listExperiments);
router.post('/experiments', experimentsController(Experiment, Verifier).createExperiment);
router.get('/experiments/:id', experimentsController(Experiment, Verifier).getOneExperiment);
router.put('/experiments/:id/start_time', experimentsController(Experiment, Verifier).changeStartTime);
router.delete('/experiments/:id', experimentsController(Experiment, Verifier).deleteExperiment);

module.exports = router;