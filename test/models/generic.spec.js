const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;

const Generic = require('../../models/generic');

let db;
let badDb;


// use function instead of lambda
// https://mochajs.org/#arrow-functions
beforeEach(function () {
    db = Mocks.db();
    badDb = Mocks.badDb();
})
describe('generic findAll', function () {
    it('resolves with data', function (done) {
        Generic(db).findAll(Mocks.TABLE)
            .then((result) => {
                expect(db.query).to.be.calledWith(`SELECT * FROM ${Mocks.TABLE} WHERE deleted_at = 0`, [])
                expect(result).to.be.an('array');
                expect(result[0].paramList).to.deep.equal([]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        Generic(badDb).findAll(Mocks.TABLE)
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

describe('generic findOne', function () {
    it('resolves with data', function (done) {
        Generic(db).findOne(Mocks.TABLE, { id: Mocks.ID })
            .then((result) => {
                expect(db.query).to.be.calledWith(`SELECT * FROM ${Mocks.TABLE} WHERE id = $1 and deleted_at = 0`, [Mocks.ID])
                expect(result.paramList).to.deep.equal([Mocks.ID]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no generic found', function (done) {
        var mockDb = {
            query: (ignore) => new Promise((resolve) => resolve({ rows: [] }))
        }
        Generic(mockDb).findOne(Mocks.TABLE, { id: Mocks.ID })
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(`no ${Mocks.TABLE} found`);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no id', function (done) {
        Generic(db).findOne(Mocks.TABLE, {})
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
        Generic(badDb).findOne(Mocks.TABLE, { id: Mocks.ID })
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

describe('generic findOneByColumn', function () {
    it('resolves with data', function (done) {
        Generic(db).findOneByColumn(Mocks.TABLE, Mocks.VALUE, Mocks.COLUMN)
            .then((result) => {
                expect(db.query).to.have.been.deep.calledWith(`SELECT * FROM ${Mocks.TABLE} WHERE ${Mocks.COLUMN} = $1 and deleted_at = 0`, [Mocks.VALUE])
                expect(result.paramList).to.deep.equal([Mocks.VALUE]);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects with no generic found', function (done) {
        var mockDb = {
            query: (ignore) => new Promise((resolve) => resolve({ rows: [] }))
        }
        Generic(mockDb).findOneByColumn(Mocks.TABLE, Mocks.VALUE, Mocks.COLUMN)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(`no ${Mocks.TABLE} found`);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        Generic(badDb).findOneByColumn({ id: Mocks.ID })
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

describe('generic create', function () {
    let data;

    beforeEach(function () {
        data = {
            id: Mocks.ID,
            value: Mocks.VALUE,
        };
    })

    it('resolves with data without created_at', function (done) {

        Generic(db).create(Mocks.TABLE, ['id', 'value'], data)
            .then((result) => {
                var time = result.paramList[result.paramList.length - 1];
                expect(db.query).to.have.been.deep.calledWith(
                    `INSERT INTO ${Mocks.TABLE} (id, value, updated_at, created_at) VALUES ($1, $2, $3, $4) returning id`,
                    [Mocks.ID, Mocks.VALUE, time, time]
                );
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(4);
                done();
            })
            .catch((err) => done(err));
    });

    it('resolves with data with created_at', function (done) {
        let createdAt = 99;
        data.created_at = createdAt;
        Generic(db).create(Mocks.TABLE, ['id', 'value', 'updated_at', 'created_at'], data)
            .then((result) => {
                var time = result.paramList[result.paramList.length - 2];
                expect(db.query).to.have.been.deep.calledWith(
                    `INSERT INTO ${Mocks.TABLE} (id, value, updated_at, created_at) VALUES ($1, $2, $3, $4) returning id`,
                    [Mocks.ID, Mocks.VALUE, time, createdAt]
                );
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(4);
                done();
            })
            .catch((err) => done(err));
    });

    it('resolves with data with created_at column', function (done) {
        Generic(db).create(Mocks.TABLE, ['id', 'value', 'updated_at', 'created_at'], data)
            .then((result) => {
                var time = result.paramList[result.paramList.length - 1];
                expect(db.query).to.have.been.deep.calledWith(
                    `INSERT INTO ${Mocks.TABLE} (id, value, updated_at, created_at) VALUES ($1, $2, $3, $4) returning id`,
                    [Mocks.ID, Mocks.VALUE, time, time]
                );
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(4);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        Generic(badDb).create(Mocks.TABLE, ['id', 'value'], data)
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

describe('generic delete', function () {
    it('resolves with data', function (done) {

        Generic(db).delete(Mocks.TABLE,{ id: Mocks.ID })
            .then((result) => {
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(2);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {

        Generic(badDb).delete(Mocks.TABLE,{ id: Mocks.ID })
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


describe('generic update', function () {
    let data;

    beforeEach(function () {
        data = {
            id: Mocks.ID
        };
        data[Mocks.COLUMN] = Mocks.VALUE;
    });

    it('resolves with data', function (done) {
        Generic(db).update(Mocks.TABLE, Mocks.COLUMN, data)
            .then((result) => {
                let time = result.paramList[3];
                expect(db.query).to.have.been.deep.calledWith(
                    `UPDATE ${Mocks.TABLE} SET $2 = $3, updated_at = $4 WHERE id = $1 and deleted_at = 0 returning $2`,
                    [Mocks.ID, Mocks.COLUMN, Mocks.VALUE, time]
                );
                expect(result.paramList).to.be.an('array');
                expect(result.paramList.length).to.be.equal(4);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on bad query', function (done) {
        Generic(badDb).update(Mocks.TABLE, Mocks.COLUMN, data)
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
        delete data.id;

        Generic(badDb).update(Mocks.TABLE, Mocks.COLUMN, data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(`error: id and/or ${Mocks.COLUMN} missing`);
                done();
            })
            .catch((err) => done(err));
    });

    it('rejects on missing data for column', function (done) {
        delete data[Mocks.COLUMN];
        Generic(badDb).update(Mocks.TABLE, Mocks.COLUMN, data)
            .then(() => {
                done("Did not reject");
            })
            .catch((err) => {
                expect(err).to.equal(`error: id and/or ${Mocks.COLUMN} missing`);
                done();
            })
            .catch((err) => done(err));
    });
});
