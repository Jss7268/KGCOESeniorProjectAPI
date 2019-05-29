const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;

const UserAccess = require('../../models/user_access');

const db = Mocks.db();
const badDb = Mocks.badDb();

const deviceExperiment = {
    findOne: ({ experiment_id, device_id }) => new Promise((resolve) => resolve({ device_id: device_id, experiment_id: experiment_id })),
    findOneByDevice: (device_id) => new Promise((resolve) => resolve({ device_id: device_id, experiment_id: Mocks.EXPERIMENT_ID })),
}
const badDeviceExperiment = {
    findOne: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
    findOneByDevice: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
}

var validator;
var badValidator;

// use function instead of lambda
// https://mochajs.org/#arrow-functions
beforeEach(function () {
    validator = Mocks.validator();
    badValidator = Mocks.badValidator();
});

describe('user_access findAll', function () {
    it('resolves with data', function (done) {
        UserAccess(db, validator).findAll()
            .then((result) => {
                expect(result).to.be.an('array');
                expect(result[0].paramList).to.deep.equal([]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        UserAccess(badDb, validator).findAll()
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

describe('user_access findOne', function () {
    it('resolves with data', function (done) {
        UserAccess(db, validator).findOne({ access_level: Mocks.ACCESS_LEVEL })
            .then((result) => {
                expect(result.paramList).to.deep.equal([Mocks.ACCESS_LEVEL]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no user_access found', function (done) {
        var mockDb = {
            query: (ignore) => new Promise((resolve) => resolve({ rows: [] }))
        }
        UserAccess(mockDb, validator).findOne({ access_level: Mocks.ACCESS_LEVEL })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('no user_access found');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no access_level', function (done) {
        UserAccess(db, validator).findOne({})
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: access_level');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        UserAccess(badDb, validator).findOne({ access_level: Mocks.ACCESS_LEVEL })
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

describe('user_access findOneByName', function () {
    it('resolves with data', function (done) {
        UserAccess(db, validator).findOneByName({ access_name: Mocks.ACCESS_NAME })
            .then((result) => {
                expect(result.paramList).to.deep.equal([Mocks.ACCESS_NAME]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no user_access found', function (done) {
        var mockDb = {
            query: (ignore) => new Promise((resolve) => resolve({ rows: [] }))
        }
        UserAccess(mockDb, validator).findOneByName({ access_name: Mocks.ACCESS_NAME })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('no user_access found');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no access_name', function (done) {
        UserAccess(db, validator).findOneByName({})
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: access_name');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        UserAccess(badDb, validator).findOneByName({ access_name: Mocks.ACCESS_NAME })
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