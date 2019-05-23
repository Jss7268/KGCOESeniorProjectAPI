const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
DeviceOutputsController = require('../../controllers/device_outputs.controller')
describe('createDeviceOutput', () => {
  it('should complete this test', async (done) => {
    const resolvingPromise = new Promise( (resolve) => {
      resolve('promise resolved');
    });
    const result = await resolvingPromise;
    expect(result).to.equal('promise resolved'); 

  });
  it('returns 400 status on error', (done) => {
    const req = Mocks.mockRequest({ decoded:{accessLevel: 2}, body: {} });
    const res = Mocks.mockResponse();

    const DeviceOutput = {
      create: (_) => { id: 1 }
    }
    const Verifier = {
      verifyMinAccessName: (a, b) => new Promise((_, reject) => reject({}))
    };
    DeviceOutputsController.createDeviceOutput(DeviceOutput, Verifier)(req, res)
    .then(() => {
      console.log(res)
      expect(res.status).to.have.been.calledWith(400);
      done();
    })
  });
});
describe('changeOutputValue', () => {

});
describe('deleteDeviceOutput', () => {

});
describe('getOneDeviceOutput', () => {

});

describe('listDeviceOutputsByDeviceExperiment', () => {

});

describe('listDeviceOutputsByExperiment', () => {

});

describe('listDeviceOutputsByDevice', () => {

});

describe('listDeviceOutputs', () => {

});