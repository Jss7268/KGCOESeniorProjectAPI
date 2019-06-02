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
  findAllByExperiment: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT])),
  findAllByDevice: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT])),
  findAll: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT])),

}
const badDeviceExperiment = {
  create: (ignore) => { throw Mocks.ERROR },
  delete: (ignore) => { throw Mocks.ERROR },
  findOne: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  findAllByExperiment: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  findAllByDevice: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  findAll: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),

}

const verifier = Mocks.verifier();
const badVerifier = Mocks.badVerifier();
var req;
var res;

// use function instead of lambda
// https://mochajs.org/#arrow-functions
beforeEach(function () {
  req = Mocks.mockRequest();
  res = Mocks.mockResponse();
});

describe('createDeviceExperiment', function () {
  TestGeneric.testBadVerifier(DevicesExperimentsController(deviceExperiment, badVerifier).createDeviceExperiment);
  TestGeneric.testBadModel(DevicesExperimentsController(badDeviceExperiment, verifier).createDeviceExperiment);

  it('returns 201 status on success', function (done) {
    DevicesExperimentsController(deviceExperiment, verifier).createDeviceExperiment(req, res)
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
  TestGeneric.testBadVerifier(DevicesExperimentsController(deviceExperiment, badVerifier).deleteDeviceExperiment);
  TestGeneric.testBadModel(DevicesExperimentsController(badDeviceExperiment, verifier).deleteDeviceExperiment);

  it('returns 200 status on success', function (done) {
    DevicesExperimentsController(deviceExperiment, verifier).deleteDeviceExperiment(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({
          message: `deleted device experiment with experiment id: ${Mocks.EXPERIMENT_ID} and device id: ${Mocks.DEVICE_ID}`
       });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('getOneDeviceExperiment', () => {
  TestGeneric.testBadModel(DevicesExperimentsController(badDeviceExperiment, verifier).getOneDeviceExperiment);

  it('returns 200 status on success', function (done) {
    DevicesExperimentsController(deviceExperiment, verifier).getOneDeviceExperiment(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ experiment_id: Mocks.EXPERIMENT_ID, device_id: Mocks.DEVICE_ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDevicesByExperiment', () => {
  TestGeneric.testBadModel(DevicesExperimentsController(badDeviceExperiment, verifier).listDevicesByExperiment);

  it('returns 200 status on success', function (done) {
    DevicesExperimentsController(deviceExperiment, verifier).listDevicesByExperiment(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listExperimentsByDevice', () => {
  TestGeneric.testBadModel(DevicesExperimentsController(badDeviceExperiment, verifier).listExperimentsByDevice);

  it('returns 200 status on success', function (done) {
    DevicesExperimentsController(deviceExperiment, verifier).listExperimentsByDevice(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDevicesExperiments', () => {
  TestGeneric.testBadModel(DevicesExperimentsController(badDeviceExperiment, verifier).listDevicesExperiments);

  it('returns 200 status on success', function (done) {
    DevicesExperimentsController(deviceExperiment, verifier).listDevicesExperiments(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

