const router = require('express').Router();
const jwt = require('jsonwebtoken');

// Authentication routes
router.use(require('./auth.routes'));

// API v1
router.use('/v1', require('./v1/users.routes'));
router.use('/v1', require('./v1/experiments.routes'));
router.use('/v1', require('./v1/device_outputs.routes'));
router.use('/v1', require('./v1/output_types.routes'));
router.use('/v1', require('./v1/devices_experiments.routes'));
router.use('/v1', require('./v1/user_inputs.routes'));

// API Error routes
router.use((req, res) => {
  return res.status(404).json({
    message : "Not found."
    });
});

module.exports = router;