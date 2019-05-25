const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
DeviceOutputsController = require('../../controllers/device_outputs.controller')

const ERROR_MESSAGE = 'error';
const RESULT = { result: 'result' };

var req;
var res;
var deviceOutput;
var badDeviceOutput;
var verifier;
var badVerifier;

// use function instead of lambda
// https://mochajs.org/#arrow-functions
before(function () {
  deviceOutput = {
    create: (ignore) => { return { id: Mocks.ID } },
    updateOutputValue: ({ id, output_value }) => { return { id: id, output_value: output_value } },
    delete: (ignore) => { return {id: Mocks.ID } },
  }
  badDeviceOutput = {
    create: (ignore) => { throw { message: ERROR_MESSAGE } },
    updateOutputValue: (ignore) => { throw { message: ERROR_MESSAGE } },
    delete: (ignore) => { throw { message: ERROR_MESSAGE } },


  }
  verifier = {
    verifyMinAccessName: (ignore1, ignore2) => new Promise((resolve) => resolve({}))
  };
  badVerifier = {
    verifyMinAccessName: (ignore1, ignore2) => new Promise((ignore, reject) => reject({ message: ERROR_MESSAGE }))
  };
});

beforeEach(function () {
  req = Mocks.mockRequest();
  res = Mocks.mockResponse();
});

describe('createDeviceOutput', function () {
  it('doesn\'t allow devices to set device_id', function(done) {
    req.decoded.accessLevel = 1; // authorized_device access level
    DeviceOutputsController.createDeviceOutput(deviceOutput, verifier)(req, res)
      .then(() => {
        expect(req.body.device_id).to.equal(Mocks.USER_ID);
        done();
      })
      .catch((err) => done(err));
  });

  it('doesn\'t allow devices to set device_id', function(done) {
    DeviceOutputsController.createDeviceOutput(deviceOutput, verifier)(req, res)
      .then(() => {
        expect(req.body.device_id).to.equal(Mocks.DEVICE_ID);
        done();
      })
      .catch((err) => done(err));
  });
  it('returns 400 status on bad verifier', function (done) {
    DeviceOutputsController.createDeviceOutput(deviceOutput, badVerifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ message: ERROR_MESSAGE });
        done();
      })
      .catch((err) => done(err));
  });

  it('returns 400 status on bad create', function (done) {
    DeviceOutputsController.createDeviceOutput(badDeviceOutput, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ message: ERROR_MESSAGE });
        done();
      })
      .catch((err) => done(err));
  });

  it('returns 200 status on error', function (done) {
    DeviceOutputsController.createDeviceOutput(deviceOutput, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: 'success! created new device_output', id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('changeOutputValue', () => {
  it('returns 400 status on bad verifier', function (done) {
    DeviceOutputsController.changeOutputValue(deviceOutput, badVerifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ message: ERROR_MESSAGE });
        done();
      })
      .catch((err) => done(err));
  });

  it('returns 400 status on bad create', function (done) {
    DeviceOutputsController.changeOutputValue(badDeviceOutput, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ message: ERROR_MESSAGE });
        done();
      })
      .catch((err) => done(err));
  });

  it('returns 200 status on error', function (done) {
    DeviceOutputsController.changeOutputValue(deviceOutput, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID, output_value: Mocks.OUTPUT_VALUE});
        done();
      })
      .catch((err) => done(err));
  });
});

describe('deleteDeviceOutput', () => {
  it('returns 400 status on bad verifier', function (done) {
    DeviceOutputsController.deleteDeviceOutput(deviceOutput, badVerifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ message: ERROR_MESSAGE });
        done();
      })
      .catch((err) => done(err));
  });

  it('returns 400 status on bad create', function (done) {
    DeviceOutputsController.deleteDeviceOutput(badDeviceOutput, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ message: ERROR_MESSAGE });
        done();
      })
      .catch((err) => done(err));
  });

  it('returns 200 status on error', function (done) {
    DeviceOutputsController.deleteDeviceOutput(deviceOutput, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: 'deleted device_output with id: ' + Mocks.ID});
        done();
      })
      .catch((err) => done(err));
  });
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