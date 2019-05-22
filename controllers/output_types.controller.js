module.exports = {
  createOutputType: (OutputType, Verifier) => (req, res) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'authorized_device')
      .then(() => {
        return OutputType.create(req.body)
      })
      .then((result) => {
        return res.status(200).json({
          message: 'success! created new output_type',
          id: result.id
        });
      })
      .catch((err) => {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  changeUnits: (OutputType, Verifier) => (req, res) => {
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
      });
  },

  changeUnitsName: (OutputType, Verifier) => (req, res) => {
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
      });
  },

  deleteOutputType: (OutputType, Verifier) => (req, res) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
      .then(() => {
        return OutputType.delete({ id: req.params.id })
      })
      .then((result) => {
        return res.status(200).json({
          message: 'deleted output_type with id: ' + result.id
        });
      })
      .catch((err) => {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  deleteOutputTypeName: (OutputType, Verifier) => (req, res) => {
    Verifier.verifyMinAccessName(req.decoded.accessLevel, 'elevated_user')
      .then(() => {
        return OutputType.delete({ output_type_name: req.params.output_type_name })
      })
      .then((result) => {
        return res.status(200).json({
          message: 'deleted output_type with id: ' + result.id
        });
      })
      .catch((err) => {
        return res.status(err.status || 400).json({
          message: err.message || err
        });
      });
  },

  getOneOutputType: (OutputType, Verifier) => (req, res) => {
    OutputType.findOne({ id: req.params.id })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  getOneOutputTypeName: (OutputType, Verifier) => (req, res) => {
    OutputType.findOne({ output_type_name: req.params.output_type_name })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(400).json({
          message: err
        });
      });
  },

  listOutputTypes: (OutputType, Verifier) => (req, res) => {
    OutputType.findAll()
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