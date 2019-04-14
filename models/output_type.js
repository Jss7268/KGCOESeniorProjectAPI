var Promise = require('promise');
var db = require('../config/db');

module.exports = {
    findAll: function () {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM output_types', [])
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
            validateOutputTypeData(data)
                .then(function () {
                    return db.query(
                        'INSERT INTO output_types ' +
                        '(name, units, created_at, updated_at) ' +
                        'VALUES ($1, $2, $3, $3) returning id',
                        [data.name, data.units, time]);
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
            db.query('DELETE FROM output_types WHERE id = $1 returning id', [data.id])
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
                db.query('UPDATE output_types SET start_time = $2, updated_at = $3 WHERE id = $1 returning start_time', [data.id, data.name, time])
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
        db.query('SELECT * FROM output_types WHERE id = $1', [id])
            .then(function (result) {
                if (result.rows[0]) {
                    resolve(result.rows[0]);
                }
                else {
                    reject('no output_type found')
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
}
function validateOutputTypeData(data) {
    return new Promise(function (resolve, reject) {
        resolve(); // don't do any validation for now
    });
}