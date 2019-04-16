var router = require('express').Router();
var UserAccess = require('../models/user_access');

module.exports = {

    verifyMinAccessLevel: (accessLevel, requiredAccessLevel) => {
        return new Promise((resolve, reject) => {
            if (!accessLevel || accessLevel < requiredAccessLevel) {
                reject({ status: 403, message: 'failed authorization. Needed access level of: ' + requiredAccessLevel + ' but was ' + accessLevel });
            } else {
                resolve();
            }
        });
    },
    verifyMinAccessName: (accessLevel, requiredName) => {
        return new Promise((resolve, reject) => {
            UserAccess.findOneByName({ access_name: requiredName })
                .then((result) => {
                    if (!accessLevel || accessLevel < result.access_level) {
                        var msg = 'failed authorization. Needed access level of: ' + requiredName;
                        UserAccess.findOne({ access_level: accessLevel })
                            .then((access) => {
                                reject({ status: 403, message: msg + ' but was: ' + access.access_name});
                            })
                            .catch(() => {
                                reject({ status: 403, message: msg });
                            })
                    } else {
                        resolve();
                    }
                })
                .catch((err) => {
                    reject(err);
                })
        });
    },

}