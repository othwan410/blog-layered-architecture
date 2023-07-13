const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

router.get('/posts', postsController.findAllPosts);
router.get('/posts/:postId', postsController.findDetailPost);
router.get('/posts/liked/:userId', postsController.likedPosts);
router.get('/posts/:postId/liked/:userId', postsController.isLiked);
router.post('/posts/', authMiddleware, postsController.createPost);
router.put('/posts/:postId', authMiddleware, postsController.updatePost);
router.delete('/posts/:postId', authMiddleware, postsController.deletePost);
router.post('/posts/:postId/liked', authMiddleware, postsController.like);
router.delete(
  '/posts/:postId/liked',
  authMiddleware,
  postsController.likeCancel,
);

module.exports = router;
