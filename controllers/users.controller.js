var Promise = require('promise');

module.exports = {
  createUser: (User, Verifier) => (req, res) => {
    return new Promise((resolve) => {
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
        })
        .finally(() => {
          resolve();
        });
    });
  },

  changeName: (User, Verifier) => (req, res) => {
    return new Promise((resolve) => {
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
        })
        .finally(() => {
          resolve();
        });
    });
  },

  changeEmail: (User, Verifier) => (req, res) => {
    return new Promise((resolve) => {
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
        })
        .finally(() => {
          resolve();
        });
    });
  },

  changePassword: (User, Verifier) => (req, res) => {
    return new Promise((resolve) => {
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
        })
        .finally(() => {
          resolve();
        });
    });
  },

  changeAccess: (User, Verifier) => (req, res) => {
    return new Promise((resolve) => {
      Verifier.verifyMinAccessName(req.decoded.accessLevel, 'admin_user')
        .then(() => {
          return User.updateAccess({ id: req.params.id, access_level: req.body.access_level })
        })
        .then((result) => {
          return res.status(200).json(result);
        })
        .catch((err) => {
          return res.status(err.status || 400).json({
            message: err.message || err
          });
        })
        .finally(() => {
          resolve();
        });
    });
  },

  deleteUser: (User, Verifier) => (req, res) => {
    return new Promise((resolve) => {
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
        })
        .finally(() => {
          resolve();
        });
    });
  },

  getOneUser: (User, Verifier) => (req, res) => {
    return new Promise((resolve) => {
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
        })
        .finally(() => {
          resolve();
        });
    });
  },

  getSelfUser: (User, Verifier) => (req, res) => {
    return new Promise((resolve) => {
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
        })
        .finally(() => {
          resolve();
        });
    });
  },

  listUsers: (User, Verifier) => (req, res) => {
    return new Promise((resolve) => {
      User.findAll()
        .then((result) => {
          return res.status(200).json(result);
        })
        .catch((err) => {
          return res.status(400).json({
            message: err
          });
        })
        .finally(() => {
          resolve();
        });
    });
  },

  listUsersByAccess: (User, Verifier) => (req, res) => {
    return new Promise((resolve) => {
      User.findByAccessLevel(req.params.access)
        .then((result) => {
          return res.status(200).json(result);
        })
        .catch((err) => {
          return res.status(400).json({
            message: err
          });
        })
        .finally(() => {
          resolve();
        });
    });
  },
};

function hydrateReq(req) {
  return new Promise((resolve) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'admin_user')
      .then(() => {
        if (!('id' in req.params)) {
          req.params.id = req.decoded.uid;
        }
      })
      .catch(() => {
        // only an admin can change update different users
        req.params.id = req.decoded.uid;
      })
      .finally(() => {
        resolve();
      });
  });
}