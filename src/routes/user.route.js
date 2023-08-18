const express = require('express');

//controllers
const userController = require('./../controllers/user.controller');

//middlewares
const userMiddlewares = require('./../middlewares/user.middelwares');
const validationsMiddlewares = require('./../middlewares/validations.middleware');
const authMiddleware = require('./../middlewares/auth.middleware')

const router = express.Router();

//proteccion de rutas
router.use(authMiddleware.protect)

//routes
router.get('/', userController.findAllUsers);


//proteccion de roles
router.use(authMiddleware.restrictTo('admin', 'user'))

router
  .use('/:id', userMiddlewares.validUser)
  .route('/:id')
  .get(userController.findOneUser)
  .patch(validationsMiddlewares.updateUserValidation, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
