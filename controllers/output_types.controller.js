var Promise = require('promise');
var config = require('./../config/config');
var OutputType = require('./../models/output_type');
var Verifier = require('../validators/verifier');

module.exports = {
  createOutputType: function(req, res) {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
      .then(() => {
        return OutputType.create(req.body)
      })
      .then(function(result) {
        return res.status(200).json({
          message: 'success! created new output_type',
          id: result.id
        });
      })
      .catch(function(err) {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  changeUnits: function(req, res) {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
      .then(() => {
        return OutputType.updateUnits({ id: req.params.id, units: req.body.units })
      })
      .then(function(result) {
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  changeUnitsName: function(req, res) {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
      .then(() => {
        return OutputType.updateUnits({ name: req.params.name, units: req.body.units })
      })
      .then(function(result) {
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  deleteOutputType: function(req, res) {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
      .then(() => {
        return OutputType.delete({ id: req.params.id })
      })
      .then(function(result) {
        return res.status(200).json({
          message: 'deleted output_type with id: ' + result.id
        });
      })
      .catch(function(err) {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  deleteOutputTypeName: function(req, res) {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
      .then(() => {
        return OutputType.delete({ name: req.params.name })
      })
      .then(function(result) {
        return res.status(200).json({
          message: 'deleted output_type with id: ' + result.id
        });
      })
      .catch(function(err) {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  getOneOutputType: function(req, res) {
    OutputType.findOne({ id: req.params.id })
      .then(function(result) {
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  getOneOutputTypeName: function(req, res) {
    OutputType.findOne({ name: req.params.name })
      .then(function(result) {
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  listOutputTypes: function(req, res) {
    OutputType.findAll()
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