module.exports = (UserInput, Verifier) => {
    return {
      createUserInput: (req, res) => {
        return new Promise((resolve) => {
          hydrateReq(req, Verifier)
          .then(
            Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
          )
          .then(() => {
              return UserInput.create(req.body)
            })
            .then((result) => {
              return res.status(201).json({
                message: `success! created new user input`,
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
  
      changeDescription: (req, res) => {
        return new Promise((resolve) => {
          Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
            .then(() => {
              return UserInput.updateDescription(req.body)
            })
            .then((result) => {
              return res.status(200).json(result)({
                message: `success! the description has been changed`,
                id: result.id
              });
            })
            .catch((err) => {
              return res.status(err.status || 400).json({
                message: err.message || err
              });
            })
            .catch((err) => {
              return ;
            })
            .finally(() => {
              resolve();
            });
        });

      },
  
      deleteUserInput: (req, res) => {
        return new Promise((resolve) => {
          Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
            .then(() => {
              return UserInput.delete({ id: req.params.id })
            })
            .then((result) => {
              return res.status(200).json({
                message: `deleted user input with id: ${result.id}`
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
  
      getOneUserInput: (req, res) => {
        return new Promise((resolve) => {
          UserInput.findOne({ id: req.params.id })
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
  
      listUserInputsByExperiment: (req, res) => {
        return new Promise((resolve) => {
          UserInput.findAllByExperiment(req.params)
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
  
      listUserInputsByDevice: (req, res) => {
        return new Promise((resolve) => {
          UserInput.findAllByDevice(req.params)
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
  
      listUserInputs: (req, res) => {
        return new Promise((resolve) => {
          UserInput.findAll(req.query)
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
          if (!('user_id' in req.body)) {
            req.body.user_id = req.decoded.uid;
          }
        })
        .catch(() => {
          // only an admin can fake different users
          req.body.user_id = req.decoded.uid;
        })
        .finally(() => {
          resolve();
        });
    });
  }
  