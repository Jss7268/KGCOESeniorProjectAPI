const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;

const OutputType = require('../../models/output_type');

const db = Mocks.db();
const badDb = Mocks.badDb();

var validator;
var badValidator;

// use function instead of lambda
// https://mochajs.org/#arrow-functions
beforeEach(function () {
    validator = Mocks.validator();
    badValidator = Mocks.badValidator();
});

describe('output_type findAll', function () {
    it('resolves with data', function (done) {
        OutputType(db, validator).findAll()
            .then((result) => {
                expect(result).to.be.an('array');
                expect(result[0].paramList).to.deep.equal([]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        OutputType(badDb, validator).findAll()
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.DB_ERROR);
                done();
            })
            .catch((err) => done(err));
    });
});

describe('output_type findOneId', function () {
    it('resolves with data', function (done) {
        OutputType(db, validator).findOne({ id: Mocks.OUTPUT_TYPE_ID })
            .then((result) => {
                expect(result.paramList).to.deep.equal([Mocks.OUTPUT_TYPE_ID]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no output_type found', function (done) {
        var mockDb = {
            query: (ignore) => new Promise((resolve) => resolve({ rows: [] }))
        }
        OutputType(mockDb, validator).findOne({ id: Mocks.OUTPUT_TYPE_ID })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('no output_type found');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no id or name', function (done) {
        OutputType(db, validator).findOne({})
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('error: must provide id or output_type_name');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        OutputType(badDb, validator).findOne({ id: Mocks.OUTPUT_TYPE_ID })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.DB_ERROR);
                done();
            })
            .catch((err) => done(err));
    });
});

describe('output_type findOneName', function () {
    it('resolves with data', function (done) {
        OutputType(db, validator).findOne({ output_type_name: Mocks.OUTPUT_TYPE_NAME })
            .then((result) => {
                expect(result.paramList).to.deep.equal([Mocks.OUTPUT_TYPE_NAME]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no output_type found', function (done) {
        var mockDb = {
            query: (ignore) => new Promise((resolve) => resolve({ rows: [] }))
        }
        OutputType(mockDb, validator).findOne({ output_type_name: Mocks.OUTPUT_TYPE_NAME })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('no output_type found');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        OutputType(badDb, validator).findOne({ output_type_name: Mocks.OUTPUT_TYPE_NAME })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.DB_ERROR);
                done();
            })
            .catch((err) => done(err));
    });
});

describe('output_type create', function () {
    var data;

    beforeEach(function () {
        data = {
            output_type_name: Mocks.CREATOR_ID,
            units: Mocks.UNITS,
        };
    })

    it('resolves with data using all columns', function (done) {

        OutputType(db, validator).create(data)
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                done();
            })
            .catch((err) => done(err));
    });

    it('resolves with data using no units', function (done) {
        delete data.units;

        OutputType(db, validator).create(data)
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                expect(result.paramList[1]).to.be.null;
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with data missing output_type_name', function (done) {
        delete data.output_type_name;

        OutputType(db, validator).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: output_type_name');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        OutputType(badDb, validator).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.DB_ERROR);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad validation', function (done) {

        OutputType(db, badValidator).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.VALIDATION_ERROR);
                done();
            })
            .catch((err) => done(err));
    });
});

describe('output_type deleteId', function () {
    it('resolves with data', function (done) {

        OutputType(db, validator).delete({ id: Mocks.OUTPUT_TYPE_ID })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(2);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        OutputType(badDb, validator).delete({ id: Mocks.OUTPUT_TYPE_ID })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.DB_ERROR);
                done();
            })
            .catch((err) => done(err));
    });
});

describe('output_type deleteName', function () {
    it('resolves with data', function (done) {

        OutputType(db, validator).delete({ output_type_name: Mocks.OUTPUT_TYPE_NAME })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(2);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        OutputType(badDb, validator).delete({ output_type_name: Mocks.OUTPUT_TYPE_NAME })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.DB_ERROR);
                done();
            })
            .catch((err) => done(err));
    });
});

describe('output_type updateUnitsId', function () {
    it('resolves with data', function (done) {

        OutputType(db, validator).updateUnits({ id: Mocks.OUTPUT_TYPE_ID, units: Mocks.UNITS })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        OutputType(badDb, validator).updateUnits({ id: Mocks.OUTPUT_TYPE_ID, units: Mocks.UNITS })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.DB_ERROR);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on missing id or name', function (done) {

        OutputType(badDb, validator).updateUnits({ units: Mocks.UNITS })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('error: id or output_type_name and/or units missing');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on missing units', function (done) {

        OutputType(badDb, validator).updateUnits({ id: Mocks.OUTPUT_TYPE_ID })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('error: id or output_type_name and/or units missing');
                done();
            })
            .catch((err) => done(err));
    });
});


describe('output_type updateUnitsName', function () {
    it('resolves with data', function (done) {

        OutputType(db, validator).updateUnits({ output_type_name: Mocks.OUTPUT_TYPE_NAME, units: Mocks.UNITS })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        OutputType(badDb, validator).updateUnits({ output_type_name: Mocks.OUTPUT_TYPE_NAME, units: Mocks.UNITS })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.DB_ERROR);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on missing units', function (done) {

        OutputType(badDb, validator).updateUnits({ output_type_name: Mocks.OUTPUT_TYPE_NAME })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('error: id or output_type_name and/or units missing');
                done();
            })
            .catch((err) => done(err));
    });
});