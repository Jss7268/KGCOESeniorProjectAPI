var Promise = require('promise');
var config = require('./../config/config');
var Experiment = require('./../models/experiment');
var Verifier = require('../validators/verifier');

module.exports = {
  createExperiment: (req, res) => {
    hydrateReq(req)
      .then(() => {
        return Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
      })
      .then(() => {
        return Experiment.create(req.body)
      })
      .then((result) => {
        return res.status(201).json({
          message: 'success! created new experiment',
          id: result.id
        });
      })
      .catch((err) => {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  changeStartTime: (req, res) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
      .then(() => {
        return Experiment.updateStartTime({ id: req.params.id, start_time: req.body.start_time })
      })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  deleteExperiment: (req, res) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
      .then(() => {
        return Experiment.delete({ id: req.params.id })
      })
      .then((result) => {
        return res.status(200).json({
          message: 'deleted experiment with id: ' + result.id
        });
      })
      .catch((err) => {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  getOneExperiment: (req, res) => {
    Experiment.findOne({ id: req.params.id })
      .then((result) => {
        /*delete result.last_login_attempt;
        delete result.login_attempts;*/
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  listExperiments: (req, res) => {
    Experiment.findAll()
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },
};

function hydrateReq(req) {
  return new Promise((resolve, reject) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'admin_user')
      .then(() => {
        if (!('creator_id' in req.body)) {
          req.body.creator_id = req.decoded.uid;
        }
        resolve();
      })
      .catch(() => {
        // only an admin can fake different users
        req.body.creator_id = req.decoded.uid;
        resolve();
      })
  });
}