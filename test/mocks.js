const sinon = require('sinon');

const OUTPUT_VALUE = 100;
const DEVICE_ID = 20;
const ID = 1234;

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
            decoded: { accessLevel: null },
            params: {id: ID}
        };
    },
    DEVICE_ID: DEVICE_ID,
    OUTPUT_VALUE: OUTPUT_VALUE,
    ID: ID,

}