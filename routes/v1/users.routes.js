var router = require('express').Router();
var usersController = require('./../../controllers/users.controller');
var User = require('./../../models/user');
var UserAccess = require('./../../models/user_access');
var Verifier = require('../../validators/verifier')(UserAccess);

router.get('/users',  usersController.listUsers(User, Verifier));
router.get('/users/access/:access', usersController.listUsersByAccess(User, Verifier));
router.post('/users', usersController.createUser(User, Verifier));
router.get('/users/me',  usersController.getSelfUser(User, Verifier));
router.get('/users/:id', usersController.getOneUser(User, Verifier));
router.put('/users/:id/name', usersController.changeName(User, Verifier));
router.put('/users/:id/password', usersController.changePassword(User, Verifier));
router.put('/users/:id/email', usersController.changeEmail(User, Verifier));
router.put('/users/:id/access', usersController.changeAccess(User, Verifier));
router.delete('/users/:id', usersController.deleteUser(User, Verifier));

module.exports = router;