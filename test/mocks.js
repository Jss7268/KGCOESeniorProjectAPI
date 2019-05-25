const sinon = require('sinon');

const OUTPUT_VALUE = 100;
const DEVICE_ID = 20;
const ID = 1234;
const USER_ID = 111;
const ERROR_MESSAGE = 'error';
const ERROR_STATUS = 418;

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

            },
            decoded: {
                accessLevel: 2,
                uid: USER_ID,
            },
            params: {id: ID}
        };
    },
    ERROR: {
        message: ERROR_MESSAGE,
        status: ERROR_STATUS
    },
    ERROR_MESSAGE: ERROR_MESSAGE,
    ERROR_STATUS: ERROR_STATUS,
    DEVICE_ID: DEVICE_ID,
    OUTPUT_VALUE: OUTPUT_VALUE,
    ID: ID,
    USER_ID: USER_ID,

}