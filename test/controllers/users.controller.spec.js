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
const verifier = Mocks.verifier();
const badVerifier = Mocks.badVerifier();
const mockVerifier = Mocks.mockVerifier(); // always resolve;

var req;
var res;

// use function instead of lambda
// https://mochajs.org/#arrow-functions
beforeEach(function () {
  req = Mocks.mockRequest();
  res = Mocks.mockResponse();
});

describe('createUser', function () {
  TestGeneric.testBadModel(UsersController(badUser, verifier).createUser);

  it('returns 201 status on success', function (done) {
    UsersController(user, verifier).createUser(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({ message: 'success! created account for new user', id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('changeName', () => {
  TestGeneric.testHydrateReqUserId(UsersController(user, verifier).changeName);
  TestGeneric.testBadModel(UsersController(badUser, verifier).changeName);

  it('returns 200 status on success', function (done) {
    UsersController(user, verifier).changeName(req, res)
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
  TestGeneric.testHydrateReqUserId(UsersController(user, verifier).changeEmail);
  TestGeneric.testBadModel(UsersController(badUser, verifier).changeEmail);

  it('returns 200 status on success', function (done) {
    UsersController(user, verifier).changeEmail(req, res)
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
  TestGeneric.testHydrateReqUserId(UsersController(user, verifier).changePassword);
  TestGeneric.testBadModel(UsersController(badUser, verifier).changePassword);

  it('returns 200 status on success', function (done) {
    UsersController(user, verifier).changePassword(req, res)
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
  TestGeneric.testBadVerifier(UsersController(user, badVerifier).changeAccess);
  TestGeneric.testBadModel(UsersController(badUser, mockVerifier).changeAccess);

  it('returns 200 status on success', function (done) {
    // changing access requires admin access level;
    req.decoded.accessLevel = Mocks.ACCESS_LEVELS.admin_user;
    UsersController(user, verifier).changeAccess(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID, access_level: Mocks.ACCESS_LEVEL });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('deleteUser', () => {
  TestGeneric.testBadVerifier(UsersController(user, badVerifier).deleteUser);
  TestGeneric.testBadModel(UsersController(badUser, mockVerifier).deleteUser);

  it('returns 200 status on success', function (done) {
    // deleting user requires admin access level;
    req.decoded.accessLevel = Mocks.ACCESS_LEVELS.admin_user;
    UsersController(user, verifier).deleteUser(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: `deleted user with id: ${Mocks.ID}` });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('getOneUser', () => {
  TestGeneric.testBadModel(UsersController(badUser, verifier).getOneUser);

  it('returns 200 status on success', function (done) {
    UsersController(user, verifier).getOneUser(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('getSelfUser', () => {
  TestGeneric.testBadModel(UsersController(badUser, verifier).getSelfUser);

  it('returns 200 status on success', function (done) {
    UsersController(user, verifier).getSelfUser(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: Mocks.USER_ID });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listUsersByAccess', () => {
  TestGeneric.testBadModel(UsersController(badUser, verifier).listUsersByAccess);

  it('returns 200 status on success', function (done) {
    UsersController(user, verifier).listUsersByAccess(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('listUsers', () => {
  TestGeneric.testBadModel(UsersController(badUser, verifier).listUsers);

  it('returns 200 status on success', function (done) {
    UsersController(user, verifier).listUsers(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([Mocks.RESULT]);
        done();
      })
      .catch((err) => done(err));
  });
});
