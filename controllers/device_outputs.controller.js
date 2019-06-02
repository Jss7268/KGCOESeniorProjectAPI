module.exports = (DeviceOutput, Verifier) => {
  return {
    createDeviceOutput: (req, res) => {
      return new Promise((resolve) => {
        hydrateReq(req);
        Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
          .then(() => {
            return DeviceOutput.create(req.body)
          })
          .then((result) => {
            return res.status(201).json({
              message: 'success! created new device_output',
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

    changeOutputValue: (req, res) => {
      return new Promise((resolve) => {
        hydrateReq(req);
        Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
          .then(() => {
            return DeviceOutput.updateOutputValue({ id: req.params.id, output_value: req.body.output_value })
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

    deleteDeviceOutput: (req, res) => {
      return new Promise((resolve) => {
        hydrateReq(req);
        Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
          .then(() => {
            return DeviceOutput.delete({ id: req.params.id })
          })
          .then((result) => {
            return res.status(200).json({
              message: `deleted device_output with id: ${result.id}`
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

    getOneDeviceOutput: (req, res) => {
      return new Promise((resolve) => {
        DeviceOutput.findOne({ id: req.params.id })
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

    listDeviceOutputsByDeviceExperiment: (req, res) => {
      return new Promise((resolve) => {
        DeviceOutput.findAllByDeviceExperiment(req.params)
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

    listDeviceOutputsByExperiment: (req, res) => {
      return new Promise((resolve) => {
        DeviceOutput.findAllByExperiment(req.params)
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

    listDeviceOutputsByDevice: (req, res) => {
      return new Promise((resolve) => {
        DeviceOutput.findAllByDevice(req.params)
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

    listDeviceOutputs: (req, res) => {
      return new Promise((resolve) => {
        DeviceOutput.findAll(req.query)
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
