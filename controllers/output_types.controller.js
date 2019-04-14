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

  changeStartTime: function(req, res) {
    OutputType.updateStartTime({ id: req.params.id, start_time: req.body.start_time })
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

  getSelfOutputType: function(req, res) {
    OutputType.findOne({ id: req.decoded.sub })
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