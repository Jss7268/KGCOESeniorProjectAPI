const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;

const User = require('../../models/user');

const db = Mocks.db();
const badDb = Mocks.badDb();

const userAccess = {
    findOne: () => new Promise((resolve) => resolve({ access: Mocks.ACCESS_NAME })),
}
const badUserAccess = {
    findOne: () => new Promise((ignore, reject) => reject(Mocks.ERROR)),
}

var validator;
var badValidator;

// use function instead of lambda
// https://mochajs.org/#arrow-functions
beforeEach(function () {
    validator = Mocks.validator();
    badValidator = Mocks.badValidator();
});

describe('user findAll', function () {
    it('resolves with data', function (done) {
        User(db, validator, userAccess).findAll()
            .then((result) => {
                expect(result).to.be.an('array');
                expect(result[0].paramList).to.deep.equal([]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        User(badDb, validator, userAccess).findAll()
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

describe('user findByAccessLevel', function () {
    it('resolves with data', function (done) {
        User(db, validator, userAccess).findByAccessLevel(Mocks.ACCESS_LEVEL)
            .then((result) => {
                expect(result).to.be.an('array');
                expect(result[0].paramList).to.deep.equal([Mocks.ACCESS_LEVEL]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        User(badDb, validator, userAccess).findByAccessLevel(Mocks.ACCESS_LEVEL)
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

describe('user findOneId', function () {
    it('resolves with data', function (done) {
        User(db, validator, userAccess).findOne({ id: Mocks.OUTPUT_TYPE_ID })
            .then((result) => {
                expect(result.paramList).to.deep.equal([Mocks.OUTPUT_TYPE_ID]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no user found', function (done) {
        var mockDb = {
            query: (ignore) => new Promise((resolve) => resolve({ rows: [] }))
        }
        User(mockDb, validator, userAccess).findOne({ id: Mocks.OUTPUT_TYPE_ID })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('no user found');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no id or name', function (done) {
        User(db, validator, userAccess).findOne({})
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('error: must provide id or email');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        User(badDb, validator, userAccess).findOne({ id: Mocks.OUTPUT_TYPE_ID })
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

describe('user findOneEmail', function () {
    it('resolves with data', function (done) {
        User(db, validator, userAccess).findOne({ email: Mocks.EMAIL })
            .then((result) => {
                expect(result.paramList).to.deep.equal([Mocks.EMAIL]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no user found', function (done) {
        var mockDb = {
            query: (ignore) => new Promise((resolve) => resolve({ rows: [] }))
        }
        User(mockDb, validator, userAccess).findOne({ email: Mocks.EMAIL })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('no user found');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        User(badDb, validator, userAccess).findOne({ email: Mocks.EMAIL })
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

describe('user create', function () {
    var data;

    beforeEach(function () {
        data = {
            name: Mocks.NAME,
            email: Mocks.EMAIL,
            password: Mocks.PASSWORD
        };
    })

    it('resolves with data using all columns', function (done) {

        User(db, validator, userAccess).create(data)
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(4);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with data missing name', function (done) {
        delete data.name;

        User(db, validator, userAccess).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: name');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with data missing email', function (done) {
        delete data.email;

        User(db, validator, userAccess).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: email');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with data missing password', function (done) {
        delete data.password;

        User(db, validator, userAccess).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: password');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        User(badDb, validator, userAccess).create(data)
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

        User(db, badValidator, userAccess).create(data)
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

describe('user delete', function () {
    it('resolves with data', function (done) {

        User(db, validator, userAccess).delete({ id: Mocks.USER_ID })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(2);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        User(badDb, validator, userAccess).delete({ id: Mocks.USER_ID })
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


describe('user updateName', function () {
    it('resolves with data', function (done) {

        User(db, validator, userAccess).updateName({ id: Mocks.USER_ID, name: Mocks.NAME })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        User(badDb, validator, userAccess).updateName({ id: Mocks.USER_ID, name: Mocks.NAME })
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

        User(badDb, validator, userAccess).updateName({ name: Mocks.NAME })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: id');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on missing name', function (done) {

        User(db, validator, userAccess).updateName({ id: Mocks.USER_ID })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: name');
                done();
            })
            .catch((err) => done(err));
    });
});

describe('user updateEmail', function () {
    it('resolves with data', function (done) {

        User(db, validator, userAccess).updateEmail({ id: Mocks.USER_ID, email: Mocks.EMAIL })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        User(badDb, validator, userAccess).updateEmail({ id: Mocks.USER_ID, email: Mocks.EMAIL })
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

        User(db, validator, userAccess).updateEmail({ email: Mocks.EMAIL })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: id');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on missing email', function (done) {

        User(db, validator, userAccess).updateEmail({ id: Mocks.USER_ID })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: email');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on incorrect email type', function (done) {

        User(db, validator, userAccess).updateEmail({ id: Mocks.USER_ID, email: 123456 })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('email must be a string');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on incorrect email type', function (done) {

        User(db, validator, userAccess).updateEmail({ id: Mocks.USER_ID, email: 'bad' })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('provided email does not match proper email format');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad validation', function (done) {

        User(db, badValidator, userAccess).updateEmail({ id: Mocks.USER_ID, email: Mocks.EMAIL })
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


describe('user updatePassword', function () {
    it('resolves with data', function (done) {

        User(db, validator, userAccess).updatePassword({ id: Mocks.USER_ID, password: Mocks.PASSWORD })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        User(badDb, validator, userAccess).updatePassword({ id: Mocks.USER_ID, password: Mocks.PASSWORD })
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

        User(db, validator, userAccess).updatePassword({ password: Mocks.PASSWORD })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: id');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on missing password', function (done) {

        User(db, validator, userAccess).updatePassword({ id: Mocks.USER_ID })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: password');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on incorrect password type', function (done) {

        User(db, validator, userAccess).updatePassword({ id: Mocks.USER_ID, password: 123456789 })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('password must be a string');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on short password', function (done) {

        User(db, validator, userAccess).updatePassword({ id: Mocks.USER_ID, password: 'hi' })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('password must be at least 6 characters long');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad validation', function (done) {

        User(db, badValidator, userAccess).updatePassword({ id: Mocks.USER_ID, password: Mocks.PASSWORD })
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

describe('user updateAccess', function () {
    it('resolves with data', function (done) {

        User(db, validator, userAccess).updateAccess({ id: Mocks.USER_ID, access_level: Mocks.ACCESS_LEVEL })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        User(badDb, validator, userAccess).updateAccess({ id: Mocks.USER_ID, access_level: Mocks.ACCESS_LEVEL })
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

        User(db, validator, userAccess).updateAccess({ access_level: Mocks.ACCESS_LEVEL })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: id');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on missing access_level', function (done) {

        User(db, validator, userAccess).updateAccess({ id: Mocks.USER_ID })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: access_level');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad user access', function (done) {

        User(db, validator, badUserAccess).updateAccess({ id: Mocks.USER_ID, access_level: Mocks.ACCESS_LEVEL })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.ERROR);
                done();
            })
            .catch((err) => done(err));
    });
});

describe('user authenticate', function () {
    let mockDb = {
        query: () => new Promise((resolve) => resolve(
            { rows: [{ email: Mocks.EMAIL, hashed_password: Mocks.HASH, id: Mocks.USER_ID, access_level: Mocks.ACCESS_LEVEL }] }
        ))
    }
    it('resolves with data', function (done) {

        User(mockDb, validator, userAccess).authenticate({ email: Mocks.EMAIL, password: Mocks.PASSWORD })
            .then((result) => {
                expect(result).to.be.an('object');
                expect(result.isAuthorized).to.be.true;
                expect(result.id).to.be.equal(Mocks.USER_ID);
                expect(result.accessLevel).to.be.equal(Mocks.ACCESS_LEVEL);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        User(badDb, validator, userAccess).authenticate({ email: Mocks.EMAIL, password: Mocks.PASSWORD })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.DB_ERROR);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on missing email', function (done) {

        User(db, validator, userAccess).authenticate({ password: Mocks.PASSWORD })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: email');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on missing password', function (done) {

        User(db, validator, userAccess).authenticate({ email: Mocks.EMAIL })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: password');
                done();
            })
            .catch((err) => done(err));
    });

    it('not authorized on incorrect password', function (done) {
        
        User(mockDb, validator, userAccess).authenticate({ email: Mocks.EMAIL, password: 'wrong' })
        .then((result) => {
            expect(result).to.be.an('object');
            expect(result.isAuthorized).to.be.false;
            expect(result.id).to.be.equal(Mocks.USER_ID);
            expect(result.accessLevel).to.be.equal(Mocks.ACCESS_LEVEL);
            done();
        })
        .catch((err) => done(err));
    });

});