var Promise = require('promise');
var config = require('./../config/config');
var Verifier = require('./../validators/verifier');

module.exports = {
  createUser: (User) => (req, res) => {
    User.create(req.body)
      .then((result) => {
        return res.status(200).json({
          message: 'success! created account for new user',
          id: result.id
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  changeName: (User) => (req, res) => {
    hydrateReq(req)
      .then(() => {
        return User.updateName({ id: req.params.id, name: req.body.name })
      })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  changeEmail: (User) => (req, res) => {
    hydrateReq(req)
      .then(() => {
        return User.updateEmail({ id: req.params.id, email: req.body.email })
      })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  changePassword: (User) => (req, res) => {
    hydrateReq(req)
      .then(() => {
        return User.updatePassword({ id: req.params.id, password: req.body.password })
      })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  changeAccess: (User) => (req, res) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'admin_user')
      .then(() => {
        return User.updateAccess({id: req.params.id, access_level: req.body.access_level})
      })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  deleteUser: (User) => (req, res) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'admin_user')
      .then(() => {
        return User.delete({ id: req.params.id })
      })
      .then((result) => {
        return res.status(200).json({
          message: 'deleted user with id: ' + result.id
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  getOneUser: (User) => (req, res) => {
    User.findOne({ id: req.params.id })
      .then((result) => {
        /*delete result.last_login_attempt;
        delete result.login_attempts;*/
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  getSelfUser: (User) => (req, res) => {
    User.findOne({ id: req.decoded.uid })
      .then((result) => {
        /*delete result.last_login_attempt;
        delete result.login_attempts;*/
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  listUsers: (User) => (req, res) => {
    User.findAll()
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  listUsersByAccess: (User) => (req, res) => {
    User.findByAccessLevel(req.params.access)
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },
};

function hydrateReq(req) {
  return new Promise((resolve, reject) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'admin_user')
      .then(() => {
        if (!('id' in req.params)) {
          req.params.id = req.decoded.uid;
        }
        resolve();
      })
      .catch(() => {
        // only an admin can change update different users
        req.params.id = req.decoded.uid;
        resolve();
      })
  });

}