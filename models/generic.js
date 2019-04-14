var Promise = require('promise');
var db = require('../config/db');

module.exports = {
    findAll: function (table) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ' + table + 'where deleted_at = 0', [])
                .then(function (results) {
                    resolve(results.rows);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },

    findOne: function (table, data) {
        return new Promise(function (resolve, reject) {
            if (!data.id) {
                reject('error: must provide id')
            } else {
                findOneById(table, data.id)
                    .then(function (result) {
                        resolve(result);
                    })
                    .catch(function (err) {
                        reject(err);
                    });
            }
        });
    },

    findOneByColumn: function (table, value, columnName) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ' + table + ' WHERE ' + columnName + ' = $1 and deleted_at = 0', [value])
                .then(function (result) {
                    if (result.rows[0]) {
                        resolve(result.rows[0]);
                    }
                    else {
                        reject('no ' + table + ' found')
                    }
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },

    create: function (table, columns, data) {
        populateTime(columns, data, true);

        return new Promise(function (resolve, reject) {
            db.query(
                'INSERT INTO ' + table + '(' + getColumnNames(columns) + ') VALUES (' + getNumberedDollars(columns) + ') returning id',
                getColumnValues(columns, data))
                .then(function (result) {
                    resolve(result.rows[0]);
                })
                .catch(function (err) {
                    console.log(err);
                    reject(err);
                });
        });
    },

    delete: function (table, data) {
        var time = new Date().getTime();
        return new Promise(function (resolve, reject) {
            db.query('UPDATE ' + table + ' SET deleted_at = $2 WHERE id = $1 returning id', [data.id, time])
                .then(function (result) {
                    resolve(result.rows[0]);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },

    update: function (table, column, data) {
        var time = new Date().getTime();
        return new Promise(function (resolve, reject) {
            if (!data.id || !data[column]) {
                reject('error: id and/or ' + column + ' missing')
            }
            else {
                db.query('UPDATE ' + table + ' SET $2 = $3, updated_at = $4 WHERE id = $1 and deleted_at = 0 returning $2', [data.id, column, data[column], time])
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

function populateTime(data, columns, setCreatedAt) {
    data.updated_at = new Date().getTime();
    if (columns.indexOf('updated_at') < 0) {
        columns.push('updated_at');
    }
    if (setCreatedAt && !data.created_at) {
        data.created_at = data.updated_at;
        if (columns.indexOf('created_at') < 0) {
            columns.push('created_at');
        }
    }
}

function getColumnValues(columns, data) {
    array = [];
    columns.forEach(column => {
        array.push(data[column]);
    })
    return array;
}

function getNumberedDollars(columns) {
    var string = '';
    for (i = 0; i < columns.length; i++) {
        string += '$' + i + ', ';
    }
    return string.substring(0, string.length - 2); // remove trailing comma
}

function getColumnNames(columns) {
    var string = '';
    columns.forEach(column => {
        string += column + ', ';
    });
    return string.substring(0, string.length - 2); // remove trailing comma
}

function findOneById(table, id) {
    return new Promise(function (resolve, reject) {
        db.query('SELECT * FROM ' + table + ' WHERE id = $1 and deleted_at = 0', [id])
            .then(function (result) {
                if (result.rows[0]) {
                    resolve(result.rows[0]);
                }
                else {
                    reject('no ' + table + ' found')
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
}