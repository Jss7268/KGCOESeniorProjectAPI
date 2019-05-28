const sinon = require('sinon');

const OUTPUT_VALUE = 100;
const DEVICE_ID = 'device';
const EXPERIMENT_ID = 'experiment'
const ID = 'id';
const USER_ID = 'user';
const ERROR_MESSAGE = 'error';
const ERROR_STATUS = 418;
const FORBIDDEN = 403;
const ERROR = {
    message: ERROR_MESSAGE,
    status: ERROR_STATUS
};
const AUTH_ERROR = {
    message: ERROR_MESSAGE,
    status: FORBIDDEN
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

    mockVerifier: {
        verifyMinAccessName: (accessLevel, requiredName) => new Promise((resolve) => resolve())
    },
    badVerifier: {
        verifyMinAccessName: (ignore1, ignore2) => new Promise((ignore, reject) => reject(AUTH_ERROR))
    },
    verifier: {
        verifyMinAccessName: (accessLevel, requiredName) => new Promise((resolve, reject) => {
            if (accessLevel >= ACCESS_LEVELS[requiredName]) {
                resolve();
            } else {
                reject(AUTH_ERROR);
            }
        })
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

}
