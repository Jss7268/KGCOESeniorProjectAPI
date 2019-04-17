var router = require('express').Router();
var jwt = require('jsonwebtoken');
var User = require('./../models/user');
var config = require('./../config/config');
var Promise = require('promise');
var usersController = require('./../controllers/users.controller');

// Registration of new users via API
router.post('/auth/register', usersController.createUser);

// Authentication to obtain a token
router.post('/auth/authenticate', (req, res) => {
  User.authenticate(req.body)
    .then((result) => {
      if (result.isAuthorized === true) {
        console.log(result);
        jwt.sign({ uid: result.id, accessLevel: result.accessLevel }, config.SECRET, { expiresIn: config.JWT_EXPIRATION, issuer: 'edcs' }, (err, token) => {
          return res.status(200).json({
            message: 'authenticated, token attached',
            token: token
          });
        });
      }
      else {
        return res.status(401).json({
          message: 'bad credentials'
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        message: err
      });
    });
});

// Any route past this point requires a valid auth token
router.use((req, res, next) => {
  try{
    var token = (req.body.token || req.query.token || req.headers['authorization'])
    .replace('Bearer ', '');
  } catch {
    return res.status(401).json({
      message: 'failed authentication'
    })
  }
  // var token = (req.body.token || req.query.token || req.headers['authorization'])
  //   .replace('Bearer ', '');
  if (token) {
    jwt.verify(token, config.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: 'failed authentication: invalid token'
        });
      }
      User.findOne({ 'id': decoded.uid })
        .then((user) => {
          req.decoded = decoded;
          next();
        })
        .catch((err) => {
          return res.status(401).json({
            message: 'failed authentication: ' + err
          });
        });
    });
  }
  else {
    return res.status(401).json({
      message: 'failed authentication: no token provided.'
    });
  }
});

module.exports = router;