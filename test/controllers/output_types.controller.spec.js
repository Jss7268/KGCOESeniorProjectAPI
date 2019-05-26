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
  TestGeneric.testBadVerifier(OutputTypesController(outputType, badVerifier).createOutputType);
  TestGeneric.testBadModel(OutputTypesController(badOutputType, verifier).createOutputType);

  it('returns 201 status on success', function (done) {
    OutputTypesController(outputType, verifier).createOutputType(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({ message: 'success! created new output_type', id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('changeUnits', () => {
  TestGeneric.testBadVerifier(OutputTypesController(outputType, badVerifier).changeUnits);
  TestGeneric.testBadModel(OutputTypesController(badOutputType, verifier).changeUnits);

  it('returns 200 status on success', function (done) {
    OutputTypesController(outputType, verifier).changeUnits(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID, units: Mocks.UNITS });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('changeUnitsName', () => {
  TestGeneric.testBadVerifier(OutputTypesController(outputType, badVerifier).changeUnitsName);
  TestGeneric.testBadModel(OutputTypesController(badOutputType, verifier).changeUnitsName);
  it('returns 200 status on success', function (done) {
    OutputTypesController(outputType, verifier).changeUnitsName(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ output_type_name: Mocks.OUTPUT_TYPE_NAME, units: Mocks.UNITS });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('deleteOutputType', () => {
  TestGeneric.testBadVerifier(OutputTypesController(outputType, badVerifier).deleteOutputType);
  TestGeneric.testBadModel(OutputTypesController(badOutputType, verifier).deleteOutputType);

  it('returns 200 status on success', function (done) {
    OutputTypesController(outputType, verifier).deleteOutputType(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: 'deleted output_type with id: ' + Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('deleteOutputTypeName', () => {
  TestGeneric.testBadVerifier(OutputTypesController(outputType, badVerifier).deleteOutputTypeName);
  TestGeneric.testBadModel(OutputTypesController(badOutputType, verifier).deleteOutputTypeName);

  it('returns 200 status on success', function (done) {
    OutputTypesController(outputType, verifier).deleteOutputTypeName(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: 'deleted output_type with id: ' + Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('getOneOutputType', () => {
  TestGeneric.testBadModel(OutputTypesController(badOutputType, verifier).getOneOutputType);

  it('returns 200 status on success', function (done) {
    OutputTypesController(outputType, verifier).getOneOutputType(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('getOneOutputTypeName', () => {
  TestGeneric.testBadModel(OutputTypesController(badOutputType, verifier).getOneOutputTypeName);

  it('returns 200 status on success', function (done) {
    OutputTypesController(outputType, verifier).getOneOutputTypeName(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ output_type_name: Mocks.OUTPUT_TYPE_NAME });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listOutputTypes', () => {
  TestGeneric.testBadModel(OutputTypesController(badOutputType, verifier).listOutputTypes);

  it('returns 200 status on success', function (done) {
    OutputTypesController(outputType, verifier).listOutputTypes(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

