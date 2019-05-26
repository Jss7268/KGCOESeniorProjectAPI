var router = require('express').Router();
var usersController = require('./../../controllers/users.controller');
var User = require('./../../models/user');
var UserAccess = require('./../../models/user_access');
var Verifier = require('../../validators/verifier')(UserAccess);

router.get('/users',  usersController(User, Verifier).listUsers);
router.get('/users/access/:access', usersController(User, Verifier).listUsersByAccess);
router.post('/users', usersController(User, Verifier).createUser);
router.get('/users/me',  usersController(User, Verifier).getSelfUser);
router.get('/users/:id', usersController(User, Verifier).getOneUser);
router.put('/users/:id/name', usersController(User, Verifier).changeName);
router.put('/users/:id/password', usersController(User, Verifier).changePassword);
router.put('/users/:id/email', usersController(User, Verifier).changeEmail);
router.put('/users/:id/access', usersController(User, Verifier).changeAccess);
router.delete('/users/:id', usersController(User, Verifier).deleteUser);

module.exports = router;