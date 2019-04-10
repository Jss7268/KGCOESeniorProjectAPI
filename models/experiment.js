var Promise = require('promise');
var config = require('../config/config');
var db = require('../config/db');
var bcrypt = require('bcrypt');
var User = require('../models/user');


module.exports = {
  findAll: function () {
    return new Promise(function (resolve, reject) {
      db.query('SELECT id, creator_id, notes, description, start_time FROM experiments', [])
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
      if (!data.id) {
        reject('error: must provide id or email')
      } else {
        findOneById(data.id)
          .then(function (result) {
            delete result.password;
            resolve(result);
          })
          .catch(function (err) {
            reject(err);
          });
      }
    });
  },

  create: function (data) {
    var time = new Date().getTime();
    return new Promise(function (resolve, reject) {
      validateExperimentData(data)
        .then(function () {
          return db.query(
            'INSERT INTO experiments (creator_id, start_time, created_at) VALUES ($1, $2, $3) returning id',
            [data.creator_id, data.start_time, time]);
        })
        .then(function (result) {
          resolve(result.rows[0]);
        })
        .catch(function (err) {
          console.log(err);
          reject(err);
        });
    });
  },

  delete: function (data) {
    return new Promise(function (resolve, reject) {
      db.query('DELETE FROM experiments WHERE id = $1 returning id', [data.id])
        .then(function (result) {
          resolve(result.rows[0]);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  },

  updateStartTime: function (data) {
    var time = new Date().getTime();
    return new Promise(function (resolve, reject) {
      if (!data.id || !data.start_time) {
        reject('error: id and/or start_time missing')
      }
      else {
        db.query('UPDATE experiments SET start_time = $2, updated_at = $3 WHERE id = $1 returning start_time', [data.id, data.name, time])
          .then(function (result) {
            resolve(result.rows[0]);
          })
          .catch(function (err) {
            reject(err);
          });
      }
    });
  }
};

function findOneById(id) {
  return new Promise(function (resolve, reject) {
    db.query('SELECT * FROM experiments WHERE id = $1', [id])
      .then(function (result) {
        if (result.rows[0]) {
          resolve(result.rows[0]);
        }
        else {
          reject('no experiment found')
        }
      })
      .catch(function (err) {
        reject(err);
      });
  });
}
function validateExperimentData(data) {
  return new Promise(function (resolve, reject) {
    if (!data.creator_id) {
      reject('creator_id missing')
    }
    if (!data.start_time) {
      data.start_time = null;
    }
    else {
      validateCreatorId(data.creator_id)
        .then(function () {
          resolve();
        })
        .catch(function (err) {
          reject(err);
        });
    }
  });
}

function validateCreatorId(creatorId) {
  return new Promise(function (resolve, reject) {
  User.findOne({ id: creatorId })
      .then(function(result) {
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
    });
}