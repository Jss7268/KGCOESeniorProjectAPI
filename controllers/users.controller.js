var Promise = require('promise');
var config = require('./../config/config');
var User = require('./../models/user');
var Verifier = require('./../validators/verifier');

module.exports = {
  createUser: function (req, res) {
    User.create(req.body)
      .then(function (result) {
        return res.status(200).json({
          message: 'success! created account for new user',
          id: result.id
        });
      })
      .catch(function (err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  changeName: function (req, res) {
    hydrateReq(req)
      .then(() => {
        return User.updateName({ id: req.params.id, name: req.body.name })
      })
      .then(function (result) {
        return res.status(200).json(result);
      })
      .catch(function (err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  changeEmail: function (req, res) {
    hydrateReq(req)
      .then(() => {
        return User.updateEmail({ id: req.params.id, email: req.body.email })
      })
      .then(function (result) {
        return res.status(200).json(result);
      })
      .catch(function (err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  changePassword: function (req, res) {
    hydrateReq(req)
      .then(() => {
        return User.updatePassword({ id: req.params.id, password: req.body.password })
      })
      .then(function (result) {
        return res.status(200).json(result);
      })
      .catch(function (err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  changeAccess: (req, res) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'admin_user')
      .then(() => {
        return User.updateAccess({id: req.params.id, access_level: req.body.access_level})
      })
      .then(function (result) {
        return res.status(200).json(result);
      })
      .catch(function (err) {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  deleteUser: function (req, res) {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'admin_user')
      .then(() => {
        return User.delete({ id: req.params.id })
      })
      .then(function (result) {
        return res.status(200).json({
          message: 'deleted user with id: ' + result.id
        });
      })
      .catch(function (err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  getOneUser: function (req, res) {
    User.findOne({ id: req.params.id })
      .then(function (result) {
        /*delete result.last_login_attempt;
        delete result.login_attempts;*/
        return res.status(200).json(result);
      })
      .catch(function (err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  getSelfUser: function (req, res) {
    User.findOne({ id: req.decoded.uid })
      .then(function (result) {
        /*delete result.last_login_attempt;
        delete result.login_attempts;*/
        return res.status(200).json(result);
      })
      .catch(function (err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  listUsers: function (req, res) {
    User.findAll()
      .then(function (result) {
        return res.status(200).json(result);
      })
      .catch(function (err) {
        return res.status(400).json({
          message: err
        });
      });
  },
};

function hydrateReq(req) {
  return new Promise((resolve, reject) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'admin_user')
      .then(() => {
        resolve();
      })
      .catch(() => {
        // only an admin can change update different users
        req.params.id = req.decoded.uid;
        resolve();
      })
  })

}