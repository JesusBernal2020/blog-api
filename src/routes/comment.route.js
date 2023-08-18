const express = require('express');

//controllers
const commentController = require('../controllers/comment.controller');

//middlewares
const authMiddleware = require('./../middlewares/auth.middleware');
const commentMiddleware = require('./../middlewares/comment.middleware');
const validationsMiddlewares = require('./../middlewares/validations.middleware');

const router = express.Router();

//proteccion de rutas
router.use(authMiddleware.protect);

router
  .route('/')
  .get(commentController.findAllComments)
  .post(
    validationsMiddlewares.createCommentValidation,
    commentController.createComment
  );

router
  .use('/:id', commentMiddleware.validComment)
  .route('/:id')
  .get(commentController.findOneComment)
  .patch(
    validationsMiddlewares.updateCommentValidation,
    commentController.updateComment
  )
  .delete(commentController.deleteComment);

module.exports = router;
