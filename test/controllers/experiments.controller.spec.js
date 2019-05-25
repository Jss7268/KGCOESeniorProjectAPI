const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const TestGeneric = require('../test_generic');
const ExperimentsController = require('../../controllers/experiments.controller')

const experiment = {
  create: (ignore) => { return { id: Mocks.ID } },
  updateStartTime: ({ id, start_time }) => { return { id: id, start_time: start_time } },
  delete: ({ id }) => { return { id: id } },
  findOne: ({ id }) => new Promise((resolve) => resolve({ id: id })),
  findAll: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT])),

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

describe('createExperiment', function () {
  TestGeneric.testHydrateReqCreatorId(ExperimentsController.createExperiment, experiment, verifier);
  TestGeneric.testBadVerifier(ExperimentsController.createExperiment, experiment, badVerifier);
  TestGeneric.testBadModel(ExperimentsController.createExperiment, badExperiment, verifier);

  it('returns 201 status on success', function (done) {
    ExperimentsController.createExperiment(experiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({ message: 'success! created new experiment', id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('changeStartTime', () => {
  TestGeneric.testBadVerifier(ExperimentsController.changeStartTime, experiment, badVerifier);
  TestGeneric.testBadModel(ExperimentsController.changeStartTime, badExperiment, verifier);

  it('returns 200 status on success', function (done) {
    ExperimentsController.changeStartTime(experiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID, start_time: Mocks.START_TIME });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('deleteExperiment', () => {
  TestGeneric.testBadVerifier(ExperimentsController.deleteExperiment, experiment, badVerifier);
  TestGeneric.testBadModel(ExperimentsController.deleteExperiment, badExperiment, verifier);

  it('returns 200 status on success', function (done) {
    ExperimentsController.deleteExperiment(experiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: 'deleted experiment with id: ' + Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('getOneExperiment', () => {
  TestGeneric.testBadModel(ExperimentsController.getOneExperiment, badExperiment, verifier);

  it('returns 200 status on success', function (done) {
    ExperimentsController.getOneExperiment(experiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listExperiments', () => {
  TestGeneric.testBadModel(ExperimentsController.listExperiments, badExperiment, verifier);

  it('returns 200 status on success', function (done) {
    ExperimentsController.listExperiments(experiment, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

