var router = require('express').Router();
var usersController = require('./../../controllers/users.controller');
var User = require('./../../models/user');

router.get('/users',  usersController.listUsers(User));
router.get('/users/access/:access', usersController.listUsersByAccess(User));
router.post('/users', usersController.createUser(User));
router.get('/users/me',  usersController.getSelfUser(User));
router.get('/users/:id', usersController.getOneUser(User));
router.put('/users/:id/name', usersController.changeName(User));
router.put('/users/:id/password', usersController.changePassword(User));
router.put('/users/:id/email', usersController.changeEmail(User));
router.put('/users/:id/access', usersController.changeAccess(User));
router.delete('/users/:id', usersController.deleteUser(User));

module.exports = router;