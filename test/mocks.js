const sinon = require('sinon');
const Validator = require('../validators/validator')(null);

const OUTPUT_VALUE = 100;
const DEVICE_ID = 'device';
const EXPERIMENT_ID = 'experiment'
const OUTPUT_TYPE_ID = 'output_type';
const ID = 'id';
const USER_ID = 'user';
const ERROR_MESSAGE = 'error';
const ERROR_STATUS = 418;
const FORBIDDEN = 403;
const CONFLICT = 409;
const ILLEGAL = 451;
const ERROR = {
    message: ERROR_MESSAGE,
    status: ERROR_STATUS
};
const AUTH_ERROR = {
    message: ERROR_MESSAGE,
    status: FORBIDDEN
};
const DB_ERROR = {
    message: ERROR_MESSAGE,
    status: CONFLICT
};
const VALIDATION_ERROR = {
    message: ERROR_MESSAGE,
    status: ILLEGAL
}
const OUTPUT_TYPE_NAME = 'output_type_name';
const UNITS = 'units';
const START_TIME = 12345;
const CREATOR_ID = 'creator';
const ACCESS_LEVEL = 1;
const ACCESS_NAME = 'access_name';
const EMAIL = 'email';
const PASSWORD = 'password';
const NAME = 'name';
const RESULT = {
    result: 'result'
};
const TABLE = 'table';
const COLUMN = 'column';
const VALUE = 'value';
const TIMESTAMP = 123456;

const ACCESS_LEVELS = {
    default: 0,
    authorized_device: 1,
    elevated_user: 2,
    admin_user: 3
}

module.exports = {
    mockResponse: () => {
        const res = {};
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns(res);
        return res;
    },
    mockRequest: () => {
        return {
            body: {
                output_value: OUTPUT_VALUE,
                device_id: DEVICE_ID,
                creator_id: CREATOR_ID,
                units: UNITS,
                start_time: START_TIME,
                email: EMAIL,
                password: PASSWORD,
                access_level: ACCESS_LEVEL,
                name: NAME,

            },
            decoded: {
                accessLevel: ACCESS_LEVELS.elevated_user,
                uid: USER_ID,
            },
            params: {
                id: ID,
                device_id: DEVICE_ID,
                experiment_id: EXPERIMENT_ID,
                output_type_name: OUTPUT_TYPE_NAME,

            }
        };
    },

    mockVerifier: () => {
        return {
            verifyMinAccessName: (accessLevel, requiredName) => new Promise((resolve) => resolve())
        }
    },
    badVerifier: () => {
        return {
            verifyMinAccessName: (ignore1, ignore2) => new Promise((ignore, reject) => reject(AUTH_ERROR))
        }
    },
    verifier: () => {
        return {
            verifyMinAccessName: (accessLevel, requiredName) => new Promise((resolve, reject) => {
                if (accessLevel >= ACCESS_LEVELS[requiredName]) {
                    resolve();
                } else {
                    reject(AUTH_ERROR);
                }
            })
        }
    },
    validator: () => {
        return {
            validateColumns: sinon.stub().callsFake((data, columns) => Validator.validateColumns(data, columns)),
            validateUserId: sinon.stub().callsFake((id) => new Promise((resolve) => resolve({ id: id }))),
            validateExperimentId: sinon.stub().callsFake((id) => new Promise((resolve) => resolve({ id: id }))),
            validateOutputTypeId: sinon.stub().callsFake((id) => new Promise((resolve) => resolve({ id: id }))),
            validateOutputTypeName: sinon.stub().callsFake((outputTypeName) => new Promise((resolve) => resolve({ id: ID, output_type_name: outputTypeName }))),
            validateDeviceOutputId: sinon.stub().callsFake((id) => new Promise((resolve) => resolve({ id: id }))),
            validateGeneric: sinon.stub().callsFake((table, value, columnName) => new Promise((resolve) => {
                var data = { id: ID };
                data[columnName] = value;
                resolve(data);
            })),
        }

    },
    badValidator: () => {
        return {
            validateColumns: sinon.stub().callsFake(() => new Promise((ignore, reject) => reject(VALIDATION_ERROR))),
            validateUserId: sinon.stub().callsFake(() => new Promise((ignore, reject) => reject(VALIDATION_ERROR))),
            validateExperimentId: sinon.stub().callsFake(() => new Promise((ignore, reject) => reject(VALIDATION_ERROR))),
            validateOutputTypeId: sinon.stub().callsFake(() => new Promise((ignore, reject) => reject(VALIDATION_ERROR))),
            validateOutputTypeName: sinon.stub().callsFake(() => new Promise((ignore, reject) => reject(VALIDATION_ERROR))),
            validateDeviceOutputId: sinon.stub().callsFake(() => new Promise((ignore, reject) => reject(VALIDATION_ERROR))),
            validateGeneric: sinon.stub().callsFake(() => new Promise((ignore, reject) => reject(VALIDATION_ERROR))),
        }
    },
    db: () => {
        return {
            query: sinon.stub().callsFake((statement, paramList) => new Promise((resolve) => resolve({ rows: [{ paramList: paramList }] }))),
        }
    },
    badDb: () => {
        return {
            query: sinon.stub().callsFake(() => new Promise((ignore, reject) => reject(DB_ERROR))),
        }
    },
    ERROR,
    ERROR_MESSAGE,
    ERROR_STATUS,
    DEVICE_ID,
    EXPERIMENT_ID,
    OUTPUT_VALUE,
    ID,
    USER_ID,
    OUTPUT_TYPE_NAME,
    UNITS,
    START_TIME,
    CREATOR_ID,
    ACCESS_LEVELS,
    ACCESS_LEVEL,
    ACCESS_NAME,
    EMAIL,
    PASSWORD,
    NAME,
    AUTH_ERROR,
    FORBIDDEN,
    RESULT,
    TABLE,
    COLUMN,
    VALUE,
    DB_ERROR,
    VALIDATION_ERROR,
    CONFLICT,
    ILLEGAL,
    TIMESTAMP,
    OUTPUT_TYPE_ID,

}
