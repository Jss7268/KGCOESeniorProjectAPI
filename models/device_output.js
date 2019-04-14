var Promise = require('promise');
var db = require('../config/db');
var Validator = require('../validators/validator');

module.exports = {
    findAll: function () {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM device_outputs', [])
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
            validateDeviceOutputData(data)
                .then(function () {
                    return db.query(
                        'INSERT INTO device_outputs ' +
                        '(experiment_id, device_id, output_type_id, ' +
                        'output_value, timestamp, created_at, updated_at) ' +
                        'VALUES ($1, $2, $3, $3) returning id',
                        [data.experiment_id, data.device_id, data.output_type_id,
                        data.output_value, data.timestamp, time]);
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
            db.query('UPDATE device_outputs SET deleted_at = $2 WHERE id = $1 returning id', [data.id, time])
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
                db.query('UPDATE device_outputs SET start_time = $2, updated_at = $3 WHERE id = $1 returning start_time', [data.id, data.name, time])
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
        db.query('SELECT * FROM device_outputs WHERE id = $1', [id])
            .then(function (result) {
                if (result.rows[0]) {
                    resolve(result.rows[0]);
                }
                else {
                    reject('no device_output found')
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
}
function validateDeviceOutputData(data) {
    return new Promise(function (resolve, reject) {
        Validator.validateColumns(data, ['device_id', 'output_type_id', 'experiment_id', 'output_value', 'timestamp'])
            .then(function () {
                return Validator.validateDeviceId(data.device_id)
            })
            .then(function () {
                return Validator.validateExperimentId(data.experiment_id);
            })
            .then(function () {
                return Validator.validateOutputTypeId(data.output_type_id);
            })
            .then(function () {
                resolve();
            })
            .catch(function (err) {
                reject(err);
            })
    });
}
