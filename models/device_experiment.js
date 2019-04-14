var Promise = require('promise');
var db = require('../config/db');
var User = require('../models/user');
var Validator = require('../validators/validator');

module.exports = {
    findAll: function () {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM devices_experiments', [])
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

    findAllByDevice: function (data) {
        return new Promise(function (resolve, reject) {
            db.query(`SELECT * FROM experiments 
                    LEFT OUTER JOIN devices_experiments on 
                    (experiments.id = devices_experiments.experiment_id and 
                    devices_experiments.device_id = $1 and
                    devices_experiments.deleted_at = 0)
                    ORDER BY experiments.start_time, experiments.updated_at DESC`,
                [data.device_id])
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },

    findOneByDevice: function (data) {
        return new Promise(function (resolve, reject) {
            findAllByDevice(data)
                .then(function (result) {
                    resolve(result.rows[0]);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },

    create: function (data) {
        var time = new Date().getTime();
        return new Promise(function (resolve, reject) {
            validateDevicesExperimentsData(data)
                .then(function () {
                    return db.query(
                        'INSERT INTO devices_experiments (experiment_id, device_id, created_at, updated_at) VALUES ($1, $2, $3, $3) returning id',
                        [data.experiment_id, data.device_id, time]);
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
            db.query('UPDATE experiments SET deleted_at = $3 WHERE experiment_id = $1 and device_id = $2 returning experiment_id, device_id',
                [data.experiment_id, data.device_id, time])
                .then(function (result) {
                    resolve(result.rows[0]);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },
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
function validateDevicesExperimentsData(data) {
    return new Promise(function (resolve, reject) {
        Validator.validateColumns(data, ['experiment_id', 'device_id'])
            .then(function () {
                return Validator.validateExperimentId(data.experiment_id)
            })
            .then(function () {
                return Validator.validateDeviceId(data.experiment_id)
            })
            .then(function () {
                resolve();
            })
            .catch(function (err) {
                reject(err);
            });
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