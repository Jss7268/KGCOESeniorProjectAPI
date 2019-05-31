var _db;

module.exports = (db) => {
    _db = db
    return {
        findAll: (table) => {
            return new Promise((resolve, reject) => {
                _db.query('SELECT * FROM ' + table + 'where deleted_at = 0', [])
                    .then((results) => {
                        resolve(results.rows);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },

        findOne: (table, data) => {
            return new Promise((resolve, reject) => {
                console.log(20);
                if (!data.id) {
                    reject('error: must provide id')
                } else {
                    findOneById(table, data.id)
                        .then((result) => {
                            resolve(result);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            });
        },

        findOneByColumn: (table, value, columnName) => {
            return new Promise((resolve, reject) => {
                _db.query('SELECT * FROM ' + table + ' WHERE ' + columnName + ' = $1 and deleted_at = 0', [value])
                    .then((result) => {
                        if (result.rows[0]) {
                            resolve(result.rows[0]);
                        }
                        else {
                            reject('no ' + table + ' found')
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },

        create: (table, columns, data) => {
            populateTime(columns, data, true);

            return new Promise((resolve, reject) => {
                _db.query(
                    'INSERT INTO ' + table + '(' + getColumnNames(columns) + ') VALUES (' + getNumberedDollars(columns) + ') returning id',
                    getColumnValues(columns, data))
                    .then((result) => {
                        resolve(result.rows[0]);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        },

        delete: (table, data) => {
            var time = new Date().getTime();
            return new Promise((resolve, reject) => {
                _db.query('UPDATE ' + table + ' SET deleted_at = $2 WHERE id = $1 returning id', [data.id, time])
                    .then((result) => {
                        resolve(result.rows[0]);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },

        update: (table, column, data) => {
            var time = new Date().getTime();
            return new Promise((resolve, reject) => {
                if (!data.id || !data[column]) {
                    reject('error: id and/or ' + column + ' missing')
                }
                else {
                    _db.query('UPDATE ' + table + ' SET $2 = $3, updated_at = $4 WHERE id = $1 and deleted_at = 0 returning $2', [data.id, column, data[column], time])
                        .then((result) => {
                            resolve(result.rows[0]);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            });
        },
    }
};

function populateTime(columns, data, setCreatedAt) {
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
    for (i = 1; i <= columns.length; i++) {
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
    return new Promise((resolve, reject) => {
        _db.query('SELECT * FROM ' + table + ' WHERE id = $1 and deleted_at = 0', [id])
            .then((result) => {
                if (result.rows[0]) {
                    resolve(result.rows[0]);
                }
                else {
                    reject('no ' + table + ' found')
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}