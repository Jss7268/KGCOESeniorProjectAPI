var _db, _Validator;

const POSSIBLE_QUERY_PARAMS = [
    'device_id', 'experiment_id'
];
module.exports = (db, Validator) => {
    _db = db, _Validator = Validator;
    return {
        findAll: (data) => {
            let { additionalWhere, queryParamList }
                = _Validator.getWhereAndQueryParamList(data, POSSIBLE_QUERY_PARAMS);
            return new Promise((resolve, reject) => {
                _db.query('SELECT * FROM devices_experiments WHERE deleted_at = 0 ' +
                    additionalWhere, queryParamList)
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
                _Validator.validateColumns(data, ['device_id', 'experiment_id'])
                    .then(function () {
                        return _db.query('SELECT * FROM devices_experiments WHERE device_id = $1 and experiment_id = $2 and deleted_at = 0',
                            [data.device_id, data.experiment_id])
                    })
                    .then((result) => {
                        if (result.rows[0]) {
                            resolve(result.rows[0]);
                        }
                        else {
                            reject('no device_experiment found')
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },

        findAllByDevice,

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
                _Validator.validateColumns(data, ['experiment_id'])
                    .then(function () {
                        // users table has devices in it as devices are a user sub-type
                        return _db.query(`SELECT users.id, users.name, users.email, users.access_level FROM users 
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
                        return _db.query(
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
                _db.query('UPDATE devices_experiments SET deleted_at = $3 WHERE experiment_id = $1 and device_id = $2 returning experiment_id, device_id',
                    [data.experiment_id, data.device_id, time])
                    .then((result) => {
                        resolve(result.rows[0]);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
    }
};

function validateDevicesExperimentsData(data) {
    return new Promise((resolve, reject) => {
        _Validator.validateColumns(data, ['experiment_id', 'device_id'])
            .then(function () {
                return _Validator.validateExperimentId(data.experiment_id)
            })
            .then(function () {
                return _Validator.validateUserId(data.device_id)
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
        _Validator.validateColumns(data, ['device_id'])
            .then(function () {
                return _db.query(`SELECT * FROM experiments 
                INNER JOIN devices_experiments on 
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