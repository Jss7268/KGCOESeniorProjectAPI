const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const bcrypt = require('bcrypt');

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
        User(db, validator, userAccess, bcrypt).findAll()
            .then((result) => {
                expect(result).to.be.an('array');
                expect(result[0].paramList).to.deep.equal([]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        User(badDb, validator, userAccess, bcrypt).findAll()
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
        User(db, validator, userAccess, bcrypt).findByAccessLevel(Mocks.ACCESS_LEVEL)
            .then((result) => {
                expect(result).to.be.an('array');
                expect(result[0].paramList).to.deep.equal([Mocks.ACCESS_LEVEL]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        User(badDb, validator, userAccess, bcrypt).findByAccessLevel(Mocks.ACCESS_LEVEL)
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
        User(db, validator, userAccess, bcrypt).findOne({ id: Mocks.OUTPUT_TYPE_ID })
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
        User(mockDb, validator, userAccess, bcrypt).findOne({ id: Mocks.OUTPUT_TYPE_ID })
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
        User(db, validator, userAccess, bcrypt).findOne({})
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
        User(badDb, validator, userAccess, bcrypt).findOne({ id: Mocks.OUTPUT_TYPE_ID })
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
        User(db, validator, userAccess, bcrypt).findOne({ email: Mocks.EMAIL })
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
        User(mockDb, validator, userAccess, bcrypt).findOne({ email: Mocks.EMAIL })
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
        User(badDb, validator, userAccess, bcrypt).findOne({ email: Mocks.EMAIL })
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
            password: Mocks.PASSWORD,
            requested_access_level: Mocks.ACCESS_LEVEL,
            requested_reason: Mocks.REQUESTED_REASON,
        };
    })

    it('resolves with data using all columns', function (done) {

        User(db, validator, userAccess, bcrypt).create(data)
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(6);
                done();
            })
            .catch((err) => done(err));
    });

    it('resolves with missing requested_access_level', function (done) {
        delete data.requested_access_level;
        User(db, validator, userAccess, bcrypt).create(data)
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(6);
                expect(result.paramList[3]).to.be.null
                done();
            })
            .catch((err) => done(err));
    });

    it('resolves with missing requested_reason', function (done) {
        delete data.requested_reason;
        User(db, validator, userAccess, bcrypt).create(data)
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(6);
                expect(result.paramList[4]).to.be.null
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with too long of requested_reason', function (done) {
        data.requested_reason = Mocks.TOO_LONG;

        User(db, validator, userAccess, bcrypt).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('requested reason must be less than 256 characters long');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with data missing name', function (done) {
        delete data.name;

        User(db, validator, userAccess, bcrypt).create(data)
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

        User(db, validator, userAccess, bcrypt).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: email');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with too long of email', function (done) {
        data.email = Mocks.TOO_LONG;

        User(db, validator, userAccess, bcrypt).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('email must be less than 256 characters long');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with data missing password', function (done) {
        delete data.password;

        User(db, validator, userAccess, bcrypt).create(data)
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

        User(badDb, validator, userAccess, bcrypt).create(data)
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

        User(db, badValidator, userAccess, bcrypt).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.VALIDATION_ERROR);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad genSalt', function (done) {
        let mockBcrypt = {
            genSalt: (ignore, cb) => {cb(Mocks.BCRPYT_ERROR, null)}
        }
        User(db, validator, userAccess, mockBcrypt).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.BCRPYT_ERROR);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad hash', function (done) {
        let mockBcrypt = {
            genSalt: bcrypt.genSalt,
            hash: (password, salt, cb) => {cb(Mocks.BCRPYT_ERROR, null)}
        }
        User(db, validator, userAccess, mockBcrypt).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.BCRPYT_ERROR);
                done();
            })
            .catch((err) => done(err));
    });
});

