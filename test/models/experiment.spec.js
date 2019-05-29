const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;

const Experiment = require('../../models/experiment');

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

describe('experiment findAll', function () {
    it('resolves with data', function (done) {
        Experiment(db, validator).findAll()
            .then((result) => {
                expect(result).to.be.an('array');
                expect(result[0].paramList).to.deep.equal([]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        Experiment(badDb, validator).findAll()
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

describe('experiment findOne', function () {
    it('resolves with data', function (done) {
        Experiment(db, validator).findOne({ id: Mocks.EXPERIMENT_ID })
            .then((result) => {
                expect(result.paramList).to.deep.equal([Mocks.EXPERIMENT_ID]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no experiment found', function (done) {
        var mockDb = {
            query: (ignore) => new Promise((resolve) => resolve({ rows: [] }))
        }
        Experiment(mockDb, validator).findOne({ id: Mocks.EXPERIMENT_ID })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('no experiment found');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no id', function (done) {
        Experiment(db, validator).findOne({})
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('error: must provide id');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        Experiment(badDb, validator).findOne({ id: Mocks.EXPERIMENT_ID })
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

describe('experiment create', function () {
    var data;

    beforeEach(function () {
        data = {
            creator_id: Mocks.CREATOR_ID,
            notes: Mocks.NOTES,
            description: Mocks.DESCRIPTION,
            start_time: Mocks.START_TIME,
        };
    })

    it('resolves with data using all columns', function (done) {

        Experiment(db, validator).create(data)
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(5);
                done();
            })
            .catch((err) => done(err));
    });

    it('resolves with data using no start_time', function (done) {
        delete data.start_time;

        Experiment(db, validator).create(data)
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(5);
                expect(result.paramList[3]).to.be.null;
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with data missing creator_id', function (done) {
        delete data.creator_id;

        Experiment(db, validator).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('creator_id or description missing');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with data missing description', function (done) {
        delete data.description;

        Experiment(db, validator).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('creator_id or description missing');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        Experiment(badDb, validator).create(data)
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

        Experiment(db, badValidator).create(data)
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

describe('experiment delete', function () {
    it('resolves with data', function (done) {

        Experiment(db, validator).delete({ id: Mocks.EXPERIMENT_ID })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(2);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        Experiment(badDb, validator).delete({ id: Mocks.EXPERIMENT_ID })
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


describe('experiment updateStartTime', function () {
    it('resolves with data', function (done) {

        Experiment(db, validator).updateStartTime({ id: Mocks.EXPERIMENT_ID, start_time: Mocks.START_TIME })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        Experiment(badDb, validator).updateStartTime({ id: Mocks.EXPERIMENT_ID, start_time: Mocks.START_TIME })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.DB_ERROR);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on missing id', function (done) {

        Experiment(badDb, validator).updateStartTime({ start_time: Mocks.START_TIME })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('error: id and/or start_time missing');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on missing start_time', function (done) {

        Experiment(badDb, validator).updateStartTime({ id: Mocks.EXPERIMENT_ID })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('error: id and/or start_time missing');
                done();
            })
            .catch((err) => done(err));
    });
});
