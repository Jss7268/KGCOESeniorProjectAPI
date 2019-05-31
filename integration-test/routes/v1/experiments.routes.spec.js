require('dotenv').config();
process.env.NODE_ENV = 'test';

var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var token = '';
var experimentId = '';

const userCredentials = {
    email: 'testing@gmail.com', 
    password: 'test.1'
};

const new_experiment = {
    notes: 'Fake Test',
    description: 'Fake test description'
};

const changeStartTime = {
    start_time: '1559164461343'
};

describe('Experiments API Routes', function() {
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

    describe('POST /api/v1/experiments', function() {
        it('should create a new experiment', function(done) {
          chai.request('http://localhost:8000')
          .post('/api/v1/experiments')
          .set('Authorization', 'Bearer ' + token)
          .send(new_experiment)
          .end(function(err, res) {
          expect(res).status(201);
          expect(res).json;
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('success! created new experiment');
          expect(res.body).to.have.property('id');

          experimentId = res.body.id;
          done();
          });
        });
      });

      describe('GET /api/v1/experiments', function() {
        it('should return list of experiments', function(done) {
          chai.request('http://localhost:8000')
          .get('/api/v1/experiments')
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, res) {
          expect(res).status(200); 
          expect(res).json;
          expect(res.body.length).to.equal(3);
          expect(res.body[0]).to.have.property('id');
          expect(res.body[0]).to.have.property('creator_id');
          expect(res.body[0]).to.have.property('notes');
          expect(res.body[0]).to.have.property('description');
          expect(res.body[0]).to.have.property('created_at');
          expect(res.body[0]).to.have.property('updated_at');
          expect(res.body[0]).to.have.property('deleted_at');
          expect(res.body[0]).to.have.property('start_time');
          expect(res.body[1]).to.have.property('id');
          expect(res.body[1]).to.have.property('creator_id');
          expect(res.body[1]).to.have.property('notes');
          expect(res.body[1]).to.have.property('description');
          expect(res.body[1]).to.have.property('created_at');
          expect(res.body[1]).to.have.property('updated_at');
          expect(res.body[1]).to.have.property('deleted_at');
          expect(res.body[1]).to.have.property('start_time');
          expect(res.body[2]).to.have.property('id');
          expect(res.body[2]).to.have.property('creator_id');
          expect(res.body[2]).to.have.property('notes');
          expect(res.body[2]).to.have.property('description');
          expect(res.body[2]).to.have.property('created_at');
          expect(res.body[2]).to.have.property('updated_at');
          expect(res.body[2]).to.have.property('deleted_at');
          expect(res.body[2]).to.have.property('start_time');
          done();
          });
        });
      });

      describe('GET /api/v1/experiments/:id', function() {
        it('should return one experiment given its ID', function(done) {
          chai.request('http://localhost:8000')
          .get('/api/v1/experiments/' + experimentId)
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('creator_id');
          expect(res.body).to.have.property('notes');
          expect(res.body).to.have.property('description');
          expect(res.body).to.have.property('created_at');
          expect(res.body).to.have.property('updated_at');
          expect(res.body).to.have.property('deleted_at');
          expect(res.body).to.have.property('start_time');
          done();
          });
        });
      });

      describe('PUT /api/v1/experiments/:id/start_time', function() {
        it('should change the start time for a specific experiment given its id', function(done) {
          chai.request('http://localhost:8000')
          .put('/api/v1/experiments/' + experimentId + '/start_time')
          .set('Authorization', 'Bearer ' + token)
          .send(changeStartTime)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body).to.have.property('start_time');
          expect(res.body.start_time).to.equal(changeStartTime.start_time);
          done();
          });
        });
      });

      describe('DELETE /api/v1/experiments/:id', function() {
        it('should change the start time for a specific experiment given its id', function(done) {
          chai.request('http://localhost:8000')
          .delete('/api/v1/experiments/' + experimentId)
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('deleted experiment with id: ' + experimentId);
          done();
          });
        });
      });

});