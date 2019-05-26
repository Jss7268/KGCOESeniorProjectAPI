const db = require('./db');

const Generic = require('../models/generic')(db);

const Validator = require('../validators/validator')(Generic);

const UserAccess = require('../models/user_access')(db, Validator);
const User = require('../models/user')(db, UserAccess, Validator);
const DeviceExperiment = require('../models/device_experiment')(db, Validator);
const DeviceOutput = require('../models/device_output')(db, DeviceExperiment, Validator);
const Experiment = require('../models/experiment')(db, Validator);
const OutputType = require('../models/output_type')(db, Validator);

const Verifier = require('../validators/verifier')(UserAccess);

const DeviceOutputsController = require('../controllers/device_outputs.controller')(DeviceOutput, Verifier);
const DevicesExperimentsController = require('../controllers/devices_experiments.controller')(DeviceExperiment, Verifier);
const ExperimentsController = require('../controllers/experiments.controller')(Experiment, Verifier);
const OutputTypesController = require('../controllers/output_types.controller')(OutputType, Verifier);
const UsersController = require('../controllers/users.controller')(User, Verifier);


module.exports = {
    db,
    Generic,
    Validator,
    UserAccess,
    User,
    DeviceExperiment,
    DeviceOutput,
    Experiment,
    OutputType,
    Verifier,
    DeviceOutputsController,
    DevicesExperimentsController,
    ExperimentsController,
    OutputTypesController,
    UsersController,

}