var Promise = require('promise');
var db = require('../config/db');
var Validator = require('../validators/validator');
var DeviceExperiment = require('./device_experiment');

module.exports = {
    findAll: function () {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM device_outputs
            LEFT JOIN output_types on device_outputs.output_type_id = output_types.id
            LEFT JOIN sanitized_users on (device_outputs.device_id = sanitized_users.id)
            LEFT JOIN experiments on (device_outputs.experiment_id = experiments.id)
            where device_outputs.deleted_at = 0
            ORDER BY device_outputs.timestamp ASC`, [])
                .then((results) => {
                    resolve(results.rows);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    findAllByDevice: (data) => {
        return new Promise((resolve, reject) => {
            Validator.validateColumns(data, ['device_id'])
                .then(() => {
                    return Validator.validateDeviceId(data.device_id);
                })
                .then((result) => {
                    return db.query(`SELECT * FROM device_outputs where device_id = $1 and deleted_at = 0
                    ORDER BY timestamp ASC`, [result.id])
                })
                .then((results) => {
                    resolve(results.rows);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    findAllByExperiment: (data) => {
        return new Promise((resolve, reject) => {
            Validator.validateColumns(data, ['experiment_id'])
                .then(() => {
                    return Validator.validateExperimentId(data.experiment_id)
                })
                .then((result) => {
                    return db.query(`SELECT * FROM device_outputs
                    LEFT JOIN output_types on (device_outputs.output_type_id = output_types.id)
                    LEFT JOIN sanitized_users on (device_outputs.device_id = sanitized_users.id)
                    LEFT JOIN experiments on (device_outputs.experiment_id = experiments.id)
                    where device_outputs.experiment_id = $1 and device_outputs.deleted_at = 0
                    ORDER BY device_outputs.timestamp ASC`, [result.id])
                })
                .then((results) => {
                    resolve(results.rows);
                })
                .catch((err) => {
                    reject(err);
                });

        });
    },

    findAllByDeviceExperiment: (data) => {
        return new Promise((resolve, reject) => {
            DeviceExperiment.findOne(data)
                .then((result) => {
                    return db.query(`SELECT * FROM device_outputs
                    LEFT JOIN output_types on (device_outputs.output_type_id = output_types.id)
                    LEFT JOIN sanitized_users on (device_outputs.device_id = sanitized_users.id)
                    LEFT JOIN experiments on (device_outputs.experiment_id = experiments.id)
                    where device_outputs.device_id = $1 and device_outputs.experiment_id = $2 and device_outputs.deleted_at = 0
                    ORDER BY device_outputs.timestamp ASC`, [result.device_id, result.experiment_id])
                })
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
            validateDeviceOutputData(data)
                .then(function () {
                    return db.query(
                        'INSERT INTO device_outputs ' +
                        '(experiment_id, device_id, output_type_id, ' +
                        'output_value, timestamp, created_at, updated_at) ' +
                        'VALUES ($1, $2, $3, $4, $5, $6, $6) returning experiment_id, device_id, output_type_id',
                        [data.experiment_id, data.device_id, data.output_type_id,
                        data.output_value, data.timestamp, time]);
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
            db.query('UPDATE device_outputs SET deleted_at = $2 WHERE id = $1 returning id', [data.id, time])
                .then((result) => {
                    resolve(result.rows[0]);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    updateOutputValue: (data) => {
        var time = new Date().getTime();
        return new Promise((resolve, reject) => {
            if (!data.id || !data.output_value) {
                reject('error: id and/or output_value missing')
            }
            else {
                db.query('UPDATE device_outputs SET output_value = $2, updated_at = $3 WHERE id = $1 and deleted_at = 0 returning output_value',
                    [data.id, data.output_value, time])
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
        db.query('SELECT * FROM device_outputs WHERE id = $1 and deleted_at = 0', [id])
            .then((result) => {
                if (result.rows[0]) {
                    resolve(result.rows[0]);
                }
                else {
                    reject('no device_output found')
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}
function validateDeviceOutputData(data) {
    return new Promise((resolve, reject) => {
        columns = ['device_id', 'output_value', 'timestamp']
        if ('output_type_id' in data) {
            columns.push('output_type_id');
        } else {
            columns.push('output_type_name');
        }
        Validator.validateColumns(data, columns)
            .then(function () {
                return Validator.validateDeviceId(data.device_id)
            })
            .then(function () {
                if ('experiment_id' in data) {
                    return Validator.validateExperimentId(data.experiment_id);
                } else {
                    // find the most recent experiment this device is assigned to
                    return new Promise((resolve, reject) => {
                        DeviceExperiment.findOneByDevice({ device_id: data.device_id })
                            .then((result) => {
                                resolve(result);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    })
                }
            })
            .then((experiment) => {
                data.experiment_id = experiment.id;
                if ('output_type_id' in data) {
                    return Validator.validateOutputTypeId(data.output_type_id);
                } else {
                    return Validator.validateOutputTypeName(data.output_type_name);
                }
            })
            .then((output_type) => {
                data.output_type_id = output_type.id;
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    });

}
