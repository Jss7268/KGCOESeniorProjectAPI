require('dotenv').config();
process.env.NODE_ENV = 'test';

var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var token = '';

const userCredentials = {
    email: 'testing@gmail.com', 
    password: 'test.1'
};

const new_device_experiment = {
    experiment_id: 'ca9f19d9-c42a-4836-8f66-2ff5bb766923',
    device_id: 'e7156070-64e3-44f2-8fab-53a5a9b5765e'
};

describe('Devices Experiments API Routes', function() {
    describe('POST api/auth/authenticate', function() {
      it('should authenticate an admin user', function(done) {
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

    describe('POST /api/v1/devices_experiments', function() {
        it('should return create a new device experiment', function(done) {
          chai.request('http://localhost:8000')
          .post('/api/v1/devices_experiments')
          .set('Authorization', 'Bearer ' + token)
          .send(new_device_experiment)
          .end(function(err, res) {
          expect(res).status(201);
          expect(res).json;
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('success! created new device experiment');
          expect(res.body).to.have.property('experiment_id');
          expect(res.body.experiment_id).to.equal(new_device_experiment.experiment_id);
          expect(res.body).to.have.property('device_id');
          expect(res.body.device_id).to.equal(new_device_experiment.device_id);
          done();
          });
        });
      });

      describe('GET /api/v1/devices_experiments', function() {
        it('should return a list of existing device experiments', function(done) {
          chai.request('http://localhost:8000')
          .get('/api/v1/devices_experiments')
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body[0]).to.have.property('experiment_id');
          expect(res.body[0].experiment_id).to.equal(new_device_experiment.experiment_id);
          expect(res.body[0]).to.have.property('device_id');
          expect(res.body[0].device_id).to.equal(new_device_experiment.device_id);
          expect(res.body[0]).to.have.property('created_at');
          expect(res.body[0]).to.have.property('updated_at');
          expect(res.body[0]).to.have.property('deleted_at');
          done();
          });
        });
      });

      describe('GET /api/v1/devices_experiments/:device_id/experiments', function() {
        it('should return a list of experiments by a device id', function(done) {
          chai.request('http://localhost:8000')
          .get('/api/v1/devices_experiments/' + new_device_experiment.device_id + '/experiments')
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body.length).to.equal(2);
          expect(res.body[0]).to.have.property('id');
          expect(res.body[0].id).to.equal(new_device_experiment.experiment_id);
          expect(res.body[0]).to.have.property('creator_id');
          expect(res.body[0]).to.have.property('notes');
          expect(res.body[0]).to.have.property('description');
          expect(res.body[0]).to.have.property('created_at');
          expect(res.body[0]).to.have.property('updated_at');
          expect(res.body[0]).to.have.property('deleted_at');
          expect(res.body[0]).to.have.property('start_time');
          done();
          });
        });
      });

      describe('GET /api/v1/devices_experiments/:experiment_id/devices', function() {
        it('should return a list of devices given an experiment id', function(done) {
        chai.request('http://localhost:8000')
        .get('/api/v1/devices_experiments/' + new_device_experiment.experiment_id + '/devices')
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
        expect(res).status(200);
        expect(res).json;
        expect(res.body.length).to.equal(1);
        expect(res.body[0]).to.have.property('id');
        expect(res.body[0].id).to.equal(new_device_experiment.device_id);
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('email');
        expect(res.body[0]).to.have.property('access_level');
        done();
        });
    });
  });

      describe('GET /api/v1/devices_experiments/:device_id/:experiment_id', function() {
        it('should return a single device experiment', function(done) {
        chai.request('http://localhost:8000')
        .get('/api/v1/devices_experiments/' + new_device_experiment.device_id + '/' + new_device_experiment.experiment_id)
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
        expect(res).status(200);
        expect(res).json;
        expect(res.body).to.have.property('experiment_id');
        expect(res.body.experiment_id).to.equal(new_device_experiment.experiment_id);
        expect(res.body).to.have.property('device_id');
        expect(res.body.device_id).to.equal(new_device_experiment.device_id);
        expect(res.body).to.have.property('created_at');
        expect(res.body).to.have.property('updated_at');
        expect(res.body).to.have.property('deleted_at');
        done();
        });
    });
  });

    describe('DELETE /api/v1/devices_experiments/:device_id/:experiment_id', function() {
        it('should delete a device experiment given its id', function(done) {
        chai.request('http://localhost:8000')
        .delete('/api/v1/devices_experiments/' + new_device_experiment.device_id + '/' + new_device_experiment.experiment_id)
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
        expect(res).status(200);
        expect(res).json;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('deleted device experiment with experiment id: ' + new_device_experiment.experiment_id + 
        ' and device id: ' + new_device_experiment.device_id);
        done();
        });
    });
    });
})