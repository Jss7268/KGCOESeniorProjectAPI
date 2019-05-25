const sinon = require('sinon');

const OUTPUT_VALUE = 100;
const DEVICE_ID = 'device';
const EXPERIMENT_ID = 'experiment'
const ID = 'id';
const USER_ID = 'user';
const ERROR_MESSAGE = 'error';
const ERROR_STATUS = 418;
const ERROR = {
    message: ERROR_MESSAGE,
    status: ERROR_STATUS
};
const OUTPUT_TYPE_NAME = 'output_type_name';
const UNITS = 'units';
const START_TIME = 12345;
const CREATOR_ID = 'creator';
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

    verifier: {
        verifyMinAccessName: (accessLevel, requiredName) => new Promise((resolve) => {
            if (accessLevel >= ACCESS_LEVELS[requiredName]) {
                resolve();
            } else {
                reject();
            }
        })
    },
    badVerifier: {
        verifyMinAccessName: (ignore1, ignore2) => new Promise((ignore, reject) => reject(ERROR))
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

}
