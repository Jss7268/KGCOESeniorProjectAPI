const promise = require('promise');

module.exports = (Experiment, Verifier) => {
  return {
    createExperiment: (req, res) => {
      return new Promise((resolve) => {
        hydrateReq(req, Verifier)
          .then(() => {
            return Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
          })
          .then(() => {
            return Experiment.create(req.body)
          })
          .then((result) => {
            return res.status(201).json({
              message: 'success! created new experiment',
              id: result.id
            });
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

    changeStartTime: (req, res) => {
      return new Promise((resolve) => {
        Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
          .then(() => {
            return Experiment.updateStartTime({ id: req.params.id, start_time: req.body.start_time })
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

    deleteExperiment: (req, res) => {
      return new Promise((resolve) => {
        Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
          .then(() => {
            return Experiment.delete({ id: req.params.id })
          })
          .then((result) => {
            return res.status(200).json({
              message: `deleted experiment with id: ${result.id}`
            });
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

    getOneExperiment: (req, res) => {
      return new Promise((resolve) => {
        Experiment.findOne({ id: req.params.id })
          .then((result) => {
            /*delete result.last_login_attempt;
            delete result.login_attempts;*/
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

    listExperiments: (req, res) => {
      return new Promise((resolve) => {
        Experiment.findAll()
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
  }
};

function hydrateReq(req, Verifier) {
  return new Promise((resolve, reject) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'admin_user')
      .then(() => {
        if (!('creator_id' in req.body)) {
          req.body.creator_id = req.decoded.uid;
        }
      })
      .catch(() => {
        // only an admin can fake different users
        req.body.creator_id = req.decoded.uid;
      })
      .finally(() => {
        resolve();
      });
  });
}
