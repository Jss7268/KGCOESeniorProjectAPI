const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;

const DeviceExperiment = require('../../models/device_experiment');

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

describe('device_experiment findAll', function () {
    it('resolves with data', function (done) {
        DeviceExperiment(db, validator).findAll()
            .then((result) => {
                expect(result).to.be.an('array');
                expect(result[0].paramList).to.deep.equal([]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        DeviceExperiment(badDb, validator).findAll()
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

describe('device_experiment findAllByDevice', function () {
    it('resolves with data', function (done) {
        DeviceExperiment(db, validator).findAllByDevice({ device_id: Mocks.DEVICE_ID })
            .then((result) => {
                expect(result).to.be.an('array');
                expect(result[0].paramList).to.deep.equal([Mocks.DEVICE_ID]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        DeviceExperiment(badDb, validator).findAllByDevice({ device_id: Mocks.DEVICE_ID })
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
        DeviceExperiment(db, badValidator).findAllByDevice({ device_id: Mocks.DEVICE_ID })
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

describe('device_experiment findAllByExperiment', function () {
    it('resolves with data', function (done) {
        DeviceExperiment(db, validator).findAllByExperiment({ experiment_id: Mocks.EXPERIMENT_ID })
            .then((result) => {
                expect(result).to.be.an('array');
                expect(result[0].paramList).to.deep.equal([Mocks.EXPERIMENT_ID]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        DeviceExperiment(badDb, validator).findAllByExperiment({ experiment_id: Mocks.EXPERIMENT_ID })
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
        DeviceExperiment(db, badValidator).findAllByExperiment({ experiment_id: Mocks.EXPERIMENT_ID })
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

describe('device_experiment findOneByDevice', function () {
    it('resolves with data', function (done) {
        DeviceExperiment(db, validator).findOneByDevice({ device_id: Mocks.DEVICE_ID })
            .then((result) => {
                expect(result).to.be.an('object');
                expect(result.paramList).to.deep.equal([Mocks.DEVICE_ID]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        DeviceExperiment(badDb, validator).findOneByDevice({ device_id: Mocks.DEVICE_ID })
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

describe('device_experiment findOne', function () {
    it('resolves with data', function (done) {
        DeviceExperiment(db, validator).findOne({ device_id: Mocks.DEVICE_ID, experiment_id: Mocks.EXPERIMENT_ID })
            .then((result) => {
                expect(result.paramList).to.deep.equal([Mocks.DEVICE_ID, Mocks.EXPERIMENT_ID]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no device_experiment found', function (done) {
        var mockDb = {
            query: (ignore) => new Promise((resolve) => resolve({ rows: [] }))
        }
        DeviceExperiment(mockDb, validator).findOne({ device_id: Mocks.DEVICE_ID, experiment_id: Mocks.EXPERIMENT_ID })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('no device_experiment found');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no device id', function (done) {
        DeviceExperiment(db, validator).findOne({experiment_id: Mocks.EXPERIMENT_ID})
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: device_id');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no experiment id', function (done) {
        DeviceExperiment(db, validator).findOne({device_id: Mocks.DEVICE_ID})
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: experiment_id');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        DeviceExperiment(badDb, validator).findOne({ device_id: Mocks.DEVICE_ID, experiment_id: Mocks.EXPERIMENT_ID })
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

describe('device_experiment create', function () {
    var data = {
        device_id: Mocks.DEVICE_ID,
        experiment_id: Mocks.EXPERIMENT_ID,
    };

    it('resolves with data using output_type_id', function (done) {

        DeviceExperiment(db, validator).create(data)
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                done();
            })
            .catch((err) => done(err));
    });


    it('rejects on bad query', function (done) {

        DeviceExperiment(badDb, validator).create(data)
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

        DeviceExperiment(db, badValidator).create(data)
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

describe('device_experiment delete', function () {
    it('resolves with data', function (done) {

        DeviceExperiment(db, validator).delete({id: Mocks.ID})
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        DeviceExperiment(badDb, validator).delete({ id: Mocks.ID })
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


