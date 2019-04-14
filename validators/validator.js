var OutputType = require('../models/output_type');
var Experiment = require('./../models/experiment');
var User = require('./../models/user');
var DeviceOutput = require('./../models/device_output');
var Generic = require('../models/generic');

module.exports = {
    validateColumns(data, columns) {
        return new Promise(function (resolve, reject) {
            var msg = 'missing: ';
            var reject = false;
            columns.array.forEach(column => {
                if (!column in data) {
                    reject = true;
                    msg += column + ', ';
                }
            });
            if (reject) {
                reject(msg.substring(0, msg.length - 2)); // remove trailing comma
            } else {
                resolve();
            }
        });
    },
    validateDeviceId(id) {
        return new Promise(function (resolve, reject) {
            User.findOne({ id: id })
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },

    validateExperimentId(id) {
        return new Promise(function (resolve, reject) {
            Experiment.findOne({ id: id })
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },
    validateOutputTypeId(id) {
        return new Promise(function (resolve, reject) {
            OutputType.findOne({ id: id })
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },
    validateOutputTypeName(name) {
        return new Promise(function (resolve, reject) {
            OutputType.findOne({ name: name })
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },
    validateDeviceOuputId(id) {
        return new Promise(function (resolve, reject) {
            DeviceOutput.findOne({ id: id })
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },
    validateGeneric(table, value, columnName) {
        return new Promise(function (resolve, reject) {
            Generic.findOneByColumn(table, value, columnName)
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }
}