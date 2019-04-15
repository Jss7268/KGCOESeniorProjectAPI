var Promise = require('promise');
var db = require('./../config/db');
var Validator = require('../validators/validator');

module.exports = {
  findAll: function () {
    return new Promise(function (resolve, reject) {
      db.query('SELECT * from user_access', [])
        .then(function (results) {
          resolve(results.rows);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  },

  findOne: function (data) {
    return new Promise(function (resolve, reject) {
      Validator.validateColumns(data, ['access_level'])
      .then(() => {
          return db.query('SELECT * from user_access where access_level = $1', [data.access_level])
      })
      .then(function (results) {
          console.log(data)
        resolve(results.rows[0]);
      })
      .catch(function (err) {
        reject(err);
      });
    });
  },

  findOneByName: function (data) {
    return new Promise(function (resolve, reject) {
      Validator.validateColumns(data, ['name'])

      .then(() => {
          return db.query('SELECT * from user_access where name = $1', [data.name])
      })
      .then(function (results) {
        resolve(results.rows[0]);
      })
      .catch(function (err) {

        reject(err);
      });
    });
  }
}