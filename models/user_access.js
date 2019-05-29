var _db, _Validator;

module.exports = (db, Validator) => {
  _db = db, _Validator = Validator;
  return {
    findAll: function () {
      return new Promise((resolve, reject) => {
        _db.query('SELECT * from user_access', [])
          .then((result) => {
            resolve(result.rows);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    findOne: (data) => {
      return new Promise((resolve, reject) => {
        _Validator.validateColumns(data, ['access_level'])
          .then(() => {
            return _db.query('SELECT * from user_access where access_level = $1', [data.access_level])
          })
          .then((result) => {
            if (result.rows[0]) {
              resolve(result.rows[0]);
            }
            else {
              reject('no user_access found')
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    findOneByName: (data) => {
      return new Promise((resolve, reject) => {
        _Validator.validateColumns(data, ['access_name'])

          .then(() => {
            return _db.query('SELECT * from user_access where access_name = $1', [data.access_name])
          })
          .then((result) => {
            if (result.rows[0]) {
              resolve(result.rows[0]);
            }
            else {
              reject('no user_access found')
            }
          })
          .catch((err) => {

            reject(err);
          });
      });
    },
  }
}