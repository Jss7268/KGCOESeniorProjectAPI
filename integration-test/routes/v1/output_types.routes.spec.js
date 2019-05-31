require('dotenv').config();
process.env.NODE_ENV = 'test';

var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var token = '';
var outputID = '';
var tempId = '';

const userCredentials = {
    email: 'testing@gmail.com', 
    password: 'test.1'
};

const new_output_type = {
    output_type_name: 'Pressure',
    units: 'PSI'
};
const changedUnitById = {
    units: 'changed'
};
const changedUnitByName = {
    units: 'PSI'
};

const temperature = {
    output_type_name: 'Temperature',
    units: 'Celcius'
};

describe('Output Types API Routes', function() {
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

    describe('POST /api/v1/output_types', function() {
        it('should create a new output type', function(done) {
          chai.request('http://localhost:8000')
          .post('/api/v1/output_types')
          .set('Authorization', 'Bearer ' + token)
          .send(new_output_type)
          .end(function(err, res) {
          expect(res).status(201);
          expect(res).json;
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('success! created new output_type');
          expect(res.body).to.have.property('id');

          outputID = res.body.id;
          done();
          });
        });
      });

      describe('POST /api/v1/output_types', function() {
        it('should return create a new output type', function(done) {
          chai.request('http://localhost:8000')
          .post('/api/v1/output_types')
          .set('Authorization', 'Bearer ' + token)
          .send(temperature)
          .end(function(err, res) {
          expect(res).status(201);
          expect(res).json;
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('success! created new device_output');
          expect(res.body).to.have.property('id');

          tempId = res.body.id;
          done();
          });
        });
      });

      describe('GET /api/v1/output_types', function() {
        it('should return a list of existing output types', function(done) {
          chai.request('http://localhost:8000')
          .get('/api/v1/output_types')
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, res) {
          expect(res).status(200);
          expect(res).json;
          expect(res.body.length).to.equal(3);
          expect(res.body[0]).to.have.property('id');
          expect(res.body[0]).to.have.property('output_type_name');
          expect(res.body[0]).to.have.property('units');
          expect(res.body[0]).to.have.property('created_at');
          expect(res.body[0]).to.have.property('updated_at');
          expect(res.body[0]).to.have.property('deleted_at');
          expect(res.body[1]).to.have.property('id');
          expect(res.body[1]).to.have.property('output_type_name');
          expect(res.body[1]).to.have.property('units');
          expect(res.body[1]).to.have.property('created_at');
          expect(res.body[1]).to.have.property('updated_at');
          expect(res.body[1]).to.have.property('deleted_at');
          expect(res.body[2]).to.have.property('id');
          expect(res.body[2]).to.have.property('output_type_name');
          expect(res.body[2]).to.have.property('units');
          expect(res.body[2]).to.have.property('created_at');
          expect(res.body[2]).to.have.property('updated_at');
          expect(res.body[2]).to.have.property('deleted_at');
          done();
          });
        });
      });

      describe('GET /api/v1/output_types/:id', function() {
        it('should return an output_type given its id', function(done) {
        chai.request('http://localhost:8000')
        .get('/api/v1/output_types/' + outputID)
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
        expect(res).status(200);
        expect(res).json;
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('output_type_name');
        expect(res.body).to.have.property('units');
        expect(res.body).to.have.property('created_at');
        expect(res.body).to.have.property('updated_at');
        expect(res.body).to.have.property('deleted_at');
        done();
        });
    });
  });

      describe('GET /api/v1/output_types/name/:output_type_name', function() {
        it('should return an output_type given its name', function(done) {
        chai.request('http://localhost:8000')
        .get('/api/v1/output_types/name/' + new_output_type.output_type_name)
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
        expect(res).status(200);
        expect(res).json;
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('output_type_name');
        expect(res.body).to.have.property('units');
        expect(res.body).to.have.property('created_at');
        expect(res.body).to.have.property('updated_at');
        expect(res.body).to.have.property('deleted_at');
        done();
        });
    });
  });

    describe('PUT /api/v1/output_types/:id/units', function() {
        it('should return an output_type given its id', function(done) {
        chai.request('http://localhost:8000')
        .put('/api/v1/output_types/' + outputID + '/units')
        .set('Authorization', 'Bearer ' + token)
        .send(changedUnitById)
        .end(function(err, res) {
        expect(res).status(200);
        expect(res).json;
        expect(res.body).to.have.property('units');
        done();
        });
    });
    });

    describe('PUT /api/v1/output_types/name/:output_type_name/units', function() {
        it('should return an output_type given its id', function(done) {
        chai.request('http://localhost:8000')
        .put('/api/v1/output_types/name/' + new_output_type.output_type_name + '/units')
        .set('Authorization', 'Bearer ' + token)
        .send(changedUnitByName)
        .end(function(err, res) {
        expect(res).status(200);
        expect(res).json;
        expect(res.body).to.have.property('units');
        done();
        });
    });
    });

    describe('DELETE /api/v1/output_types/:id', function() {
        it('should return an output_type given its id', function(done) {
        chai.request('http://localhost:8000')
        .delete('/api/v1/output_types/' + outputID)
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
        expect(res).status(200);
        expect(res).json;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('deleted output_type with id: ' + outputID)
        done();
        });
    });
    });

    describe('DELETE /api/v1/output_types/name/:output_type_name', function() {
        it('should return an output_type given its id', function(done) {
        chai.request('http://localhost:8000')
        .delete('/api/v1/output_types/name/' + temperature.output_type_name)
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
        expect(res).status(200);
        expect(res).json;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('deleted output_type with id: ' + tempId);
        done();
        });
    });
    });
})