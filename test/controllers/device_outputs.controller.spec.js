const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
DeviceOutputsController = require('../../controllers/device_outputs.controller')

describe('createDeviceOutput', () => {
  const req = Mocks.mockRequest({ decoded:{accessLevel: 2}, body: {} });
  const DeviceOutput = {
    create: (_) => { return { id: 1 }}
  }
  const Verifier = {
    verifyMinAccessName: (a, b) => new Promise((_, reject) => reject({}))
  };
  
  it('returns 400 status on error', (done) => {
    const res = Mocks.mockResponse();
    DeviceOutputsController.createDeviceOutput(DeviceOutput, Verifier)(req, res)
    .then(() => {
      expect(res.status).to.have.been.calledWith(400);
      done();
    })
    .catch((err)=>done(err));
  });

  it('returns 200 status on error', (done) => {
    const res = Mocks.mockResponse();
    const DeviceOutput = {
      create: (_) => { return { id: 1 }}
    }
    const Verifier = {
      verifyMinAccessName: (a, b) => new Promise((resolve) => resolve({}))
    };
    DeviceOutputsController.createDeviceOutput(DeviceOutput, Verifier)(req, res)
    .then(() => {
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({message: 'success! created new device_output', id: 1});
      done();
    })
    .catch((err)=>done(err));
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