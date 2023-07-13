const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const CommentsController = require('../controllers/comments.controller');
const commentsController = new CommentsController();

router.get('/posts/:postId/comments', commentsController.findComments);
router.post(
  '/posts/:postId/comments/',
  authMiddleware,
  commentsController.createComment,
);
router.put(
  '/posts/:postId/comments/:commentId',
  authMiddleware,
  commentsController.updateComment,
);
router.delete(
  '/posts/:postId/comments/:commentId',
  authMiddleware,
  commentsController.deleteComment,
);

module.exports = router;
