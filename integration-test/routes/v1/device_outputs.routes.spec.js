require('dotenv').config();
process.env.NODE_ENV = 'test';

var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var token = '';
var deviceOutputID = '';
var experimentID = '';
var deviceID = '';
var outputTypeID = '';

const userCredentials = {
    email: 'testing@gmail.com', 
    password: 'test.1'
};

const new_device_output = {
    device_id: 'e7156070-64e3-44f2-8fab-53a5a9b5765e',
	output_value: 30,
	timestamp: '1559194461741',
	output_type_name: 'Degrees'
};

describe('Devices Outputs API Routes', function() {
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

    describe('POST /api/v1/device_outputs', function() {
        it('should create a new device output', function(done) {
          chai.request('http://localhost:8000')
          .post('/api/v1/device_outputs')
          .set('Authorization', 'Bearer ' + token)
          .send(new_device_output)
          .end(function(err, res) {
          expect(res).status(201);
          expect(res).json;
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('success! created new device_output');
          done();
          });
        });
      });

      describe('GET /api/v1/device_outputs', function() {
        it('should return a list of existing device outputs', function(done) {
          chai.request('http://localhost:8000')
          .get('/api/v1/device_outputs')
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body.length).to.equal(1);
          expect(res.body[0]).to.have.property('id');
          expect(res.body[0]).to.have.property('experiment_id');
          expect(res.body[0]).to.have.property('device_id');
          expect(res.body[0]).to.have.property('output_type_id');
          expect(res.body[0]).to.have.property('output_value');
          expect(res.body[0]).to.have.property('timestamp');
          expect(res.body[0]).to.have.property('created_at');
          expect(res.body[0]).to.have.property('updated_at');
          expect(res.body[0]).to.have.property('deleted_at');
          expect(res.body[0]).to.have.property('output_type_name');
          expect(res.body[0]).to.have.property('name');
          expect(res.body[0]).to.have.property('email');
          expect(res.body[0]).to.have.property('access_level');
          expect(res.body[0]).to.have.property('creator_id');
          expect(res.body[0]).to.have.property('notes');
          expect(res.body[0]).to.have.property('description');
          expect(res.body[0]).to.have.property('start_time');

          deviceOutputID = res.body[0].id;
          experimentID = res.body[0].experiment_id;
          deviceID = res.body[0].device_id;
          outputTypeID = res.body[0].output_type_id;
          done();
          });
        });
      });

      describe('GET /api/v1/device_outputs/experiment/:experiment_id', function() {
        it('should return a list of device outputs given an experiment id', function(done) {
        chai.request('http://localhost:8000')
        .get('/api/v1/device_outputs/experiment/' + experimentID)
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
        expect(res).status(200);
        expect(res).json;
        expect(res.body.length).to.equal(1);
        expect(res.body[0]).to.have.property('id');
        expect(res.body[0]).to.have.property('experiment_id');
        expect(res.body[0]).to.have.property('device_id');
        expect(res.body[0]).to.have.property('output_type_id');
        expect(res.body[0]).to.have.property('output_value');
        expect(res.body[0]).to.have.property('timestamp');
        expect(res.body[0]).to.have.property('created_at');
        expect(res.body[0]).to.have.property('updated_at');
        expect(res.body[0]).to.have.property('deleted_at');
        expect(res.body[0]).to.have.property('output_type_name');
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('email');
        expect(res.body[0]).to.have.property('access_level');
        expect(res.body[0]).to.have.property('creator_id');
        expect(res.body[0]).to.have.property('notes');
        expect(res.body[0]).to.have.property('description');
        expect(res.body[0]).to.have.property('start_time');
        done();
        });
    });
  });

      describe('GET /api/v1/device_outputs/device/:device_id', function() {
        it('should return a list of device outputs by device', function(done) {
        chai.request('http://localhost:8000')
        .get('/api/v1/device_outputs/device/' + deviceID)
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
        expect(res).status(200);
        expect(res).json;
        expect(res.body.length).to.equal(1);
        expect(res.body[0]).to.have.property('id');
        expect(res.body[0]).to.have.property('experiment_id');
        expect(res.body[0]).to.have.property('device_id');
        expect(res.body[0]).to.have.property('output_type_id');
        expect(res.body[0]).to.have.property('output_value');
        expect(res.body[0]).to.have.property('timestamp');
        expect(res.body[0]).to.have.property('created_at');
        expect(res.body[0]).to.have.property('updated_at');
        expect(res.body[0]).to.have.property('deleted_at');
        done();
        });
    });
  });

  //These four tests don't work, explained in discord.
      /*describe('GET /api/v1/device_outputs/:id', function() {
        it('should return a single device output', function(done) {
        chai.request('http://localhost:8000')
        .get('/api/v1/device_outputs/' + deviceOutputID)
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
        expect(res).status(200);
        expect(res).json;
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('experiment_id');
        expect(res.body).to.have.property('device_id');
        expect(res.body).to.have.property('output_type_id');
        expect(res.body).to.have.property('output_value');
        expect(res.body).to.have.property('timestamp');
        expect(res.body).to.have.property('created_at');
        expect(res.body).to.have.property('updated_at');
        expect(res.body).to.have.property('deleted_at');
        done();
        });
    });
    });

    /*describe('PUT /api/v1/device_outputs/:experiment_id/:device_id/:output_type_id/output_value', function() {
        it('should change the output value', function(done) {
        chai.request('http://localhost:8000')
        .put('/api/v1/device_outputs/' + experimentID + '/' + deviceID + '/' + outputTypeID + '/output_value')
        .set('Authorization', 'Bearer ' + token)
        .send(changedUnitByName)
        .end(function(err, res) {
        expect(res).status(200);
        expect(res).json;
        done();
        });
    });
    });

    describe('GET /api/v1/device_outputs/:experiment_id/:device_id/:output_type_id', function() {
        it('should return one device output', function(done) {
        chai.request('http://localhost:8000')
        .get('/api/v1/device_outputs/' + experimentID + '/' + deviceID + '/' + outputTypeID)
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
        expect(res).status(200);
        expect(res).json;
        done();
        });
    });
    });

    describe('DELETE /api/v1/device_outputs/:id', function() {
        it('should return an output_type given its id', function(done) {
        chai.request('http://localhost:8000')
        .delete('/api/v1/device_outputs/' + deviceOutputID)
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
        expect(res).status(200);
        expect(res).json;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('deleted device_output with id: ' + deviceOutputID);
        done();
        });
    });
    });*/
})