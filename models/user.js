var Promise = require('promise');
var config = require('./../config/config');
var db = require('./../config/db');
var bcrypt = require('bcrypt');
var Validator = require('../validators/validator');

module.exports = {
  findAll: function () {
    return new Promise(function (resolve, reject) {
      db.query('SELECT id, name, email FROM users where deleted_at = 0', [])
        .then(function (results) {
          resolve(results.rows);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  },

  findOne: function (data) {
    return new Promise(function (resolve, reject) {
      if (!data.id && !data.email) {
        reject('error: must provide id or email')
      }
      else {
        if (data.id) {
          findOneById(data.id)
            .then(function (result) {
              delete result.hashed_password;
              resolve(result);
            })
            .catch(function (err) {
              reject(err);
            });
        }
        else if (data.email) {
          findOneByEmail(data.email)
            .then(function (result) {
              delete result.password;
              resolve(result);
            })
            .catch(function (err) {
              reject(err);
            });
        }
      }
    });
  },

  create: function (data) {
    var time = new Date().getTime();
    return new Promise(function (resolve, reject) {
      validateUserData(data)
        .then(function () {
          return hashPassword(data.password);
        })
        .then(function (hash) {
          return db.query(
            'INSERT INTO users (name, email, hashed_password, created_at, updated_at) VALUES ($1, $2, $3, $4, $4) returning id',
            [data.name, data.email, hash, time]);
        })
        .then(function (result) {
          resolve(result.rows[0]);
        })
        .catch(function (err) {
          console.log(err);
          reject(err);
        });
    });
  },

  delete: function (data) {
    var time = new Date().getTime();
    return new Promise(function (resolve, reject) {
      db.query('UPDATE users SET deleted_at = $2 WHERE id = $1 returning id', [data.id, time])
        .then(function (result) {
          resolve(result.rows[0]);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  },

  updateName: function (data) {
    var time = new Date().getTime();
    return new Promise(function (resolve, reject) {
      Validator.validateColumns(data, ['id', 'name'])
        .then(function () {
          return db.query('UPDATE users SET name = $2, updated_at = $3 WHERE id = $1 and deleted_at = 0 returning name', [data.id, data.name, time])
        })
        .then(function (result) {
          resolve(result.rows[0]);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  },

  updateEmail: function (data) {
    var time = new Date().getTime();
    return new Promise(function (resolve, reject) {
      Validator.validateColumns(data, ['id', 'email'])
        .then(function () {
          return validateEmail(data.email)
        })
        .then(function () {
          return db.query('UPDATE users SET email = $2, updated_at = $3 WHERE id = $1 and deleted_at = 0 returning email', [data.id, data.email, time]);
        })
        .then(function (result) {
          resolve(result.rows[0]);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  },

  updatePassword: function (data) {
    var time = new Date().getTime();
    return new Promise(function (resolve, reject) {
      Validator.validateColumns(data, ['id', 'password'])
        .then(function () {
          return validatePassword(data.password, 6)
        })
        .then(function () {
          return hashPassword(data.password);
        })
        .then(function (hash) {
          return db.query('UPDATE users SET hashed_password = $2, updated_at = $3 WHERE id = $1 and deleted_at = 0 returning id', [data.id, hash, time]);
        })
        .then(function (result) {
          resolve(result.rows[0]);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  },

  authenticate: function (data) {
    return new Promise(function (resolve, reject) {
      Validator.validateColumns(data, ['email', 'password'])
        .then(function () {
          return findOneByEmail(data.email)
        })
        .then(function (user) {
          return verifyPassword(data.password, user);
        })
        .then(function (result) {
          resolve({ isAuthorized: result.isValid, id: result.id, accessLevel: result.accessLevel });
        })
        .catch(function (err) {
          reject(err);
        });
    });
  }
};

function findOneById(id) {
  return new Promise(function (resolve, reject) {
    db.query('SELECT * FROM users WHERE id = $1 and deleted_at = 0', [id])
      .then(function (result) {
        if (result.rows[0]) {
          resolve(result.rows[0]);
        }
        else {
          reject('no user found')
        }
      })
      .catch(function (err) {
        reject(err);
      });
  });
}

function findOneByEmail(email) {
  return new Promise(function (resolve, reject) {
    db.query('SELECT * FROM users WHERE email = $1 and deleted_at = 0', [email])
      .then(function (result) {
        if (result.rows[0]) {
          resolve(result.rows[0]);
        }
        else {
          reject('no user found')
        }
      })
      .catch(function (err) {
        reject(err);
      });
  });
}

function hashPassword(password) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        reject(err);
      }
      else {
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) {
            reject(err);
          }
          else {
            resolve(hash);
          }
        });
      }
    });
  });
}

function validateUserData(data) {
  return new Promise(function (resolve, reject) {
    Validator.validateColumns(data, ['email', 'password'])
      .then(function () {
        return validatePassword(data.password, 6)
      })
      .then(function () {
        return validateEmail(data.email);
      })
      .then(function () {
        resolve();
      })
      .catch(function (err) {
        reject(err);
      });
  });
}

function validateEmail(email) {
  return new Promise(function (resolve, reject) {
    if (typeof (email) !== 'string') {
      reject('email must be a string');
    }
    else {
      var re = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
      if (re.test(email)) {
        resolve();
      }
      else {
        reject('provided email does not match proper email format');
      }
    }
  });
}

function validatePassword(password, minCharacters) {
  return new Promise(function (resolve, reject) {
    if (typeof (password) !== 'string') {
      reject('password must be a string');
    }
    else if (password.length < minCharacters) {
      reject('password must be at least ' + minCharacters + ' characters long');
    }
    else {
      resolve();
    }
  });
}

function verifyPassword(password, user) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, user.hashed_password, function (err, result) {
      if (err) {
        reject(err);
      }
      else {
        resolve({ isValid: result, id: user.id, accessLevel: user.access_level });
      }
    });
  });
}