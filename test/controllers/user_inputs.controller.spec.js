const Mocks = require('../mocks');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const TestGeneric = require('../test_generic');
const UserInputsController = require('../../controllers/user_inputs.controller');

const userInput = {
    create: (ignore) => new Promise((resolve) => resolve({ user_id: Mocks.ID })),
    updateDescription: (ignore) => new Promise((resolve) => resolve({ id: id, description: Mocks.description })),
    delete: ({ id }) => new Promise((resolve) => resolve({ id: id })),
    findOne: ({ id }) => new Promise((resolve) => resolve({ id: id })),
    findAllByExperiment: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT])),
    findAllByDevice: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT])),
    findAll: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT]))
}

const badUserInput = {
    create: (ignore) => new Promise((resolve) => resolve({ user_id: Mocks.ID })),
    updateDescription: (ignore) => new Promise((resolve) => resolve({ id: id, description: Mocks.description })),
    delete: ({ id }) => new Promise((resolve) => resolve({ id: id })),
    findOne: ({ id }) => new Promise((resolve) => resolve({ id: id })),
    findAllByExperiment: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT])),
    findAllByDevice: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT])),
    findAll: (ignore) => new Promise((resolve) => resolve([Mocks.RESULT]))
}

const verifier = Mocks.verifier();
const badVerifier = Mocks.badVerifier();

var req;
var res;

beforeEach(function () {
    req = Mocks.mockRequest();
    res = Mocks.mockResponse();
});

describe('createUserInput', function () {
    TestGeneric.testHydrateReqUserIdUserInputs(UserInputsController(userInput, verifier).createUserInput);
    TestGeneric.testBadVerifier(UserInputsController(userInput, badVerifier).createUserInput);
    TestGeneric.testBadModel(UserInputsController(badUserInput, verifier).createUserInput);

    it('should return a 201 status on success', function (done) {
        UserInputsController(userInput, verifier).createUserInput(req, res)
          .then( () => {
            expect(res.status).to.have.been.calledWith(201);
            expect(res.json).to.have.been.calledWith({  
                message: `success! created new user input`, 
                id: Mocks.ID
            });
            done();
          })
          .catch((err) => done(err));
    });
});

