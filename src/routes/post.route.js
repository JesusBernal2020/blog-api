const express = require('express');

// controllers
const postController = require('../controllers/post.controller');

// middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const validationsMiddleware = require('../middlewares/validations.middleware');
const postMiddleware = require('../middlewares/post.middleware');
const userMiddleware = require('../middlewares/user.middelwares');
const upload = require('./../utils/multer');

const router = express.Router();

router.route('/').get(postController.findAllPosts).post(
  upload.array('postImgs', 3), //? al utilizar el upload de multer, me va a permitir tener acceso a la req.files
  authMiddleware.protect,
  validationsMiddleware.createPostValidation,
  postController.createPost
);

router.use(authMiddleware.protect);

router.get('/me', postController.findMyPosts);

router.get(
  '/profile/:id',
  userMiddleware.validUser,
  postController.findUserPosts
);

router
  /* .use('/:id', postMiddleware.validPost) */
  .route('/:id')
  .get(postMiddleware.validPostPerFindOne, postController.findOnePost)
  .patch(
    postMiddleware.validPost,
    validationsMiddleware.createPostValidation,
    authMiddleware.protectAccountOwner,
    postController.updatePost
  )
  .delete(
    postMiddleware.validPost,
    authMiddleware.protectAccountOwner,
    postController.deletePost
  );

module.exports = router;
