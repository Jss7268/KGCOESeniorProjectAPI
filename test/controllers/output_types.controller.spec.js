const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const TestGeneric = require('../test_generic');
const OutputTypesController = require('../../controllers/output_types.controller')

const outputType = {
  create: (ignore) => new Promise((resolve) => resolve({ id: Mocks.ID })),
  updateUnits: ({ id, output_type_name, units }) => new Promise((resolve) => {
    output_type_name === undefined ? resolve({ id: id, units: units }) : resolve({ output_type_name: output_type_name, units: units })
  }),
  delete: (ignore) => new Promise((resolve) => resolve({ id: Mocks.ID })),
  findOne: ({ id, output_type_name }) => new Promise((resolve) => {
    output_type_name === undefined ? resolve({ id: id}) : resolve({ output_type_name: output_type_name})
  }),
  findAll: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT])),

}
const badOutputType = {
  create: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  updateUnits: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  delete: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
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

describe('createOutputType', function () {
  TestGeneric.testBadVerifier(OutputTypesController.createOutputType, outputType, badVerifier);
  TestGeneric.testBadModel(OutputTypesController.createOutputType, badOutputType, verifier);

  it('returns 201 status on success', function (done) {
    OutputTypesController.createOutputType(outputType, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({ message: 'success! created new output_type', id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('changeUnits', () => {
  TestGeneric.testBadVerifier(OutputTypesController.changeUnits, outputType, badVerifier);
  TestGeneric.testBadModel(OutputTypesController.changeUnits, badOutputType, verifier);

  it('returns 200 status on success', function (done) {
    OutputTypesController.changeUnits(outputType, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID, units: Mocks.UNITS });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('changeUnitsName', () => {
  TestGeneric.testBadVerifier(OutputTypesController.changeUnitsName, outputType, badVerifier);
  TestGeneric.testBadModel(OutputTypesController.changeUnitsName, badOutputType, verifier);
  it('returns 200 status on success', function (done) {
    OutputTypesController.changeUnitsName(outputType, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ output_type_name: Mocks.OUTPUT_TYPE_NAME, units: Mocks.UNITS });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('deleteOutputType', () => {
  TestGeneric.testBadVerifier(OutputTypesController.deleteOutputType, outputType, badVerifier);
  TestGeneric.testBadModel(OutputTypesController.deleteOutputType, badOutputType, verifier);

  it('returns 200 status on success', function (done) {
    OutputTypesController.deleteOutputType(outputType, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: 'deleted output_type with id: ' + Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('deleteOutputTypeName', () => {
  TestGeneric.testBadVerifier(OutputTypesController.deleteOutputTypeName, outputType, badVerifier);
  TestGeneric.testBadModel(OutputTypesController.deleteOutputTypeName, badOutputType, verifier);

  it('returns 200 status on success', function (done) {
    OutputTypesController.deleteOutputTypeName(outputType, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: 'deleted output_type with id: ' + Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('getOneOutputType', () => {
  TestGeneric.testBadModel(OutputTypesController.getOneOutputType, badOutputType, verifier);

  it('returns 200 status on success', function (done) {
    OutputTypesController.getOneOutputType(outputType, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('getOneOutputTypeName', () => {
  TestGeneric.testBadModel(OutputTypesController.getOneOutputTypeName, badOutputType, verifier);

  it('returns 200 status on success', function (done) {
    OutputTypesController.getOneOutputTypeName(outputType, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ output_type_name: Mocks.OUTPUT_TYPE_NAME });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listOutputTypes', () => {
  TestGeneric.testBadModel(OutputTypesController.listOutputTypes, badOutputType, verifier);

  it('returns 200 status on success', function (done) {
    OutputTypesController.listOutputTypes(outputType, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

