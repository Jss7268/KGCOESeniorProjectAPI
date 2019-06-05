var _db, _Validator;

const POSSIBLE_QUERY_PARAMS = [
  'access_level', 'access_name', 'description'
];

module.exports = (db, Validator) => {
  _db = db, _Validator = Validator;
  return {
    findAll: (data) => {
      let { additionalWhere, queryParamList }
        = _Validator.getWhereAndQueryParamList(data, POSSIBLE_QUERY_PARAMS);
      return new Promise((resolve, reject) => {
        _db.query(`SELECT * from user_access WHERE deleted_at = 0 ${additionalWhere}`, queryParamList)
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
            return _db.query('SELECT * from user_access WHERE access_level = $1 and deleted_at = 0', [data.access_level]);
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
            return _db.query('SELECT * from user_access WHERE access_name = $1 and deleted_at = 0', [data.access_name]);
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