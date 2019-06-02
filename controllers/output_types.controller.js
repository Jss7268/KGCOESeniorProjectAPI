module.exports = (OutputType, Verifier) => {
  return {
    createOutputType: (req, res) => {
      return new Promise((resolve) => {
        Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
          .then(() => {
            return OutputType.create(req.body)
          })
          .then((result) => {
            return res.status(201).json({
              message: 'success! created new output_type',
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

    changeUnits: (req, res) => {
      return new Promise((resolve) => {
        Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
          .then(() => {
            return OutputType.updateUnits({ id: req.params.id, units: req.body.units })
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

    changeUnitsName: (req, res) => {
      return new Promise((resolve) => {
        Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
          .then(() => {
            return OutputType.updateUnits({ output_type_name: req.params.output_type_name, units: req.body.units })
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

    deleteOutputType: (req, res) => {
      return new Promise((resolve) => {
        Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
          .then(() => {
            return OutputType.delete({ id: req.params.id })
          })
          .then((result) => {
            return res.status(200).json({
              message: `deleted output_type with id: ${result.id}`
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

    deleteOutputTypeName: (req, res) => {
      return new Promise((resolve) => {
        Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
          .then(() => {
            return OutputType.delete({ output_type_name: req.params.output_type_name })
          })
          .then((result) => {
            return res.status(200).json({
              message: `deleted output_type with id: ${result.id}`
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

    getOneOutputType: (req, res) => {
      return new Promise((resolve) => {
        OutputType.findOne({ id: req.params.id })
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

    getOneOutputTypeName: (req, res) => {
      return new Promise((resolve) => {
        OutputType.findOne({ output_type_name: req.params.output_type_name })
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

    listOutputTypes: (req, res) => {
      return new Promise((resolve) => {
        OutputType.findAll(req.query)
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
