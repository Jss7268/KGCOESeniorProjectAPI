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

describe('createExperiment', function () {
  TestGeneric.testHydrateReqCreatorId(ExperimentsController(experiment, verifier).createExperiment);
  TestGeneric.testBadVerifier(ExperimentsController(experiment, badVerifier).createExperiment);
  TestGeneric.testBadModel(ExperimentsController(badExperiment, verifier).createExperiment);

  it('returns 201 status on success', function (done) {
    ExperimentsController(experiment, verifier).createExperiment(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({ message: 'success! created new experiment', id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('changeStartTime', () => {
  TestGeneric.testBadVerifier(ExperimentsController(experiment, badVerifier).changeStartTime);
  TestGeneric.testBadModel(ExperimentsController(badExperiment, verifier).changeStartTime);

  it('returns 200 status on success', function (done) {
    ExperimentsController(experiment, verifier).changeStartTime(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID, start_time: Mocks.START_TIME });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('deleteExperiment', () => {
  TestGeneric.testBadVerifier(ExperimentsController(experiment, badVerifier).deleteExperiment);
  TestGeneric.testBadModel(ExperimentsController(badExperiment, verifier).deleteExperiment);

  it('returns 200 status on success', function (done) {
    ExperimentsController(experiment, verifier).deleteExperiment(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: 'deleted experiment with id: ' + Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('getOneExperiment', () => {
  TestGeneric.testBadModel(ExperimentsController(badExperiment, verifier).getOneExperiment);

  it('returns 200 status on success', function (done) {
    ExperimentsController(experiment, verifier).getOneExperiment(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listExperiments', () => {
  TestGeneric.testBadModel(ExperimentsController(badExperiment, verifier).listExperiments);

  it('returns 200 status on success', function (done) {
    ExperimentsController(experiment, verifier).listExperiments(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

