var _db, _Validator;

module.exports = (db, Validator) => {
    _db = db, _Validator = Validator;
    return {
        findAll: function () {
            return new Promise((resolve, reject) => {
                _db.query('SELECT * FROM output_types where deleted_at = 0', [])
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
                if (!data.id && !data.output_type_name) {
                    reject('error: must provide id or output_type_name')
                } else {
                    if (data.id) {
                        findOneById(data.id)
                            .then((result) => {
                                resolve(result);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    } else {
                        findOneByName(data.output_type_name)
                            .then((result) => {
                                resolve(result);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    }
                }
            });
        },

        create: (data) => {
            var time = new Date().getTime();
            return new Promise((resolve, reject) => {
                validateOutputTypeData(data)
                    .then(function () {
                        return _db.query(
                            'INSERT INTO output_types ' +
                            '(output_type_name, units, created_at, updated_at) ' +
                            'VALUES ($1, $2, $3, $3) returning id',
                            [data.output_type_name, data.units, time]);
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
                if (data.id) {
                    _db.query('UPDATE output_types SET deleted_at = $2 WHERE id = $1 returning id', [data.id, time])
                        .then((result) => {
                            resolve(result.rows[0]);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    _db.query('UPDATE output_types SET deleted_at = $2 WHERE output_type_name = $1 and deleted_at = 0 returning id', [data.output_type_name, time])
                        .then((result) => {
                            resolve(result.rows[0]);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            });
        },

        updateUnits: (data) => {
            var time = new Date().getTime();
            return new Promise((resolve, reject) => {
                if ((!data.id && !data.output_type_name) || !data.units) {
                    reject('error: id or output_type_name and/or units missing')
                }
                else {
                    if (data.id) {
                        _db.query('UPDATE output_types SET units = $2, updated_at = $3 WHERE id = $1 and deleted_at = 0 returning units', [data.id, data.units, time])
                            .then((result) => {
                                resolve(result.rows[0]);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    } else {
                        _db.query('UPDATE output_types SET units = $2, updated_at = $3 WHERE output_type_name = $1 and deleted_at = 0 returning units', [data.output_type_name, data.units, time])
                            .then((result) => {
                                resolve(result.rows[0]);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    }

                }
            });
        },
    }
};

function findOneById(id) {
    return new Promise((resolve, reject) => {
        _db.query('SELECT * FROM output_types WHERE id = $1 and deleted_at = 0', [id])
            .then((result) => {
                if (result.rows[0]) {
                    resolve(result.rows[0]);
                }
                else {
                    reject('no output_type found')
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}


function findOneByName(output_type_name) {
    return new Promise((resolve, reject) => {
        _db.query('SELECT * FROM output_types WHERE output_type_name = $1 and deleted_at = 0', [output_type_name])
            .then((result) => {
                if (result.rows[0]) {
                    resolve(result.rows[0]);
                }
                else {
                    reject('no output_type found')
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}
function validateOutputTypeData(data) {
    if (!data.units) {
        data.units = null;
    }
    return _Validator.validateColumns(data, ['output_type_name']);
}