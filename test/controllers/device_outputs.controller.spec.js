const mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const errorMessage = 'error';
deviceOutputsController = require('../../controllers/device_outputs.controller')

var req;
var res;
var deviceOutput;
var badDeviceOutput;
var berifier;
var badVerifier;

// use function instead of lambda
// https://mochajs.org/#arrow-functions
before(function() {
  deviceOutput = {
    create: (_) => { return { id: 1 } }
  }
  badDeviceOutput = {
    create: (_) => { throw {message: errorMessage} }
  }
  req = mocks.mockRequest({ decoded: { accessLevel: null }, body: {} });
  berifier = {
    verifyMinAccessName: (a, b) => new Promise((resolve) => resolve({}))
  };
  badVerifier = {
    verifyMinAccessName: (a, b) => new Promise((_, reject) => reject({ message: errorMessage }))
  };
});

beforeEach(function() {
  res = mocks.mockResponse();
});

describe('createDeviceOutput', function() {
  it('returns 400 status on bad verifier', function(done) {
    deviceOutputsController.createDeviceOutput(deviceOutput, badVerifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ message: errorMessage });
        done();
      })
      .catch((err) => done(err));
  });

  it('returns 400 status on bad create', function(done) {
    deviceOutputsController.createDeviceOutput(deviceOutput, badVerifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ message: errorMessage });
        done();
      })
      .catch((err) => done(err));
  });

  it('returns 200 status on error', function(done) {
    deviceOutputsController.createDeviceOutput(deviceOutput, berifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: 'success! created new device_output', id: 1 });
        done();
      })
      .catch((err) => done(err));
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