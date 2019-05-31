require('dotenv').config();
process.env.NODE_ENV = 'test';


//const Mocks = require('../../integration-mocks'); <-- Currently, all tests fail if I call the userCredentials and other const/variables
//from the integaration mocks file

var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);


var token = '';
var createdId = '';

//User credentials for administrator login
const userCredentials = {
    email: 'testing@gmail.com', 
    password: 'test.1'
}

//Creates a new user
const createUser = {
    name: 'Fake Tester',
	email: 'faketester@gmail.com',
	password: 'tester.5'
}

//Modifies the created user's name
const changedName = {
    name: 'Changed Test'
}

//Modifies the created user's email
const changedEmail = {
    email: 'changedtester@gmail.com'
}

//Modifies the created user's password
const changedPassword = {
    password: 'tester.4'
}

//Modifies the created user's access level
const changedLevel = {
    access_level: '1'
}

//Integration tests for the Users Routes
describe('Users API Routes', function() {
    describe('POST api/auth/authenticate', function() {
      it('hould authenticate an admin user', function(done) {
        chai.request('http://localhost:8000')
        .post('/api/auth/authenticate')
        .send(userCredentials)
        .end(function(err, res){
          expect(res).status(200);
          expect(res.body).to.have.property('token');
          token = res.body.token;
          done();
        });
      });
    });

    describe('GET /api/v1/users/me', function() {
        it('should return user currently logged in', function(done) {
          chai.request('http://localhost:8000')
          .get('/api/v1/users/me')
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('access_level');
          done();
          });
        });
      });

    describe('GET /api/v1/users', function() {
        it('should return all users in the test db', function(done) {
          chai.request('http://localhost:8000')
          .get('/api/v1/users')
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body.length).to.equal(2);
          expect(res.body[0]).to.have.property('id');
          expect(res.body[0]).to.have.property('name');
          expect(res.body[0]).to.have.property('email');
          expect(res.body[0]).to.have.property('access_level');
          expect(res.body[1]).to.have.property('id');
          expect(res.body[1]).to.have.property('name');
          expect(res.body[1]).to.have.property('email');
          expect(res.body[1]).to.have.property('access_level');
          done();
          });
        });
      });

      describe('GET /api/v1/users/access/:access', function() {
        it('should return all users with access level 3 in the test db', function(done) {
          chai.request('http://localhost:8000')
          .get('/api/v1/users/access/3')
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body[0]).to.have.property('id');
          expect(res.body[0]).to.have.property('name');
          expect(res.body[0]).to.have.property('email');
          expect(res.body[0]).to.have.property('access_level');
          done();
          });
        });
      });

      describe('POST /api/v1/users', function() {
        it('should allow user to create a new user', function(done) {
          chai.request('http://localhost:8000')
          .post('/api/v1/users')
          .set('Authorization', 'Bearer ' + token)
          .send(createUser)
          .end(function(err, res) {
          expect(res).status(201);
          expect(res).json;
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('id');

          //save id of user that's been created
          createdId = res.body.id;

          done();
          });
        });
      });

      describe('GET /api/v1/users/:id', function() {
        it('should return user given their id', function(done) {
          chai.request('http://localhost:8000')
          .get('/api/v1/users/' + createdId)
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('access_level');
          expect(res.body).to.have.property('created_at');
          expect(res.body).to.have.property('updated_at');
          expect(res.body).to.have.property('deleted_at');
          done();
          });
        });
      });

      describe('PUT /api/v1/users/:id/name', function() {
        it('should change name of a user given their id', function(done) {
          chai.request('http://localhost:8000')
          .put('/api/v1/users/' + createdId + '/name')
          .set('Authorization', 'Bearer ' + token)
          .send(changedName)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal(changedName.name);
          done();
          });
        });
      });

      describe('PUT /api/v1/users/:id/password', function() {
        it('should change password of a user given their id', function(done) {
          chai.request('http://localhost:8000')
          .put('/api/v1/users/' + createdId + '/password')
          .set('Authorization', 'Bearer ' + token)
          .send(changedPassword)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body).to.have.property('id');
          expect(res.body.id).to.equal(createdId);
          done();
          });
        });
      });

      describe('PUT /api/v1/users/:id/email', function() {
        it('should change email of a user given their id', function(done) {
          chai.request('http://localhost:8000')
          .put('/api/v1/users/' + createdId + '/email')
          .set('Authorization', 'Bearer ' + token)
          .send(changedEmail)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body).to.have.property('email');
          expect(res.body.email).to.equal(changedEmail.email);
          done();
          });
        });
      });

      describe('PUT /api/v1/users/:id/access', function() {
        it('should change access level of a user given their id', function(done) {
          chai.request('http://localhost:8000')
          .put('/api/v1/users/' + createdId + '/access')
          .set('Authorization', 'Bearer ' + token)
          .send(changedLevel)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body).to.have.property('access_level');
          expect(res.body.access_level).to.equal(Number(changedLevel.access_level));
          done();
          });
        });
      });

      describe('DELETE /api/v1/users/:id', function() {
        it('should change name of a user given their id', function(done) {
          chai.request('http://localhost:8000')
          .delete('/api/v1/users/' + createdId)
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('deleted user with id: ' + createdId);
          done();
          });
        });
      });
});