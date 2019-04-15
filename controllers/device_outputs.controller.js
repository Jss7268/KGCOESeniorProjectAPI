var Promise = require('promise');
var config = require('./../config/config');
var DeviceOutput = require('./../models/device_output');

module.exports = {
  createDeviceOutput: function(req, res) {
    DeviceOutput.create(req.body)
      .then(function(result) {
        return res.status(200).json({
          message: 'success! created new device_output',
          id: result.id
        });
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  changeOutputValue: function(req, res) {
    DeviceOutput.updateOutputValue({ id: req.params.id, output_value: req.body.output_value })
      .then(function(result) {
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  deleteDeviceOutput: function(req, res) {
    DeviceOutput.delete({ id: req.params.id })
      .then(function(result) {
        return res.status(200).json({
          message: 'deleted device_output with id: ' + result.id
        });
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  getOneDeviceOutput: function(req, res) {
    DeviceOutput.findOne({ id: req.params.id })
      .then(function(result) {
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  listDeviceOutputsByDeviceExperiment: (req, res) => {
    DeviceOutput.findAllByDeviceExperiment(req.params)
    .then(function(result) {
      return res.status(200).json(result);
    })
    .catch(function(err) {
      return res.status(400).json({
        message: err
      });
    });
  },

  listDeviceOutputsByExperiment: (req, res) => {
    DeviceOutput.findAllByExperiment(req.params)
    .then(function(result) {
      return res.status(200).json(result);
    })
    .catch(function(err) {
      return res.status(400).json({
        message: err
      });
    });
  },

  listDeviceOutputsByDevice: (req, res) => {
    DeviceOutput.findAllByDevice(req.params)
    .then(function(result) {
      return res.status(200).json(result);
    })
    .catch(function(err) {
      return res.status(400).json({
        message: err
      });
    });
  },

  listDeviceOutputs: function(req, res) {
    DeviceOutput.findAll()
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