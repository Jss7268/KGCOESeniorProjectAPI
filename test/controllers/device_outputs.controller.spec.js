const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const TestGeneric = require('../test_generic');
const DeviceOutputsController = require('../../controllers/device_outputs.controller')

const deviceOutput = {
  create: (ignore) => { return { id: Mocks.ID } },
  updateOutputValue: ({ id, output_value }) => { return { id: id, output_value: output_value } },
  delete: ({ id }) => { return { id: id } },
  findOne: ({ id }) => new Promise((resolve) => resolve({ id: id })),
  findAllByDeviceExperiment: (params) => new Promise((resolve) => resolve([Mocks.RESULT])),
  findAllByExperiment: (params) => new Promise((resolve) => resolve([Mocks.RESULT])),
  findAllByDevice: (params) => new Promise((resolve) => resolve([Mocks.RESULT])),
  findAll: (params) => new Promise((resolve) => resolve([Mocks.RESULT])),

}
const badDeviceOutput = {
  create: (ignore) => { throw Mocks.ERROR },
  updateOutputValue: (ignore) => { throw Mocks.ERROR },
  delete: (ignore) => { throw Mocks.ERROR },
  findOne: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  findAllByDeviceExperiment: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  findAllByExperiment: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  findAllByDevice: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  findAll: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),

}
const verifier = {
  verifyMinAccessName: (ignore1, ignore2) => new Promise((resolve) => resolve({}))
};
const badVerifier = {
  verifyMinAccessName: (ignore1, ignore2) => new Promise((ignore, reject) => reject(Mocks.ERROR))
};

var req;
var res;

// use function instead of lambda
// https://mochajs.org/#arrow-functions
beforeEach(function () {
  req = Mocks.mockRequest();
  res = Mocks.mockResponse();
});

describe('createDeviceOutput', function () {
  TestGeneric.testHydrateReq(DeviceOutputsController.createDeviceOutput, deviceOutput, verifier);
  TestGeneric.testBadVerifier(DeviceOutputsController.createDeviceOutput, deviceOutput, badVerifier);
  TestGeneric.testBadModel(DeviceOutputsController.createDeviceOutput, badDeviceOutput, verifier);

  it('returns 201 status on success', function (done) {
    DeviceOutputsController.createDeviceOutput(deviceOutput, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({ message: 'success! created new device_output', id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('changeOutputValue', () => {
  TestGeneric.testHydrateReq(DeviceOutputsController.changeOutputValue, deviceOutput, verifier);
  TestGeneric.testBadVerifier(DeviceOutputsController.changeOutputValue, deviceOutput, badVerifier);
  TestGeneric.testBadModel(DeviceOutputsController.changeOutputValue, badDeviceOutput, verifier);

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
  TestGeneric.testHydrateReq(DeviceOutputsController.deleteDeviceOutput, deviceOutput, verifier);
  TestGeneric.testBadVerifier(DeviceOutputsController.deleteDeviceOutput, deviceOutput, badVerifier);
  TestGeneric.testBadModel(DeviceOutputsController.deleteDeviceOutput, badDeviceOutput, verifier);

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
  TestGeneric.testBadModel(DeviceOutputsController.getOneDeviceOutput, badDeviceOutput, verifier);

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
  TestGeneric.testBadModel(DeviceOutputsController.listDeviceOutputsByDeviceExperiment, badDeviceOutput, verifier);

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
  TestGeneric.testBadModel(DeviceOutputsController.listDeviceOutputsByExperiment, badDeviceOutput, verifier);

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
  TestGeneric.testBadModel(DeviceOutputsController.listDeviceOutputsByDevice, badDeviceOutput, verifier);

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
  TestGeneric.testBadModel(DeviceOutputsController.listDeviceOutputs, badDeviceOutput, verifier);

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

