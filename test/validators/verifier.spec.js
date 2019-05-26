const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const Verifier = require('../../validators/verifier');

const userAccess = {
    findOne: ({ id }) => new Promise((resolve) => resolve({ access: Mocks.ACCESS_NAME })),
    findOneByName: ({ access_name }) => new Promise((resolve) => resolve({ access_level: Mocks.ACCESS_LEVEL })),
}
const badUserAccess1 = {
    findOne: ({ id }) => new Promise((resolve) => resolve({ access: Mocks.ACCESS_NAME })),
    findOneByName: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
}

const badUserAccess2 = {
    findOne: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
    findOneByName: ({ access_name }) => new Promise((resolve) => resolve({ access_level: Mocks.ACCESS_LEVEL })),
}


// use function instead of lambda
// https://mochajs.org/#arrow-functions
beforeEach(function () {
});

describe('verifyMinAccessLevel', function () {
    it('resolves on correct access', function (done) {
        Verifier(userAccess).verifyMinAccessLevel(2, 2)
            .then(() => {
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on incorrect access', function (done) {
        Verifier(userAccess).verifyMinAccessLevel(1, 2)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err.status).to.be.equal(403)
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on null access', function (done) {
        Verifier(userAccess).verifyMinAccessLevel(null, 2)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err.status).to.be.equal(403)
                done();
            })
            .catch((err) => done(err));
    });
});

describe('verifyMinAccessName', function () {
    it('resolves on correct access', function (done) {
        Verifier(userAccess).verifyMinAccessName(Mocks.ACCESS_LEVEL, Mocks.ACCESS_LEVEL)
            .then(() => {
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad findOneByName', function (done) {
        Verifier(badUserAccess1).verifyMinAccessName(Mocks.ACCESS_LEVEL, Mocks.ACCESS_LEVEL)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err.status).to.be.equal(418) // not a forbidden rejection
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad findOne', function (done) {
        Verifier(badUserAccess2).verifyMinAccessName(Mocks.ACCESS_LEVEL - 1, Mocks.ACCESS_LEVEL)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err.status).to.be.equal(403)
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on null access', function (done) {
        Verifier(userAccess).verifyMinAccessName(null, 2)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err.status).to.be.equal(403)
                done();
            })
            .catch((err) => done(err));
    });
});
