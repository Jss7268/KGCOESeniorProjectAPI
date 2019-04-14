var Promise = require('promise');
var config = require('./../config/config');
var OutputType = require('./../models/output_type');

module.exports = {
  createOutputType: function(req, res) {
    OutputType.create(req.body)
      .then(function(result) {
        return res.status(200).json({
          message: 'success! created account for new output_type',
          id: result.id
        });
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  changeUnits: function(req, res) {
    OutputType.updateUnits({ id: req.params.id, units: req.body.units })
      .then(function(result) {
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  changeUnitsName: function(req, res) {
    OutputType.updateUnits({ name: req.params.name, units: req.body.units })
      .then(function(result) {
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  deleteOutputType: function(req, res) {
    OutputType.delete({ id: req.params.id })
      .then(function(result) {
        return res.status(200).json({
          message: 'deleted output_type with id: ' + result.id
        });
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  deleteOutputTypeName: function(req, res) {
    OutputType.delete({ name: req.params.name })
      .then(function(result) {
        return res.status(200).json({
          message: 'deleted output_type with id: ' + result.id
        });
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
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