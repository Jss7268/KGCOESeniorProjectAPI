var Promise = require('promise');
var config = require('./../config/config');
var DeviceExperiment = require('./../models/device_experiment');
var Verifier = require('../validators/verifier');

module.exports = {
  createDeviceExperiment: (req, res) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
      .then(() => {
        return DeviceExperiment.create(req.body)
      })
      .then((result) => {
        return res.status(201).json({
          message: 'success! created new device experiment',
          experiment_id: result.experiment_id,
          device_id: result.device_id
        });
      })
      .catch((err) => {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  deleteDeviceExperiment: (req, res) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
      .then(() => {
        return DeviceExperiment.delete({ experiment_id: req.params.experiment_id,
        device_id: req.params.device_id })
      })
      .then((result) => {
        return res.status(200).json({
          message: 'deleted device experiment with experiment id: ' + result.experiment_id + 
          ' and device id: ' + result.device_id
        });
      })
      .catch((err) => {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  getOneDeviceExperiment: (req, res) => {
    DeviceExperiment.findOne({
        device_id: req.params.device_id,
        experiment_id: req.params.experiment_id
    })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  getOneDeviceExperiment: (req, res) => {
    DeviceExperiment.findOne({
        device_id: req.params.device_id,
        experiment_id: req.params.experiment_id
    })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  listExperimentsByDevice: (req, res) => {
    DeviceExperiment.findAllByDevice({
        device_id: req.params.device_id
    })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  listDevicesByExperiment: (req, res) => {
    DeviceExperiment.findAllByExperiment({
        experiment_id: req.params.experiment_id
    })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },


  listDevicesExperiments: (req, res) => {
    DeviceExperiment.findAll()
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
