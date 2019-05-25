const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const TestGeneric = require('../test_generic');
const UsersController = require('../../controllers/users.controller')

const user = {
  create: (ignore) => new Promise((resolve) => resolve({ id: Mocks.ID })),
  updateName: ({ id, name }) => new Promise((resolve) => resolve({ id: id, name: name })),
  updateEmail: ({ id, email }) => new Promise((resolve) => resolve({ id: id, email: email })),
  updatePassword: ({ id, password }) => new Promise((resolve) => resolve({ id: id, password: password })),
  updateAccess: ({ id, access_level }) => new Promise((resolve) => resolve({ id: id, access_level: access_level })),

  delete: ({ id }) => new Promise((resolve) => resolve({ id: id })),
  findOne: ({ id }) => new Promise((resolve) => resolve({ id: id })),
  findByAccessLevel: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT])),
  findAll: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT])),

}
const badUser = {
  create: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  updateName: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  updateEmail: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  updatePassword: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  updateAccess: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),

  delete: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  findOne: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  findByAccessLevel: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),
  findAll: (ignore) => new Promise((ignore, reject) => reject(Mocks.ERROR)),

}
const verifier = Mocks.verifier;
const badVerifier = Mocks.badVerifier;
const mockVerifier = Mocks.mockVerifier; // always resolve;

var req;
var res;

// use function instead of lambda
// https://mochajs.org/#arrow-functions
beforeEach(function () {
  req = Mocks.mockRequest();
  res = Mocks.mockResponse();
});

describe('createUser', function () {
  TestGeneric.testBadModel(UsersController.createUser, badUser, verifier);

  it('returns 201 status on success', function (done) {
    UsersController.createUser(user, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({ message: 'success! created account for new user', id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('changeName', () => {
  TestGeneric.testHydrateReqUserId(UsersController.changeName, user, verifier);
  TestGeneric.testBadModel(UsersController.changeName, badUser, verifier);

  it('returns 200 status on success', function (done) {
    UsersController.changeName(user, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        // user id because its changing current user
        expect(res.json).to.have.been.calledWith({ id: Mocks.USER_ID, name: Mocks.NAME });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('changeEmail', () => {
  TestGeneric.testHydrateReqUserId(UsersController.changeEmail, user, verifier);
  TestGeneric.testBadModel(UsersController.changeEmail, badUser, verifier);

  it('returns 200 status on success', function (done) {
    UsersController.changeEmail(user, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        // user id because its changing current user
        expect(res.json).to.have.been.calledWith({ id: Mocks.USER_ID, email: Mocks.EMAIL });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('changePassword', () => {
  TestGeneric.testHydrateReqUserId(UsersController.changePassword, user, verifier);
  TestGeneric.testBadModel(UsersController.changePassword, badUser, verifier);

  it('returns 200 status on success', function (done) {
    UsersController.changePassword(user, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        // user id because its changing current user
        expect(res.json).to.have.been.calledWith({ id: Mocks.USER_ID, password: Mocks.PASSWORD });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('changeAccess', () => {
  TestGeneric.testBadVerifier(UsersController.changeAccess, user, badVerifier);
  TestGeneric.testBadModel(UsersController.changeAccess, badUser, mockVerifier);

  it('returns 200 status on success', function (done) {
    // changing access requires admin access level;
    req.decoded.accessLevel = Mocks.ACCESS_LEVELS.admin_user;
    UsersController.changeAccess(user, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID, access_level: Mocks.ACCESS_LEVEL });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('deleteUser', () => {
  TestGeneric.testBadVerifier(UsersController.deleteUser, user, badVerifier);
  TestGeneric.testBadModel(UsersController.deleteUser, badUser, mockVerifier);

  it('returns 200 status on success', function (done) {
    // deleting user requires admin access level;
    req.decoded.accessLevel = Mocks.ACCESS_LEVELS.admin_user;
    UsersController.deleteUser(user, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: 'deleted user with id: ' + Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('getOneUser', () => {
  TestGeneric.testBadModel(UsersController.getOneUser, badUser, verifier);

  it('returns 200 status on success', function (done) {
    UsersController.getOneUser(user, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('getSelfUser', () => {
  TestGeneric.testBadModel(UsersController.getSelfUser, badUser, verifier);

  it('returns 200 status on success', function (done) {
    UsersController.getSelfUser(user, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.USER_ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listUsersByAccess', () => {
  TestGeneric.testBadModel(UsersController.listUsersByAccess, badUser, verifier);

  it('returns 200 status on success', function (done) {
    UsersController.listUsersByAccess(user, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listUsers', () => {
  TestGeneric.testBadModel(UsersController.listUsers, badUser, verifier);

  it('returns 200 status on success', function (done) {
    UsersController.listUsers(user, verifier)(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});
