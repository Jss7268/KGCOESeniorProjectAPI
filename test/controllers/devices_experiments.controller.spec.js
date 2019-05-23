module.exports = {
  createDeviceExperiment: (DeviceExperiment, Verifier) => (req, res) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
      .then(() => {
        return DeviceExperiment.create(req.body)
      })
      .then((result) => {
        return res.status(201).json({
          message: 'success! created new device experiment',
          experiment_id: result.experiment_id,
          device_id: result.device_id
        });
      })
      .catch((err) => {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  deleteDeviceExperiment: (DeviceExperiment, Verifier) => (req, res) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
      .then(() => {
        return DeviceExperiment.delete({ experiment_id: req.params.experiment_id,
        device_id: req.params.device_id })
      })
      .then((result) => {
        return res.status(200).json({
          message: 'deleted device experiment with experiment id: ' + result.experiment_id + 
          ' and device id: ' + result.device_id
        });
      })
      .catch((err) => {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  getOneDeviceExperiment: (DeviceExperiment, Verifier) => (req, res) => {
    DeviceExperiment.findOne({
        device_id: req.params.device_id,
        experiment_id: req.params.experiment_id
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

  getOneDeviceExperiment: (DeviceExperiment, Verifier) => (req, res) => {
    DeviceExperiment.findOne({
        device_id: req.params.device_id,
        experiment_id: req.params.experiment_id
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

  listExperimentsByDevice: (DeviceExperiment, Verifier) => (req, res) => {
    DeviceExperiment.findAllByDevice({
        device_id: req.params.device_id
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

  listDevicesByExperiment: (DeviceExperiment, Verifier) => (req, res) => {
    DeviceExperiment.findAllByExperiment({
        experiment_id: req.params.experiment_id
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


  listDevicesExperiments: (DeviceExperiment, Verifier) => (req, res) => {
    DeviceExperiment.findAll()
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