describe('user delete', function () {
    it('resolves with data', function (done) {

        User(db, validator, userAccess, bcrypt).delete({ id: Mocks.USER_ID })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(2);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        User(badDb, validator, userAccess, bcrypt).delete({ id: Mocks.USER_ID })
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

        User(db, validator, userAccess, bcrypt).updateName({ id: Mocks.USER_ID, name: Mocks.NAME })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        User(badDb, validator, userAccess, bcrypt).updateName({ id: Mocks.USER_ID, name: Mocks.NAME })
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

        User(badDb, validator, userAccess, bcrypt).updateName({ name: Mocks.NAME })
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

        User(db, validator, userAccess, bcrypt).updateName({ id: Mocks.USER_ID })
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

        User(db, validator, userAccess, bcrypt).updateEmail({ id: Mocks.USER_ID, email: Mocks.EMAIL })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        User(badDb, validator, userAccess, bcrypt).updateEmail({ id: Mocks.USER_ID, email: Mocks.EMAIL })
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

        User(db, validator, userAccess, bcrypt).updateEmail({ email: Mocks.EMAIL })
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

        User(db, validator, userAccess, bcrypt).updateEmail({ id: Mocks.USER_ID })
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

        User(db, validator, userAccess, bcrypt).updateEmail({ id: Mocks.USER_ID, email: 123456 })
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

        User(db, validator, userAccess, bcrypt).updateEmail({ id: Mocks.USER_ID, email: 'bad' })
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

        User(db, badValidator, userAccess, bcrypt).updateEmail({ id: Mocks.USER_ID, email: Mocks.EMAIL })
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

        User(db, validator, userAccess, bcrypt).updatePassword({ id: Mocks.USER_ID, password: Mocks.PASSWORD })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        User(badDb, validator, userAccess, bcrypt).updatePassword({ id: Mocks.USER_ID, password: Mocks.PASSWORD })
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

        User(db, validator, userAccess, bcrypt).updatePassword({ password: Mocks.PASSWORD })
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

        User(db, validator, userAccess, bcrypt).updatePassword({ id: Mocks.USER_ID })
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

        User(db, validator, userAccess, bcrypt).updatePassword({ id: Mocks.USER_ID, password: 123456789 })
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

        User(db, validator, userAccess, bcrypt).updatePassword({ id: Mocks.USER_ID, password: 'hi' })
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

        User(db, badValidator, userAccess, bcrypt).updatePassword({ id: Mocks.USER_ID, password: Mocks.PASSWORD })
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

        User(db, validator, userAccess, bcrypt).updateAccess({ id: Mocks.USER_ID, access_level: Mocks.ACCESS_LEVEL })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        User(badDb, validator, userAccess, bcrypt).updateAccess({ id: Mocks.USER_ID, access_level: Mocks.ACCESS_LEVEL })
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

        User(db, validator, userAccess, bcrypt).updateAccess({ access_level: Mocks.ACCESS_LEVEL })
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

        User(db, validator, userAccess, bcrypt).updateAccess({ id: Mocks.USER_ID })
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

describe('user rejectRequestedAccessLevel', function () {
    it('resolves with data', function (done) {

        User(db, validator, userAccess, bcrypt).rejectRequestedAccessLevel({ id: Mocks.USER_ID })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(2);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        User(badDb, validator, userAccess, bcrypt).rejectRequestedAccessLevel({ id: Mocks.USER_ID })
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

        User(db, validator, userAccess, bcrypt).rejectRequestedAccessLevel({ })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: id');
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

        User(mockDb, validator, userAccess, bcrypt).authenticate({ email: Mocks.EMAIL, password: Mocks.PASSWORD })
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

        User(badDb, validator, userAccess, bcrypt).authenticate({ email: Mocks.EMAIL, password: Mocks.PASSWORD })
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

        User(db, validator, userAccess, bcrypt).authenticate({ password: Mocks.PASSWORD })
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

        User(db, validator, userAccess, bcrypt).authenticate({ email: Mocks.EMAIL })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: password');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad compare', function (done) {
        let mockBcrypt = {
            compare: (password, hashed, cb) => {cb(Mocks.BCRPYT_ERROR, null)}
        }
        User(db, validator, userAccess, mockBcrypt).authenticate({ email: Mocks.EMAIL, password: Mocks.PASSWORD })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.BCRPYT_ERROR);
                done();
            })
            .catch((err) => done(err));
    });

    it('not authorized on incorrect password', function (done) {
        
        User(mockDb, validator, userAccess, bcrypt).authenticate({ email: Mocks.EMAIL, password: 'wrong' })
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