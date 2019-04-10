var Promise = require('promise');
var config = require('./../config/config');
var Experiment = require('./../models/experiment');

module.exports = {
  createExperiment: function(req, res) {
    Experiment.create(req.body)
      .then(function(result) {
        return res.status(200).json({
          message: 'success! created account for new experiment',
          id: result.id
        });
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  changeStartTime: function(req, res) {
    Experiment.updateStartTime({ id: req.params.id, start_time: req.body.start_time })
      .then(function(result) {
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  deleteExperiment: function(req, res) {
    Experiment.delete({ id: req.params.id })
      .then(function(result) {
        return res.status(200).json({
          message: 'deleted experiment with id: ' + result.id
        });
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  getOneExperiment: function(req, res) {
    Experiment.findOne({ id: req.params.id })
      .then(function(result) {
        /*delete result.last_login_attempt;
        delete result.login_attempts;*/
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  getSelfExperiment: function(req, res) {
    Experiment.findOne({ id: req.decoded.sub })
      .then(function(result) {
        /*delete result.last_login_attempt;
        delete result.login_attempts;*/
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  listExperiments: function(req, res) {
    Experiment.findAll()
      .then(function(result) {
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },
};