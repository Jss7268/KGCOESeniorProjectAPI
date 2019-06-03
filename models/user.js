var _db, _UserAccess, _Validator, _bcrypt;
const POSSIBLE_QUERY_PARAMS = [
  'name', 'email', 'access_level', 'requested_access_level', 'requested_reason'
];

module.exports = (db, Validator, UserAccess, bcrypt) => {
  _db = db, _UserAccess = UserAccess, _Validator = Validator, _bcrypt = bcrypt;

  return {
    findAll: (data) => {
      let { additionalWhere, queryParamList }
        = _Validator.getWhereAndQueryParamList(data, POSSIBLE_QUERY_PARAMS);
      return new Promise((resolve, reject) => {
        _db.query(`SELECT * FROM sanitized_users WHERE deleted_at = 0 ${additionalWhere}`, queryParamList)
          .then((results) => {
            resolve(results.rows);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    findByAccessLevel: (accessLevel) => {
      return new Promise((resolve, reject) => {
        _db.query('SELECT * FROM sanitized_users WHERE access_level = $1 and deleted_at = 0', [accessLevel])
          .then((results) => {
            resolve(results.rows);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    findOne: (data) => {
      return new Promise((resolve, reject) => {
        if (!data.id && !data.email) {
          reject('error: must provide id or email')
        }
        else {
          if (data.id) {
            findOneById(data.id)
              .then((result) => {
                delete result.hashed_password;
                resolve(result);
              })
              .catch((err) => {
                reject(err);
              });
          } else {
            findOneByEmail(data.email)
              .then((result) => {
                delete result.hashed_password;
                resolve(result);
              })
              .catch((err) => {
                reject(err);
              });
          }
        }
      });
    },

    create: (data) => {
      var time = new Date().getTime();
      return new Promise((resolve, reject) => {
        validateUserData(data)
          .then(function () {
            return hashPassword(data.password);
          })
          .then((hash) => {
            return _db.query(
              'INSERT INTO users (name, email, hashed_password, requested_access_level, requested_reason, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $6) returning id',
              [data.name, data.email, hash, data.requested_access_level, data.requested_reason, time]);
          })
          .then((result) => {
            resolve(result.rows[0]);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },

    delete: (data) => {
      var time = new Date().getTime();
      return new Promise((resolve, reject) => {
        _db.query('UPDATE users SET deleted_at = $2 WHERE id = $1 returning id', [data.id, time])
          .then((result) => {
            resolve(result.rows[0]);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    updateName: (data) => {
      var time = new Date().getTime();
      return new Promise((resolve, reject) => {
        _Validator.validateColumns(data, ['id', 'name'])
          .then(function () {
            return _db.query('UPDATE users SET name = $2, updated_at = $3 WHERE id = $1 and deleted_at = 0 returning name', [data.id, data.name, time])
          })
          .then((result) => {
            resolve(result.rows[0]);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    updateEmail: (data) => {
      var time = new Date().getTime();
      return new Promise((resolve, reject) => {
        _Validator.validateColumns(data, ['id', 'email'])
          .then(function () {
            return validateEmail(data.email)
          })
          .then(function () {
            return _db.query('UPDATE users SET email = $2, updated_at = $3 WHERE id = $1 and deleted_at = 0 returning email', [data.id, data.email, time]);
          })
          .then((result) => {
            resolve(result.rows[0]);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    updatePassword: (data) => {
      var time = new Date().getTime();
      return new Promise((resolve, reject) => {
        _Validator.validateColumns(data, ['id', 'password'])
          .then(function () {
            return validatePassword(data.password, 6)
          })
          .then(function () {
            return hashPassword(data.password);
          })
          .then((hash) => {
            return _db.query('UPDATE users SET hashed_password = $2, updated_at = $3 WHERE id = $1 and deleted_at = 0 returning id', [data.id, hash, time]);
          })
          .then((result) => {
            resolve(result.rows[0]);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    authenticate: (data) => {
      return new Promise((resolve, reject) => {
        _Validator.validateColumns(data, ['email', 'password'])
          .then(function () {
            return findOneByEmail(data.email)
          })
          .then((user) => {
            return verifyPassword(data.password, user);
          })
          .then((result) => {
            resolve({ isAuthorized: result.isValid, id: result.id, accessLevel: result.accessLevel });
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    updateAccess: (data) => {
      var time = new Date().getTime();
      return new Promise((resolve, reject) => {
        _Validator.validateColumns(data, ['id', 'access_level'])
          .then(function () {
            return validateAccessLevel(data)
          })
          .then(function () {
            return _db.query('UPDATE users SET access_level = $2, updated_at = $3, requested_access_level = NULL WHERE id = $1 and deleted_at = 0 returning access_level', [data.id, data.access_level, time]);
          })
          .then((result) => {
            resolve(result.rows[0]);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    rejectRequestedAccessLevel: (data) => {
      var time = new Date().getTime();
      return new Promise((resolve, reject) => {
        _Validator.validateColumns(data, ['id'])
          .then(function () {
            return _db.query('UPDATE users SET requested_access_level = NULL, updated_at = $2 WHERE id = $1 and deleted_at = 0 returning access_level', [data.id, time]);
          })
          .then((result) => {
            resolve(result.rows[0]);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
};

function findOneById(id) {
  return new Promise((resolve, reject) => {
    _db.query('SELECT * FROM users WHERE id = $1 and deleted_at = 0', [id])
      .then((result) => {
        if (result.rows[0]) {
          resolve(result.rows[0]);
        }
        else {
          reject('no user found')
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function findOneByEmail(email) {
  return new Promise((resolve, reject) => {
    _db.query('SELECT * FROM users WHERE email = $1 and deleted_at = 0', [email])
      .then((result) => {
        if (result.rows[0]) {
          resolve(result.rows[0]);
        }
        else {
          reject('no user found')
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    _bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      }
      else {
        _bcrypt.hash(password, salt, (err, hash) => {
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
  return new Promise((resolve, reject) => {
    _Validator.validateColumns(data, ['email', 'password', 'name'])
      .then(() => {
        return validatePassword(data.password, 6);
      })
      .then(() => {
        return validateEmail(data.email);
      })
      .then(() => {
        if (!('requested_access_level' in data)) {
          data.requested_access_level = null;
          return new Promise((resolve) => resolve());
        }
        return validateAccessLevel({access_level: data.requested_access_level});
      })
      .then(() => {
        if (!('requested_reason' in data)) {
          data.requested_reason = null;
          return new Promise((resolve) => resolve());
        }
        return validateRequestedReason(data.requested_reason);
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function validateEmail(email) {
  return new Promise((resolve, reject) => {
    if (typeof (email) !== 'string') {
      reject('email must be a string');
    }
    if (email.length > 255) {
      reject('email must be less than 256 characters long');
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
  return new Promise((resolve, reject) => {
    if (typeof (password) !== 'string') {
      reject('password must be a string');
    }
    else if (password.length < minCharacters) {
      reject(`password must be at least ${minCharacters} characters long`);
    }
    else {
      resolve();
    }
  });
}

function verifyPassword(password, user) {
  return new Promise((resolve, reject) => {
    _bcrypt.compare(password, user.hashed_password, (err, result) => {
      if (err) {
        reject(err);
      }
      else {
        resolve({ isValid: result, id: user.id, accessLevel: user.access_level });
      }
    });
  });
}

function validateAccessLevel(data) {
  return new Promise((resolve, reject) => {
    _UserAccess.findOne(data)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err); // todo better error message
      })
  })
}

function validateRequestedReason(requestedReason) {
  return new Promise((resolve, reject) => {
    if (requestedReason.length > 255) {
      reject('requested reason must be less than 256 characters long');
    } else {
      resolve();
    }
  })
}