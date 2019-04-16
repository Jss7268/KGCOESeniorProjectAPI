var Generic = require('./../models/generic');

module.exports = {
    validateColumns(data, columns) {
        return new Promise((resolve, reject) => {
            var msg = 'missing: ';
            var shouldReject = false;
            columns.forEach(column => {
                if (!(column in data)) {
                    shouldReject = true;
                    msg += column + ', ';
                }
            });
            if (shouldReject) {
                reject(msg.substring(0, msg.length - 2)); // remove trailing comma
            } else {
                resolve();
            }
        });
    },
    validateDeviceId(id) {
        return new Promise((resolve, reject) => {
            Generic.findOne('users', { id: id })
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    validateExperimentId(id) {
        return new Promise((resolve, reject) => {
            Generic.findOne('experiments', { id: id })
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    validateOutputTypeId(id) {
        return new Promise((resolve, reject) => {
            Generic.findOne('output_types', { id: id })
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    validateOutputTypeName(name) {
        return new Promise((resolve, reject) => {
            Generic.findOneByColumn('output_types', name, 'name')
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    validateDeviceOuputId(id) {
        return new Promise((resolve, reject) => {
            Generic.findOne('device_outputs', { id: id })
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    validateGeneric(table, value, columnName) {
        return new Promise((resolve, reject) => {
            Generic.findOneByColumn(table, value, columnName)
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}