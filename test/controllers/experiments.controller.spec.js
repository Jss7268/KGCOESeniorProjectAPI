const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const TestGeneric = require('../test_generic');
const ExperimentsController = require('../../controllers/experiments.controller')

const experiment = {
  create: (ignore) => { return { id: Mocks.ID } },
  updateStartTime: ({ id, output_value }) => { return { id: id, output_value: output_value } },
  delete: ({ id }) => { return { id: id } },
  findOne: ({ id }) => new Promise((resolve) => resolve({ id: id })),
  findAll: (params) => new Promise((resolve) => resolve([Mocks.RESULT])),

}
const badExperiment = {
  create: (ignore) => { throw Mocks.ERROR },
  updateStartTime: (ignore) => { throw Mocks.ERROR },
  delete: (ignore) => { throw Mocks.ERROR },
  findOne: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
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
  TestGeneric.testHydrateReq(ExperimentsController.createDeviceOutput, experiment, verifier);
  TestGeneric.testBadVerifier(ExperimentsController.createDeviceOutput, experiment, badVerifier);
  TestGeneric.testBadModel(ExperimentsController.createDeviceOutput, badExperiment, verifier);

  it('returns 201 status on success', function (done) {
    ExperimentsController.createDeviceOutput(experiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({ message: 'success! created new device_output', id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('changeOutputValue', () => {
  TestGeneric.testHydrateReq(ExperimentsController.changeOutputValue, experiment, verifier);
  TestGeneric.testBadVerifier(ExperimentsController.changeOutputValue, experiment, badVerifier);
  TestGeneric.testBadModel(ExperimentsController.changeOutputValue, badExperiment, verifier);

  it('returns 200 status on success', function (done) {
    ExperimentsController.changeOutputValue(experiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID, output_value: Mocks.OUTPUT_VALUE });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('deleteDeviceOutput', () => {
  TestGeneric.testHydrateReq(ExperimentsController.deleteDeviceOutput, experiment, verifier);
  TestGeneric.testBadVerifier(ExperimentsController.deleteDeviceOutput, experiment, badVerifier);
  TestGeneric.testBadModel(ExperimentsController.deleteDeviceOutput, badExperiment, verifier);

  it('returns 200 status on success', function (done) {
    ExperimentsController.deleteDeviceOutput(experiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: 'deleted device_output with id: ' + Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('getOneDeviceOutput', () => {
  TestGeneric.testBadModel(ExperimentsController.getOneDeviceOutput, badExperiment, verifier);

  it('returns 200 status on success', function (done) {
    ExperimentsController.getOneDeviceOutput(experiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDeviceOutputsByDeviceExperiment', () => {
  TestGeneric.testBadModel(ExperimentsController.listDeviceOutputsByDeviceExperiment, badExperiment, verifier);

  it('returns 200 status on success', function (done) {
    ExperimentsController.listDeviceOutputsByDeviceExperiment(experiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDeviceOutputsByExperiment', () => {
  TestGeneric.testBadModel(ExperimentsController.listDeviceOutputsByExperiment, badExperiment, verifier);

  it('returns 200 status on success', function (done) {
    ExperimentsController.listDeviceOutputsByExperiment(experiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDeviceOutputsByDevice', () => {
  TestGeneric.testBadModel(ExperimentsController.listDeviceOutputsByDevice, badExperiment, verifier);

  it('returns 200 status on success', function (done) {
    ExperimentsController.listDeviceOutputsByDevice(experiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listDeviceOutputs', () => {
  TestGeneric.testBadModel(ExperimentsController.listDeviceOutputs, badExperiment, verifier);

  it('returns 200 status on success', function (done) {
    ExperimentsController.listDeviceOutputs(experiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

