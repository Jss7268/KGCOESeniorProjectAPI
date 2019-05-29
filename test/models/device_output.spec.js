const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;

const DeviceOutput = require('../../models/device_output');

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

describe('findAll', function () {
    it('resolves with data', function (done) {
        DeviceOutput(db, validator, deviceExperiment).findAll()
            .then((result) => {
                expect(result).to.be.an('array');
                expect(result[0].paramList).to.deep.equal([]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        DeviceOutput(badDb, validator, deviceExperiment).findAll()
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

describe('findAllByDevice', function () {
    it('resolves with data', function (done) {
        DeviceOutput(db, validator, deviceExperiment).findAllByDevice({ device_id: Mocks.DEVICE_ID })
            .then((result) => {
                expect(result).to.be.an('array');
                expect(result[0].paramList).to.deep.equal([Mocks.DEVICE_ID]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        DeviceOutput(badDb, validator, deviceExperiment).findAllByDevice({ device_id: Mocks.DEVICE_ID })
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
        DeviceOutput(db, badValidator, deviceExperiment).findAllByDevice({ device_id: Mocks.DEVICE_ID })
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

describe('findAllByExperiment', function () {
    it('resolves with data', function (done) {
        DeviceOutput(db, validator, deviceExperiment).findAllByExperiment({ experiment_id: Mocks.EXPERIMENT_ID })
            .then((result) => {
                expect(result).to.be.an('array');
                expect(result[0].paramList).to.deep.equal([Mocks.EXPERIMENT_ID]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        DeviceOutput(badDb, validator, deviceExperiment).findAllByExperiment({ experiment_id: Mocks.EXPERIMENT_ID })
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
        DeviceOutput(db, badValidator, deviceExperiment).findAllByExperiment({ experiment_id: Mocks.EXPERIMENT_ID })
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

describe('findAllByDeviceExperiment', function () {
    it('resolves with data', function (done) {
        DeviceOutput(db, validator, deviceExperiment).findAllByDeviceExperiment({ experiment_id: Mocks.EXPERIMENT_ID, device_id: Mocks.DEVICE_ID })
            .then((result) => {
                expect(result).to.be.an('array');
                expect(result[0].paramList).to.deep.equal([Mocks.DEVICE_ID, Mocks.EXPERIMENT_ID]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        DeviceOutput(badDb, validator, deviceExperiment).findAllByDeviceExperiment({ experiment_id: Mocks.EXPERIMENT_ID, device_id: Mocks.DEVICE_ID })
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

describe('findOne', function () {
    it('resolves with data', function (done) {
        DeviceOutput(db, validator, deviceExperiment).findOne({ id: Mocks.ID })
            .then((result) => {
                expect(result.paramList).to.deep.equal([Mocks.ID]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no device_output found', function (done) {
        var mockDb = {
            query: (ignore) => new Promise((resolve) => resolve({ rows: [] }))
        }
        DeviceOutput(mockDb, validator, deviceExperiment).findOne({ id: Mocks.ID })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('no device_output found');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no id', function (done) {
        DeviceOutput(db, validator, deviceExperiment).findOne({})
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
        DeviceOutput(badDb, validator, deviceExperiment).findOne({ id: Mocks.ID })
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

describe('create', function () {
    var data;
    beforeEach(function () {
        data = {
            device_id: Mocks.DEVICE_ID,
            output_value: Mocks.OUTPUT_VALUE,
            timestamp: Mocks.TIMESTAMP,
        };
    });

    it('resolves with data using output_type_id', function (done) {
        data.output_type_id = Mocks.OUTPUT_TYPE_ID;

        DeviceOutput(db, validator, deviceExperiment).create(data)
            .then((result) => {
                expect(validator.validateColumns).to.have.been.calledWith(data, ['device_id', 'output_value', 'timestamp', 'output_type_id'])
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(6);
                done();
            })
            .catch((err) => done(err));
    });

    it('resolves with data using output_type_id and experiment_id', function (done) {
        data.output_type_id = Mocks.OUTPUT_TYPE_ID;
        data.experiment_id = 'different_exp_id';

        DeviceOutput(db, validator, deviceExperiment).create(data)
            .then((result) => {
                expect(validator.validateColumns).to.have.been.calledWith(data, ['device_id', 'output_value', 'timestamp', 'output_type_id'])
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(6);
                expect(result.paramList[0]).to.be.equal(data.experiment_id);
                done();
            })
            .catch((err) => done(err));
    });

    it('resolves with data using output_type_name', function (done) {
        data.output_type_name = Mocks.OUTPUT_TYPE_NAME;

        DeviceOutput(db, validator, deviceExperiment).create(data)
            .then((result) => {
                expect(validator.validateColumns).to.have.been.calledWith(data, ['device_id', 'output_value', 'timestamp', 'output_type_name'])
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(6);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        data.output_type_id = Mocks.OUTPUT_TYPE_ID;

        DeviceOutput(badDb, validator, deviceExperiment).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.DB_ERROR);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad device experiment', function (done) {
        data.output_type_id = Mocks.OUTPUT_TYPE_ID;

        DeviceOutput(db, validator, badDeviceExperiment).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(Mocks.ERROR);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad unlinked device', function (done) {
        data.output_type_id = Mocks.OUTPUT_TYPE_ID;

        let mockDeviceExperiment = {
            findOneByDevice: () => new Promise((resolve) => resolve(null))
        }
        DeviceOutput(db, validator, mockDeviceExperiment).create(data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('Device not linked to any experiment');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad validation', function (done) {
        data.output_type_id = Mocks.OUTPUT_TYPE_ID;

        DeviceOutput(db, badValidator, deviceExperiment).findAllByExperiment(data)
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

describe('delete', function () {
    it('resolves with data', function (done) {

        DeviceOutput(db, validator, deviceExperiment).delete({id: Mocks.ID})
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(2);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        DeviceOutput(badDb, validator, deviceExperiment).delete({ id: Mocks.ID })
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


describe('updateOutputValue', function () {
    it('resolves with data', function (done) {

        DeviceOutput(db, validator, deviceExperiment).updateOutputValue({id: Mocks.ID, output_value: Mocks.OUTPUT_VALUE})
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(3);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        DeviceOutput(badDb, validator, deviceExperiment).updateOutputValue({ id: Mocks.ID, output_value: Mocks.OUTPUT_VALUE })
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

        DeviceOutput(badDb, validator, deviceExperiment).updateOutputValue({ output_value: Mocks.OUTPUT_VALUE })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('error: id and/or output_value missing');
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on missing output_value', function (done) {

        DeviceOutput(badDb, validator, deviceExperiment).updateOutputValue({ id: Mocks.ID })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal('error: id and/or output_value missing');
                done();
            })
            .catch((err) => done(err));
    });
});
