const express = require('express');

//controllers
const authController = require('./../controllers/auth.controller');

// middlewares
const validationMiddleware = require('./../middlewares/validations.middleware');
const usermiddleware = require('./../middlewares/user.middelwares');
const authMiddleware = require('./../middlewares/auth.middleware');

//multer image
const upload = require('./../utils/multer')

const router = express.Router();

// ruta post, singUp
router.post(
  '/singup',
  upload.single('profileImgUrl'), //! al utilizar el upload de multer, me va a permitir tener acceso a la req.files
  validationMiddleware.createUserValidation,
  authController.singUp
);

// ruta post, singIn
router.post(
  '/singin',
  validationMiddleware.loginValidation,
  authController.singIn
);

// proteccion de rutas
router.use(authMiddleware.protect);

// ruta updatePassword
router.patch(
  '/password/:id',
  validationMiddleware.updatePasswordValidation,
  usermiddleware.validUser,
  authMiddleware.protectAccountOwner,
  authController.updatePassword
);

module.exports = router;
