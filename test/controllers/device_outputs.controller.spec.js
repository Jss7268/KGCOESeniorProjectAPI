const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const TestGeneric = require('../test_generic');
const DeviceOutputsController = require('../../controllers/device_outputs.controller')

const deviceOutput = {
  create: (ignore) => new Promise((resolve) => resolve({ id: Mocks.ID })),
  updateOutputValue: ({ id, output_value }) => new Promise((resolve) => resolve({ id: id, output_value: output_value })),
  delete: ({ id }) => new Promise((resolve) => resolve({ id: id })),
  findOne: ({ id }) => new Promise((resolve) => resolve({ id: id })),
  findAllByDeviceExperiment: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT])),
  findAllByExperiment: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT])),
  findAllByDevice: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT])),
  findAll: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT])),

}
const badDeviceOutput = {
  create: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  updateOutputValue: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  delete: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  findOne: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  findAllByDeviceExperiment: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  findAllByExperiment: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  findAllByDevice: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  findAll: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),

}
const verifier = Mocks.verifier;
const badVerifier = Mocks.badVerifier;

var req;
var res;

// use function instead of lambda
// https://mochajs.org/#arrow-functions
beforeEach(function () {
  req = Mocks.mockRequest();
  res = Mocks.mockResponse();
});

describe('createDeviceOutput', function () {
  TestGeneric.testHydrateReqDeviceId(DeviceOutputsController(deviceOutput, verifier).createDeviceOutput);
  TestGeneric.testBadVerifier(DeviceOutputsController(deviceOutput, badVerifier).createDeviceOutput);
  TestGeneric.testBadModel(DeviceOutputsController(badDeviceOutput, verifier).createDeviceOutput);

  it('returns 201 status on success', function (done) {
    DeviceOutputsController(deviceOutput, verifier).createDeviceOutput(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({ message: 'success! created new device_output', id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('changeOutputValue', () => {
  TestGeneric.testHydrateReqDeviceId(DeviceOutputsController(deviceOutput, verifier).changeOutputValue);
  TestGeneric.testBadVerifier(DeviceOutputsController(deviceOutput, badVerifier).changeOutputValue);
  TestGeneric.testBadModel(DeviceOutputsController(badDeviceOutput, verifier).changeOutputValue);

  it('returns 200 status on success', function (done) {
    DeviceOutputsController(deviceOutput, verifier).changeOutputValue(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID, output_value: Mocks.OUTPUT_VALUE });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('deleteDeviceOutput', () => {
  TestGeneric.testHydrateReqDeviceId(DeviceOutputsController(deviceOutput, verifier).deleteDeviceOutput);
  TestGeneric.testBadVerifier(DeviceOutputsController(deviceOutput, badVerifier).deleteDeviceOutput);
  TestGeneric.testBadModel(DeviceOutputsController(badDeviceOutput, verifier).deleteDeviceOutput);

  it('returns 200 status on success', function (done) {
    DeviceOutputsController(deviceOutput, verifier).deleteDeviceOutput(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: 'deleted device_output with id: ' + Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('getOneDeviceOutput', () => {
  TestGeneric.testBadModel(DeviceOutputsController(badDeviceOutput, verifier).getOneDeviceOutput);

  it('returns 200 status on success', function (done) {
    DeviceOutputsController(deviceOutput, verifier).getOneDeviceOutput(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDeviceOutputsByDeviceExperiment', () => {
  TestGeneric.testBadModel(DeviceOutputsController(badDeviceOutput, verifier).listDeviceOutputsByDeviceExperiment);

  it('returns 200 status on success', function (done) {
    DeviceOutputsController(deviceOutput, verifier).listDeviceOutputsByDeviceExperiment(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDeviceOutputsByExperiment', () => {
  TestGeneric.testBadModel(DeviceOutputsController(badDeviceOutput, verifier).listDeviceOutputsByExperiment);

  it('returns 200 status on success', function (done) {
    DeviceOutputsController(deviceOutput, verifier).listDeviceOutputsByExperiment(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDeviceOutputsByDevice', () => {
  TestGeneric.testBadModel(DeviceOutputsController(badDeviceOutput, verifier).listDeviceOutputsByDevice);

  it('returns 200 status on success', function (done) {
    DeviceOutputsController(deviceOutput, verifier).listDeviceOutputsByDevice(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDeviceOutputs', () => {
  TestGeneric.testBadModel(DeviceOutputsController(badDeviceOutput, verifier).listDeviceOutputs);

  it('returns 200 status on success', function (done) {
    DeviceOutputsController(deviceOutput, verifier).listDeviceOutputs(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

