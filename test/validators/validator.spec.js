const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const Validator = require('../../validators/validator');

const generic = {
    findOne: (table, {id}) => new Promise((resolve) => resolve({table: table, id: id})),
    findOneByColumn: (table, value, column) => new Promise((resolve) => {
        var data = {table: table};
        data[column] = value;
        resolve(data);
    }),
}
const badGeneric = {
    findOne: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
    findOneByColumn: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
}

// use function instead of lambda
// https://mochajs.org/#arrow-functions
beforeEach(function () {
});

describe('validateColumns', function () {
    it('resolves on correct columns', function (done) {
        Validator(generic).validateColumns({1: 1}, [1])
            .then(() => {
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on missing column', function (done) {
        Validator(generic).validateColumns({}, [1])
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('missing: 1');
                done();
            })
            .catch((err) => done(err));
    });
});

describe('validateUserId', function () {
    it('resolves when user found', function (done) {
        Validator(generic).validateUserId(Mocks.ID)
            .then((result) => {
                expect(result.table).to.equal('users');
                expect(result.id).to.equal(Mocks.ID);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects when user not found', function (done) {
        Validator(badGeneric).validateUserId(Mocks.ID)
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

describe('validateExperimentId', function () {
    it('resolves when experiment found', function (done) {
        Validator(generic).validateExperimentId(Mocks.ID)
            .then((result) => {
                expect(result.table).to.equal('experiments');
                expect(result.id).to.equal(Mocks.ID);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects when experiment not found', function (done) {
        Validator(badGeneric).validateExperimentId(Mocks.ID)
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

describe('validateOutputTypeId', function () {
    it('resolves when output_type found', function (done) {
        Validator(generic).validateOutputTypeId(Mocks.ID)
            .then((result) => {
                expect(result.table).to.equal('output_types');
                expect(result.id).to.equal(Mocks.ID);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects when output_type not found', function (done) {
        Validator(badGeneric).validateOutputTypeId(Mocks.ID)
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

describe('validateOutputTypeName', function () {
    it('resolves when output_type found', function (done) {
        Validator(generic).validateOutputTypeName(Mocks.OUTPUT_TYPE_NAME)
            .then((result) => {
                expect(result.table).to.equal('output_types');
                expect(result.output_type_name).to.equal(Mocks.OUTPUT_TYPE_NAME);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects when output_type not found', function (done) {
        Validator(badGeneric).validateOutputTypeName(Mocks.ID)
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

describe('validateDeviceOutputId', function () {
    it('resolves when device_output found', function (done) {
        Validator(generic).validateDeviceOutputId(Mocks.ID)
            .then((result) => {
                expect(result.table).to.equal('device_outputs');
                expect(result.id).to.equal(Mocks.ID);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects when device_output not found', function (done) {
        Validator(badGeneric).validateDeviceOutputId(Mocks.ID)
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

describe('validateGeneric', function () {
    it('resolves when output_type found', function (done) {
        Validator(generic).validateGeneric(Mocks.TABLE, Mocks.VALUE, Mocks.COLUMN)
            .then((result) => {
                var data = {table: Mocks.TABLE};
                data[Mocks.COLUMN] = Mocks.VALUE;
                expect(result.table).to.equal(data.table);
                expect(result[Mocks.COLUMN]).to.equal(data[Mocks.COLUMN]);

                done();
            })
            .catch((err) => done(err));
    });

    it('rejects when output_type not found', function (done) {
        Validator(badGeneric).validateGeneric(Mocks.ID)
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
