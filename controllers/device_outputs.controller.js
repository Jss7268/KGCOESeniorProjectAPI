var Promise = require('promise');
var config = require('./../config/config');
var DeviceOutput = require('./../models/device_output');

module.exports = {
  createDeviceOutput: function(req, res) {
    DeviceOutput.create(req.body)
      .then(function(result) {
        return res.status(200).json({
          message: 'success! created account for new device_output',
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
    DeviceOutput.updateStartTime({ id: req.params.id, start_time: req.body.start_time })
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

  getSelfDeviceOutput: function(req, res) {
    DeviceOutput.findOne({ id: req.decoded.sub })
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