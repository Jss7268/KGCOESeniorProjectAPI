const Mocks = require('./mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;


beforeEach(function () {
    req = Mocks.mockRequest();
    res = Mocks.mockResponse();
});
function testHydrateReqDeviceId(fn, model, verifier) {
    it('doesn\'t allow devices to set device_id', function (done) {
        req.decoded.accessLevel = Mocks.ACCESS_LEVELS.authorized_device;

        fn(model, verifier)(req, res)
            .then(() => {
                expect(req.body.device_id).to.equal(req.decoded.uid);
                done();
            })
            .catch((err) => done(err));
    });

    it('allows elevated users to set device_id', function (done) {
        req.decoded.accessLevel = Mocks.ACCESS_LEVELS.elevated_user;

        fn(model, verifier)(req, res)
            .then(() => {
                expect(req.body.device_id).to.equal(Mocks.DEVICE_ID);
                done();
            })
            .catch((err) => done(err));
    });
}

function testHydrateReqCreatorId(fn, model, verifier) {
    it('doesn\'t allow non-admins to set creator_id', function (done) {
        req.decoded.accessLevel = Mocks.ACCESS_LEVELS.elevated_user;

        fn(model, verifier)(req, res)
            .then(() => {
                expect(req.body.creator_id).to.equal(req.decoded.uid);
                done();
            })
            .catch((err) => done(err));
    });

    it('allows admins to set creator_id', function (done) {
        req.decoded.accessLevel = Mocks.ACCESS_LEVELS.admin_user;
        fn(model, verifier)(req, res)
            .then(() => {
                expect(req.body.creator_id).to.equal(Mocks.CREATOR_ID);
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
    testHydrateReqDeviceId: testHydrateReqDeviceId,
    testHydrateReqCreatorId: testHydrateReqCreatorId,
    testBadVerifier: testBadVerifier,
    testBadModel: testBadModel,
}
