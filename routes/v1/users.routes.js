var router = require('express').Router();
var usersController = require('./../../controllers/users.controller');

router.get('/users',  usersController.listUsers);
router.get('/users/access/:access', usersController.listUsersByAccess);
router.post('/users', usersController.createUser);
router.get('/users/me',  usersController.getSelfUser);
router.get('/users/:id', usersController.getOneUser);
router.put('/users/:id/name', usersController.changeName);
router.put('/users/:id/password', usersController.changePassword);
router.put('/users/:id/email', usersController.changeEmail);
router.put('/users/:id/access', usersController.changeAccess);
router.delete('/users/:id', usersController.deleteUser);

module.exports = router;