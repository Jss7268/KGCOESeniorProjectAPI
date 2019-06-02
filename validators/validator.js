const SUFFIX_TO_OPERATOR = {
    'gt': '>',
    'gte': '>=',
    'eq': '=',
    'neq': '<>',
    'lt': '<',
    'lte': '<=',
    'in': 'in'
}

module.exports = (Generic) => {
    return {
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
        validateUserId(id) {
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
        validateOutputTypeName(outputTypeName) {
            return new Promise((resolve, reject) => {
                Generic.findOneByColumn('output_types', outputTypeName, 'output_type_name')
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        validateDeviceOutputId(id) {
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
        },
        getWhereAndQueryParamList,
    }

    function getWhereAndQueryParamList(data, possibleQueryParams) {
        if (data == null) {
            return {additionalWhere: '', queryParamList: []};
        }
        data = Object.keys(data)
            .filter(k => possibleQueryParams.includes(k))
            .map(k => Object.assign({}, { [k]: data[k] }))
            .reduce((res, o) => Object.assign(res, o), {});
    
        let additionalWhere = '';
        let i = 1;
        let operator = '=';
        Object.keys(data).forEach(column => {
            additionalWhere += 'AND device_outputs.' + column + ' ' + operator + ' $' + i;
            i++;
        });
        return {additionalWhere, queryParamList: Object.values(data)};
    }
}
