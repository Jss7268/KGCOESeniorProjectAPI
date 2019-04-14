var Promise = require('promise');
var db = require('../config/db');

module.exports = {
    findAll: function () {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM output_types', [])
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
            if (!data.id && !data.name) {
                reject('error: must provide id or name')
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
                    findOneByName(data.name)
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
                        '(name, units, created_at, updated_at) ' +
                        'VALUES ($1, $2, $3, $3) returning id',
                        [data.name, data.units, time]);
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
                db.query('UPDATE output_types SET deleted_at = $2 WHERE name = $1 and deleted_at = 0 returning id', [data.name, time])
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
            if ((!data.id && !data.name) || !data.units) {
                reject('error: id or name and/or units missing')
            }
            else {
                if (data.id) {
                    db.query('UPDATE output_types SET units = $2, updated_at = $3 WHERE id = $1 returning units', [data.id, data.units, time])
                        .then(function (result) {
                            resolve(result.rows[0]);
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                } else {
                    db.query('UPDATE output_types SET units = $2, updated_at = $3 WHERE name = $1 and delted_at = 0 returning units', [data.name, data.units, time])
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
        db.query('SELECT * FROM output_types WHERE id = $1', [id])
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


function findOneByName(name) {
    return new Promise(function (resolve, reject) {
        db.query('SELECT * FROM output_types WHERE name = $1 and deleted_at = 0', [name])
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
    return new Promise(function (resolve, reject) {
        resolve(); // don't do any validation for now
    });
}