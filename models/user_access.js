var Promise = require('promise');
var db = require('./../config/db');
var Validator = require('../validators/validator');

module.exports = {
  findAll: function () {
    return new Promise((resolve, reject) => {
      db.query('SELECT * from user_access', [])
        .then((results) => {
          resolve(results.rows);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  findOne: (data) => {
    return new Promise((resolve, reject) => {
      Validator.validateColumns(data, ['access_level'])
      .then(() => {
          return db.query('SELECT * from user_access where access_level = $1', [data.access_level])
      })
      .then((results) => {
        resolve(results.rows[0]);
      })
      .catch((err) => {
        reject(err);
      });
    });
  },

  findOneByName: (data) => {
    return new Promise((resolve, reject) => {
      Validator.validateColumns(data, ['access_name'])

      .then(() => {
          return db.query('SELECT * from user_access where access_name = $1', [data.access_name])
      })
      .then((results) => {
        resolve(results.rows[0]);
      })
      .catch((err) => {

        reject(err);
      });
    });
  }
}