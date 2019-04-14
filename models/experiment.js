var Promise = require('promise');
var db = require('../config/db');
var User = require('../models/user');


module.exports = {
  findAll: function () {
    return new Promise(function (resolve, reject) {
      db.query('SELECT * FROM experiments where deleted_at = 0', [])
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
        reject('error: must provide id')
      } else {
        findOneById(data.id)
          .then(function (result) {
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
            'INSERT INTO experiments (creator_id, notes, description, start_time, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $5) returning id',
            [data.creator_id, data.notes, data.description, data.start_time, time]);
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
    var time = new Date().getTime();
    return new Promise(function (resolve, reject) {
      db.query('UPDATE experiments SET deleted_at = $2 WHERE id = $1 returning id', [data.id, time])
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
        db.query('UPDATE experiments SET start_time = $2, updated_at = $3 WHERE id = $1 and deleted_at = 0 returning start_time', [data.id, data.name, time])
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
    db.query('SELECT * FROM experiments WHERE id = $1 and deleted_at = 0', [id])
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
        .catch(function (err) {
          reject(err);
        });
    }
  });
}

function validateCreatorId(creatorId) {
  return new Promise(function (resolve, reject) {
    User.findOne({ id: creatorId })
      .then(function (result) {
        resolve(result);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}