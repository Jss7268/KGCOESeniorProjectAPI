var Promise = require('promise');
var config = require('../config/config');
var db = require('../config/db');
var bcrypt = require('bcrypt');
var User = require('../models/user');
var Experiment = require('../models/experiment');
var OutputType = require('../models/output_type');

module.exports = {
    findAll: function () {
        return new Promise(function (resolve, reject) {
            db.query('SELECT id, creator_id, notes, description, start_time FROM device_outputs', [])
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
                        'INSERT INTO device_outputs (creator_id, start_time, created_at, updated_at) VALUES ($1, $2, $3, $4) returning id',
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
            db.query('DELETE FROM device_outputs WHERE id = $1 returning id', [data.id])
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
        if (!data.device_id || !data.output_type_id || !data.experiment_id) {
            reject('experiment_id, device_id, and/or output_type_id missing')
        }
        else {
            validateDeviceId(data.device_id)
                .then(function () {
                    return validateExperimentId(data.experiment_id);
                })
                .then(function () {
                    return validateOutputTypeId(data.output_type_id);
                })
                .then(function () {
                    resolve();
                })
                .catch(function (err) {
                    reject(err);
                });
        }
    });
}

function validateDeviceId(id) {
    return new Promise(function (resolve, reject) {
        User.findOne({ id: id })
            .then(function (result) {
                resolve(result);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

function validateExperimentId(id) {
    return new Promise(function (resolve, reject) {
        Experiment.findOne({ id: id })
            .then(function (result) {
                resolve(result);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

function validateOutputTypeId(id) {
    return new Promise(function (resolve, reject) {
        OutputType.findOne({ id: id })
            .then(function (result) {
                resolve(result);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}