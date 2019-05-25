const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const TestGeneric = require('../test_generic');
const DevicesExperimentsController = require('../../controllers/devices_experiments.controller')

const deviceExperiment = {
  create: (ignore) => { return { experiment_id: Mocks.EXPERIMENT_ID, device_id: Mocks.DEVICE_ID } },
  delete: ({ experiment_id, device_id }) => new Promise((resolve) => resolve({ experiment_id: experiment_id, device_id: device_id })),
  findOne: ({ experiment_id, device_id }) => new Promise((resolve) => resolve({ experiment_id: experiment_id, device_id: device_id })),
  findAllByExperiment: (params) => new Promise((resolve) => resolve([Mocks.RESULT])),
  findAllByDevice: (params) => new Promise((resolve) => resolve([Mocks.RESULT])),
  findAll: (params) => new Promise((resolve) => resolve([Mocks.RESULT])),

}
const badDeviceExperiment = {
  create: (ignore) => { throw Mocks.ERROR },
  delete: (ignore) => { throw Mocks.ERROR },
  findOne: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
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

describe('createDeviceExperiment', function () {
  TestGeneric.testBadVerifier(DevicesExperimentsController.createDeviceExperiment, deviceExperiment, badVerifier);
  TestGeneric.testBadModel(DevicesExperimentsController.createDeviceExperiment, badDeviceExperiment, verifier);

  it('returns 201 status on success', function (done) {
    DevicesExperimentsController.createDeviceExperiment(deviceExperiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({
          message: 'success! created new device experiment',
          experiment_id: Mocks.EXPERIMENT_ID,
          device_id: Mocks.DEVICE_ID
        });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('deleteDeviceExperiment', () => {
  TestGeneric.testBadVerifier(DevicesExperimentsController.deleteDeviceExperiment, deviceExperiment, badVerifier);
  TestGeneric.testBadModel(DevicesExperimentsController.deleteDeviceExperiment, badDeviceExperiment, verifier);

  it('returns 200 status on success', function (done) {
    DevicesExperimentsController.deleteDeviceExperiment(deviceExperiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({
          message: 'deleted device experiment with experiment id: ' +
            Mocks.EXPERIMENT_ID + ' and device id: ' + Mocks.DEVICE_ID
        });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('getOneDeviceExperiment', () => {
  TestGeneric.testBadModel(DevicesExperimentsController.getOneDeviceExperiment, badDeviceExperiment, verifier);

  it('returns 200 status on success', function (done) {
    DevicesExperimentsController.getOneDeviceExperiment(deviceExperiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ experiment_id: Mocks.EXPERIMENT_ID, device_id: Mocks.DEVICE_ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDevicesByExperiment', () => {
  TestGeneric.testBadModel(DevicesExperimentsController.listDevicesByExperiment, badDeviceExperiment, verifier);

  it('returns 200 status on success', function (done) {
    DevicesExperimentsController.listDevicesByExperiment(deviceExperiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listExperimentsByDevice', () => {
  TestGeneric.testBadModel(DevicesExperimentsController.listExperimentsByDevice, badDeviceExperiment, verifier);

  it('returns 200 status on success', function (done) {
    DevicesExperimentsController.listExperimentsByDevice(deviceExperiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDevicesExperiments', () => {
  TestGeneric.testBadModel(DevicesExperimentsController.listDevicesExperiments, badDeviceExperiment, verifier);

  it('returns 200 status on success', function (done) {
    DevicesExperimentsController.listDevicesExperiments(deviceExperiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

