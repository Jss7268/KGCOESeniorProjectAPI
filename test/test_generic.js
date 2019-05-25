const Mocks = require('./mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;


beforeEach(function () {
    req = Mocks.mockRequest();
    res = Mocks.mockResponse();
});
function testHydrateReq(fn, model, verifier) {
    it('doesn\'t allow devices to set device_id', function (done) {
        req.decoded.accessLevel = 1; // authorized_device access level

        fn(model, verifier)(req, res)
            .then(() => {
                expect(req.body.device_id).to.equal(Mocks.USER_ID);
                done();
            })
            .catch((err) => done(err));
    });

    it('doesn\'t allow devices to set device_id', function (done) {
        fn(model, verifier)(req, res)
            .then(() => {
                expect(req.body.device_id).to.equal(Mocks.DEVICE_ID);
                done();
            })
            .catch((err) => done(err));
    });
}

function testBadVerifier(fn, model, badVerifier) {
    it('returns 400 status on bad verifier', function (done) {
        fn(model, badVerifier)(req, res)
            .then(() => {
                expect(res.status).to.have.been.calledWith(Mocks.ERROR_STATUS);
                expect(res.json).to.have.been.calledWith({ message: Mocks.ERROR_MESSAGE });
                done();
            })
            .catch((err) => done(err));
    });
}

function testBadModel(fn, badModel, verifier) {
    it('returns 400 status on bad model', function (done) {
        fn(badModel, verifier)(req, res)
            .then(() => {
                expect(res.status).to.have.been.calledWith(Mocks.ERROR_STATUS);
                expect(res.json).to.have.been.calledWith({ message: Mocks.ERROR_MESSAGE });
                done();
            })
            .catch((err) => done(err));
    });
}

module.exports = {
    testHydrateReq: testHydrateReq,
    testBadVerifier: testBadVerifier,
    testBadModel: testBadModel,
}