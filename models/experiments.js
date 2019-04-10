var Promise = require('promise');
var config = require('../config/config');
var db = require('../config/db');
var bcrypt = require('bcrypt');

module.exports = {
    create: function(data) {
    var time = new Date().getTime();
    return new Promise(function(resolve, reject) {
        validateExperimentData(data)
        .then(function() {
            return db.query(
            'INSERT INTO experiments (creator_id, notes, description, created_at, updated_At) VALUES ($1, $2, $3, $4, $4) returning id',
            [data.creator_id, data.notes, data.description, time]);
        })
        .then(function(result) {
            resolve(result.rows[0]);
        })
        .catch(function(err) {
            console.log(err);
            reject(err);
        });
    });
    }
};

function validateExperimentData(data) {
    return new Promise(function(resolve, reject) {
        if (!data.description) {
            reject('Please enter a description for the experiment');
        }
        else {
            resolve();
        }
    });
}