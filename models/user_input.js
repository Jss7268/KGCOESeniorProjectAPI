var _db, _Validator;

module.exports = (db, Validator) => {
    _db = db, _Validator = Validator;
    return {
        findAll: function () {
            return new Promise((resolve, reject) => {
                _db.query(`SELECT * FROM user_inputs
            where user_inputs.deleted_at = 0
            ORDER BY user_inputs.timestamp ASC`, [])
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
                _Validator.validateColumns(data, ['device_id'])
                    .then(() => {
                        return _Validator.validateUserId(data.device_id);
                    })
                    .then((result) => {
                        return _db.query(`SELECT * FROM user_inputs where device_id = $1 and deleted_at = 0
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
                _Validator.validateColumns(data, ['experiment_id'])
                    .then(() => {
                        return _Validator.validateExperimentId(data.experiment_id)
                    })
                    .then((result) => {
                        return _db.query(`SELECT * FROM user_inputs
                    where user_inputs.experiment_id = $1 and user_inputs.deleted_at = 0
                    ORDER BY user_inputs.timestamp ASC`, [result.id])
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
                validateUserInputData(data)
                    .then(function () {
                        return _db.query(
                            'INSERT INTO user_inputs ' +
                            '(experiment_id, device_id, user_id,' +
                            'description, timestamp, created_at, updated_at) ' +
                            'VALUES ($1, $2, $3, $4, $5, $6, $6) returning experiment_id, device_id',
                            [data.experiment_id, data.device_id, data.user_id,
                            data.description, data.timestamp, time]);
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
                _db.query('UPDATE user_inputs SET deleted_at = $2 WHERE id = $1 returning id', [data.id, time])
                    .then((result) => {
                        resolve(result.rows[0]);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },

        updateDescription: (data) => {
            var time = new Date().getTime();
            return new Promise((resolve, reject) => { 
                _db.query('UPDATE user_inputs SET description = $2, updated_at = $3 WHERE id = $1 and deleted_at = 0 returning description',
                    [data.id, data.description, time])
                    .then((result) => {
                        resolve(result.rows[0]);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        },
    }
};

function findOneById(id) {
    return new Promise((resolve, reject) => {
      _db.query('SELECT * FROM user_inputs WHERE id = $1 and deleted_at = 0', [id])
        .then((result) => {
          if (result.rows[0]) {
            resolve(result.rows[0]);
          }
          else {
            reject('no user input found')
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
}

function validateUserInputData(data) {
    return new Promise((resolve, reject) => {
        if (!data.description) {
            reject('invalid input: description missing')
        }
        else{
            columns = ['user_id','device_id', 'description', 'experiment_id']
            _Validator.validateColumns(data, columns)
            .then(function () {
                return _Validator.validateUserId(data.device_id)
            })
            .then(function () {
                return _Validator.validateUserId(data.user_id)
            })
            .then(function() {
                return _Validator.validateExperimentId(data.experiment_id)
            })
            .then((description) => {
                description = data.description;
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
        }
        
    });

}
