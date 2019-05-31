module.exports = (UserInput, Verifier) => {
    return {
      createUserInput: (req, res) => {
        return new Promise((resolve) => {
          hydrateReq(req);
          Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
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
  
      changeDecsription: (req, res) => {
        return new Promise((resolve) => {
          hydrateReq(req);
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
          hydrateReq(req);
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
  
      listUserInputsByDeviceExperiment: (req, res) => {
        return new Promise((resolve) => {
          UserInput.findAllBy_DeviceExperiment(req.params)
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
          UserInput.findAll()
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
  
  function hydrateReq(req) {
    // TODO don't hardcode 1 for authorized_device
    if (req.decoded.accessLevel == 1) {
      // devices can only manipulate data for themselves
      req.body.device_id = req.decoded.uid
    }
  }
  