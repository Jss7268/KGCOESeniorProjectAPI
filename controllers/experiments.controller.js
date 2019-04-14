var Promise = require('promise');
var config = require('./../config/config');
var User = require('./../models/experiments');

module.exports = {
    createExperiment: function(req, res) {
      User.create(req.body)
        .then(function(result) {
          return res.status(201).json({
            message: 'success! created account for new experiment',
            id: result.id
          });
        })
        .catch(function(err) {
          return res.status(400).json({
            message: err
          });
        });
    }
}