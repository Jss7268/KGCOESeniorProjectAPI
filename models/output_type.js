var Promise = require('promise');
var db = require('../config/db');
var Validator = require('../validators/validator');

module.exports = {
    findAll: function () {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM output_types where deleted_at = 0', [])
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
            if (!data.id && !data.output_type_name) {
                reject('error: must provide id or output_type_name')
            } else {
                if (data.id) {
                    findOneById(data.id)
                        .then(function (result) {
                            resolve(result);
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                } else {
                    findOneByName(data.output_type_name)
                        .then(function (result) {
                            resolve(result);
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                }
            }
        });
    },

    create: function (data) {
        var time = new Date().getTime();
        return new Promise(function (resolve, reject) {
            validateOutputTypeData(data)
                .then(function () {
                    return db.query(
                        'INSERT INTO output_types ' +
                        '(output_type_name, units, created_at, updated_at) ' +
                        'VALUES ($1, $2, $3, $3) returning id',
                        [data.output_type_name, data.units, time]);
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
            if (data.id) {
                db.query('UPDATE output_types SET deleted_at = $2 WHERE id = $1 returning id', [data.id, time])
                    .then(function (result) {
                        resolve(result.rows[0]);
                    })
                    .catch(function (err) {
                        reject(err);
                    });
            } else {
                db.query('UPDATE output_types SET deleted_at = $2 WHERE output_type_name = $1 and deleted_at = 0 returning id', [data.output_type_name, time])
                    .then(function (result) {
                        resolve(result.rows[0]);
                    })
                    .catch(function (err) {
                        reject(err);
                    });
            }
        });
    },

    updateUnits: function (data) {
        var time = new Date().getTime();
        return new Promise(function (resolve, reject) {
            if ((!data.id && !data.output_type_name) || !data.units) {
                reject('error: id or output_type_name and/or units missing')
            }
            else {
                if (data.id) {
                    db.query('UPDATE output_types SET units = $2, updated_at = $3 WHERE id = $1 and deleted_at = 0 returning units', [data.id, data.units, time])
                        .then(function (result) {
                            resolve(result.rows[0]);
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                } else {
                    db.query('UPDATE output_types SET units = $2, updated_at = $3 WHERE output_type_name = $1 and deleted_at = 0 returning units', [data.output_type_name, data.units, time])
                        .then(function (result) {
                            resolve(result.rows[0]);
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                }

            }
        });
    }
};

function findOneById(id) {
    return new Promise(function (resolve, reject) {
        db.query('SELECT * FROM output_types WHERE id = $1 and deleted_at = 0', [id])
            .then(function (result) {
                if (result.rows[0]) {
                    resolve(result.rows[0]);
                }
                else {
                    reject('no output_type found')
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
}


function findOneByName(output_type_name) {
    return new Promise(function (resolve, reject) {
        db.query('SELECT * FROM output_types WHERE output_type_name = $1 and deleted_at = 0', [output_type_name])
            .then(function (result) {
                if (result.rows[0]) {
                    resolve(result.rows[0]);
                }
                else {
                    reject('no output_type found')
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
}
function validateOutputTypeData(data) {
    return Validator.validateColumns(data, ['output_type_name']);
}