const OPERATOR_FLAG = '__';
const SUFFIX_TO_OPERATOR = {
    'gt': '>',
    'gte': '>=',
    'eq': '=',
    'neq': '<>',
    '!eq': '<>',
    'lt': '<',
    'lte': '<=',
    'null': 'IS NULL',
    'nnull': 'IS NOT NULL',
    '!null': 'IS NOT NULL',

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

        //Todo: validation for description to avoid inserting sql statements etc.
        // validateDescription(description) {
        //     return new Promise((resolve, reject) => {

        //     })
        // }
        getWhereAndQueryParamList,
    }

    function getWhereAndQueryParamList(data, possibleQueryParams) {
        if (data == null) {
            return { additionalWhere: '', queryParamList: [] };
        }
        data = Object.keys(data)
            .filter(column => {
                let operatorIndex = column.indexOf(OPERATOR_FLAG);
                return possibleQueryParams.includes(column.substring(0, operatorIndex < 0 ? column.length : operatorIndex));
            })
            .map(column => Object.assign({}, { [column]: data[column] }))
            .reduce((res, o) => Object.assign(res, o), {});

        let additionalWhere = '';
        let i = 1;

        Object.keys(data).forEach(key => {
            let operator = '=',
                operatorIndex = key.indexOf(OPERATOR_FLAG),
                column = key;
            if (operatorIndex > 0) {
                operator = SUFFIX_TO_OPERATOR[column.substring(operatorIndex + 2)] || '=';
                column = column.substring(0, operatorIndex);
            }
            if (operator.endsWith('NULL')) {
                additionalWhere += ` AND ${column} ${operator}`;
                delete data[key];
            } else {
                additionalWhere += ` AND ${column} ${operator} $${i}`;
                i++;
            }
        });
        return { additionalWhere, queryParamList: Object.values(data) };
    }
}
