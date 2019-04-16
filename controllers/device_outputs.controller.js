var Promise = require('promise');
var config = require('./../config/config');
var DeviceOutput = require('./../models/device_output');
var Verifier = require('../validators/verifier');

module.exports = {
  createDeviceOutput: (req, res) => {
    hydrateReq(req);
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
      .then(() => {
        return DeviceOutput.create(req.body)
      })
      .then((result) => {
        return res.status(200).json({
          message: 'success! created new device_output',
          id: result.id
        });
      })
      .catch((err) => {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  changeOutputValue: (req, res) => {
    hydrateReq(req);
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
      .then(() => {
        return DeviceOutput.updateOutputValue({ id: req.params.id, output_value: req.body.output_value })
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

  deleteDeviceOutput: (req, res) => {
    hydrateReq(req);
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
      .then(() => {
        return DeviceOutput.delete({ id: req.params.id })
      })
      .then((result) => {
        return res.status(200).json({
          message: 'deleted device_output with id: ' + result.id
        });
      })
      .catch((err) => {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  getOneDeviceOutput: (req, res) => {
    DeviceOutput.findOne({ id: req.params.id })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  listDeviceOutputsByDeviceExperiment: (req, res) => {
    DeviceOutput.findAllByDeviceExperiment(req.params)
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  listDeviceOutputsByExperiment: (req, res) => {
    DeviceOutput.findAllByExperiment(req.params)
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  listDeviceOutputsByDevice: (req, res) => {
    DeviceOutput.findAllByDevice(req.params)
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  listDeviceOutputs: (req, res) => {
    DeviceOutput.findAll()
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
  // TODO don't hardcode 1 for authorized_device
  if (req.accessLevel == 1) {
    // devices can only manipulate data for themselves
    req.body.device_id = req.decoded.uid
  }
}