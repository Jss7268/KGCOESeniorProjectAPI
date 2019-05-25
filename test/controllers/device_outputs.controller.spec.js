const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
DeviceOutputsController = require('../../controllers/device_outputs.controller')

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
    delete: ({ id }) => { return { id: id } },
    findOne: ({ id }) => new Promise((resolve) => resolve({ id: id })),
    findAllByDeviceExperiment: (params) => new Promise((resolve) => resolve([Mocks.RESULT])),
    findAllByExperiment: (params) => new Promise((resolve) => resolve([Mocks.RESULT])),
    findAllByDevice: (params) => new Promise((resolve) => resolve([Mocks.RESULT])),
    findAll: (params) => new Promise((resolve) => resolve([Mocks.RESULT])),

  }
  badDeviceOutput = {
    create: (ignore) => { throw Mocks.ERROR },
    updateOutputValue: (ignore) => { throw Mocks.ERROR },
    delete: (ignore) => { throw Mocks.ERROR },
    findOne: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
    findAllByDeviceExperiment: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
    findAllByExperiment: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
    findAllByDevice: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
    findAll: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),

  }
  verifier = {
    verifyMinAccessName: (ignore1, ignore2) => new Promise((resolve) => resolve({}))
  };
  badVerifier = {
    verifyMinAccessName: (ignore1, ignore2) => new Promise((ignore, reject) => reject(Mocks.ERROR))
  };
});

beforeEach(function () {
  req = Mocks.mockRequest();
  res = Mocks.mockResponse();
});

describe('createDeviceOutput', function () {
  testForWrite(DeviceOutputsController.createDeviceOutput);

  it('returns 200 status on success', function (done) {
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
  testForWrite(DeviceOutputsController.changeOutputValue);

  it('returns 200 status on success', function (done) {
    DeviceOutputsController.changeOutputValue(deviceOutput, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID, output_value: Mocks.OUTPUT_VALUE });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('deleteDeviceOutput', () => {
  testForWrite(DeviceOutputsController.deleteDeviceOutput);

  it('returns 200 status on success', function (done) {
    DeviceOutputsController.deleteDeviceOutput(deviceOutput, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: 'deleted device_output with id: ' + Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('getOneDeviceOutput', () => {
  testBadModel(DeviceOutputsController.getOneDeviceOutput);
  it('returns 200 status on success', function (done) {
    DeviceOutputsController.getOneDeviceOutput(deviceOutput, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDeviceOutputsByDeviceExperiment', () => {
  testBadModel(DeviceOutputsController.listDeviceOutputsByDeviceExperiment);
  it('returns 200 status on success', function (done) {
    DeviceOutputsController.listDeviceOutputsByDeviceExperiment(deviceOutput, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDeviceOutputsByExperiment', () => {
  testBadModel(DeviceOutputsController.listDeviceOutputsByExperiment);
  it('returns 200 status on success', function (done) {
    DeviceOutputsController.listDeviceOutputsByExperiment(deviceOutput, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDeviceOutputsByDevice', () => {
  testBadModel(DeviceOutputsController.listDeviceOutputsByDevice);
  it('returns 200 status on success', function (done) {
    DeviceOutputsController.listDeviceOutputsByDevice(deviceOutput, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDeviceOutputs', () => {
  testBadModel(DeviceOutputsController.listDeviceOutputs);
  it('returns 200 status on success', function (done) {
    DeviceOutputsController.listDeviceOutputs(deviceOutput, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

function testForWrite(fn) {
  testHydrateReq(fn);
  testBadVerifier(fn);
  testBadModel(fn);
}

function testHydrateReq(fn) {
  it('doesn\'t allow devices to set device_id', function (done) {
    req.decoded.accessLevel = 1; // authorized_device access level
    fn(deviceOutput, verifier)(req, res)
      .then(() => {
        expect(req.body.device_id).to.equal(Mocks.USER_ID);
        done();
      })
      .catch((err) => done(err));
  });

  it('doesn\'t allow devices to set device_id', function (done) {
    fn(deviceOutput, verifier)(req, res)
      .then(() => {
        expect(req.body.device_id).to.equal(Mocks.DEVICE_ID);
        done();
      })
      .catch((err) => done(err));
  });
}

function testBadVerifier(fn) {
  it('returns 400 status on bad verifier', function (done) {
    fn(deviceOutput, badVerifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(Mocks.ERROR_STATUS);
        expect(res.json).to.have.been.calledWith({ message: Mocks.ERROR_MESSAGE });
        done();
      })
      .catch((err) => done(err));
  });
}

function testBadModel(fn) {
  it('returns 400 status on bad model', function (done) {
    fn(badDeviceOutput, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(Mocks.ERROR_STATUS);
        expect(res.json).to.have.been.calledWith({ message: Mocks.ERROR_MESSAGE });
        done();
      })
      .catch((err) => done(err));
  });
}