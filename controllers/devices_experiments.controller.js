var Promise = require('promise');
var config = require('./../config/config');
var DeviceExperiment = require('./../models/device_experiment');

module.exports = {
  createDeviceExperiment: function(req, res) {
    DeviceExperiment.create(req.body)
      .then(function(result) {
        return res.status(201).json({
          message: 'success! created new device experiment',
          experiment_id: result.experiment_id,
          device_id: result.device_id
        });
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  deleteDeviceExperiment: function(req, res) {
    DeviceExperiment.delete({ experiment_id: req.params.experiment_id,
        device_id: req.params.device_id })
      .then(function(result) {
        return res.status(200).json({
          message: 'deleted device experiment with experiment id: ' + result.experiment_id + 
          ' and device id: ' + result.device_id
        });
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  getOneDeviceExperiment: function(req, res) {
    DeviceExperiment.findOne({
        device_id: req.params.device_id,
        experiment_id: req.params.experiment_id
    })
      .then(function(result) {
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  getOneDeviceExperiment: function(req, res) {
    DeviceExperiment.findOne({
        device_id: req.params.device_id,
        experiment_id: req.params.experiment_id
    })
      .then(function(result) {
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  listExperimentsByDevice: function(req, res) {
    DeviceExperiment.findAllByDevice({
        device_id: req.params.device_id
    })
      .then(function(result) {
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  listDevicesByExperiment: function(req, res) {
    DeviceExperiment.findAllByExperiment({
        experiment_id: req.params.experiment_id
    })
      .then(function(result) {
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },


  listDevicesExperiments: function(req, res) {
    DeviceExperiment.findAll()
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
