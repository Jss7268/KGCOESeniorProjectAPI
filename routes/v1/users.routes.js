const router = require('express').Router();
const Injector = require('../../config/injector');
const UsersController = Injector.UsersController

router.get('/users', UsersController.listUsers);
router.get('/users/access/:access', UsersController.listUsersByAccess);
router.post('/users', UsersController.createUser);
router.get('/users/me', UsersController.getSelfUser);
router.get('/users/:id', UsersController.getOneUser);
router.put('/users/:id/name', UsersController.changeName);
router.put('/users/:id/password', UsersController.changePassword);
router.put('/users/:id/email', UsersController.changeEmail);
router.put('/users/:id/access', UsersController.changeAccess);
router.delete('/users/:id', UsersController.deleteUser);

module.exports = router;