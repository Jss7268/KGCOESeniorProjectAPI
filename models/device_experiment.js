var Promise = require('promise');
var db = require('../config/db');
var User = require('../models/user');
var Validator = require('../validators/validator');

module.exports = {
    findAll: function () {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM devices_experiments where deleted_at = 0', [])
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
            Validator.validateColumns(data, ['device_id', 'experiment_id'])
                .then(function () {
                    return db.query('SELECT * FROM devices_experiments WHERE device_id = $1 and experiment_id = $2 and deleted_at = 0',
                        [data.device_id, data.experiment_id])
                })
                .then((result) => {
                    if (result.rows[0]) {
                        resolve(result.rows[0]);
                    }
                    else {
                        reject('no device experiment found')
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    findAllByDevice: (data) => {
        return findAllByDevice(data);
    },

    findOneByDevice: (data) => {
        return new Promise((resolve, reject) => {
            findAllByDevice(data)
                .then((rows) => {
                    resolve(rows[0]);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    findAllByExperiment: (data) => {
        return new Promise((resolve, reject) => {
            Validator.validateColumns(data, ['experiment_id'])
                .then(function () {
                    // users table has devices in it as devices are a user sub-type
                    return db.query(`SELECT users.id, users.name, users.email, users.access_level FROM users 
                    INNER JOIN devices_experiments on 
                    (users.id = devices_experiments.device_id and 
                    devices_experiments.experiment_id = $1 and
                    devices_experiments.deleted_at = 0)
                    ORDER BY users.updated_at DESC`,
                        [data.experiment_id])
                })
                .then((result) => {
                    resolve(result.rows);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    create: (data) => {
        var time = new Date().getTime();
        return new Promise((resolve, reject) => {
            validateDevicesExperimentsData(data)
                .then(function () {
                    return db.query(
                        `INSERT INTO devices_experiments 
                        (experiment_id, device_id, created_at, updated_at) 
                        VALUES ($1, $2, $3, $3) 
                        returning experiment_id, device_id`,
                        [data.experiment_id, data.device_id, time]);
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
            db.query('UPDATE devices_experiments SET deleted_at = $3 WHERE experiment_id = $1 and device_id = $2 returning experiment_id, device_id',
                [data.experiment_id, data.device_id, time])
                .then((result) => {
                    resolve(result.rows[0]);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
};

function validateDevicesExperimentsData(data) {
    return new Promise((resolve, reject) => {
        Validator.validateColumns(data, ['experiment_id', 'device_id'])
            .then(function () {
                return Validator.validateExperimentId(data.experiment_id)
            })
            .then(function () {
                return Validator.validateDeviceId(data.device_id)
            })
            .then(function () {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function findAllByDevice(data) {
    return new Promise((resolve, reject) => {
        Validator.validateColumns(data, ['device_id'])
            .then(function () {
                return db.query(`SELECT * FROM experiments 
                LEFT OUTER JOIN devices_experiments on 
                (experiments.id = devices_experiments.experiment_id and 
                devices_experiments.device_id = $1 and
                devices_experiments.deleted_at = 0)
                ORDER BY experiments.start_time, experiments.updated_at DESC`,
                    [data.device_id])
            })
            .then((result) => {
                resolve(result.rows);
            })
            .catch((err) => {
                reject(err);
            });
    });
}