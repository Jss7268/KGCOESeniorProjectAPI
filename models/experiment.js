var Promise = require('promise');
var db = require('../config/db');
var User = require('./user');
var Validator = require('../validators/validator');
var DeviceExperiment = require('./device_experiment');

module.exports = {
  findAll: function () {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM experiments where deleted_at = 0', [])
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
      if (!data.id) {
        reject('error: must provide id')
      } else {
        findOneById(data.id)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  },

  create: (data) => {
    var time = new Date().getTime();
    return new Promise((resolve, reject) => {
      validateExperimentData(data)
        .then(function () {
          return db.query(
            'INSERT INTO experiments (creator_id, notes, description, start_time, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $5) returning id',
            [data.creator_id, data.notes, data.description, data.start_time, time]);
        })
        .then((result) => {
          resolve(result.rows[0]);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },

  delete: (data) => {
    var time = new Date().getTime();
    return new Promise((resolve, reject) => {
      db.query('UPDATE experiments SET deleted_at = $2 WHERE id = $1 returning id', [data.id, time])
        .then((result) => {
          resolve(result.rows[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  updateStartTime: (data) => {
    var time = new Date().getTime();
    return new Promise((resolve, reject) => {
      if (!data.id || !data.start_time) {
        reject('error: id and/or start_time missing')
      }
      else {
        db.query('UPDATE experiments SET start_time = $2, updated_at = $3 WHERE id = $1 and deleted_at = 0 returning start_time',
        [data.id, data.start_time, time])
          .then((result) => {
            resolve(result.rows[0]);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }
};

function findOneById(id) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM experiments WHERE id = $1 and deleted_at = 0', [id])
      .then((result) => {
        if (result.rows[0]) {
          resolve(result.rows[0]);
        }
        else {
          reject('no experiment found')
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}
function validateExperimentData(data) {
  return new Promise((resolve, reject) => {
    if (!data.creator_id || !data.description) {
      reject('creator_id or description missing')
    }
    if (!data.start_time) {
      data.start_time = null;
    }
    else {
      validateCreatorId(data.creator_id)
        .then(function () {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
}

function validateCreatorId(creatorId) {
  return new Promise((resolve, reject) => {
    User.findOne({ id: creatorId })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}