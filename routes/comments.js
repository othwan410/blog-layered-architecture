const sequelize = require('sequelize');
const express = require('express');
const { Comments, Posts, Users } = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware.js');

router.post('/posts/:postId/comment', authMiddleware, async (req, res) => {
  try {
    if (!req.params || !req.body) {
      return res.status(412).json({
        success: false,
        errorMessage: '데이터 형식이 올바르지 않습니다.',
      });
    }

    const { postId } = req.params;
    const existsPosts = await Posts.findOne({ where: { postId } });
    if (!existsPosts) {
      return res.status(404).json({
        success: false,
        errorMessage: '게시글이 존재하지 않습니다.',
      });
    }

    const { comment } = req.body;
    if (!comment) {
      return res.status(412).json({
        success: false,
        errorMessage: '댓글 형식이 올바르지 않습니다.',
      });
    }

    const userId = res.locals.userId;

    await Comments.create({
      PostId: postId,
      UserId: userId,
      comment,
    });
    res.json({ message: '댓글을 생성하였습니다.' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      errorMessage: '댓글 작성에 실패하였습니다.',
    });
  }
});

router.get('/posts/:postId/comments', async (req, res) => {
  try {
    if (!req.params) {
      return res.status(400).json({
        success: false,
        errorMessage: "'데이터 형식이 올바르지 않습니다.'",
      });
    }
    const { postId } = req.params;

    const existsPosts = await Posts.findOne({ where: { postId } });
    if (!existsPosts) {
      return res.status(404).json({
        success: false,
        errorMessage: '게시글이 존재하지 않습니다.',
      });
    }
    const joinComments = await Comments.findAll({
      attributes: ['commentId', 'userId', 'comment', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
      ],
      where: { postId },
      order: [['createdAt', 'DESC']],
    });

    const comments = joinComments.map((item) => {
      return {
        commentId: item.commentId,
        userId: item.userId,
        nickname: item.User.nickname,
        comment: item.comment,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    res.json({ comments: comments });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      errorMessage: '댓글 조회에 실패하였습니다.',
    });
  }
});

router.put(
  '/posts/:postId/comment/:commentId',
  authMiddleware,
  async (req, res) => {
    try {
      if (!req.params || !req.body) {
        return res.status(400).json({
          success: false,
          errorMessage: "'데이터 형식이 올바르지 않습니다.'",
        });
      }

      const { postId, commentId } = req.params;
      const existsPost = await Posts.findOne({ where: { postId } });
      if (!existsPost) {
        return res.status(404).json({
          success: false,
          errorMessage: '게시글이 존재하지 않습니다.',
        });
      }

      const { comment } = req.body;
      if (!comment) {
        return res.status(412).json({
          success: false,
          errorMessage: '댓글 형식이 올바르지 않습니다.',
        });
      }

      const existsComment = await Comments.findOne({ where: { commentId } });
      const userId = res.locals.userId;
      if (existsComment) {
        if (userId === existsComment.UserId)
          await Comments.update({ comment: comment }, { where: { commentId } });
        else {
          return res.status(403).json({
            success: false,
            errorMessage: '댓글의 수정 권한이 존재하지 않습니다.',
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          errorMessage: "'댓글 조회에 실패하였습니다.'",
        });
      }
      res.json({ message: '댓글을 수정하였습니다.' });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        errorMessage: '댓글 수정에 실패하였습니다.',
      });
    }
  },
);

router.delete(
  '/posts/:postId/comment/:commentId',
  authMiddleware,
  async (req, res) => {
    try {
      if (!req.params || !req.body) {
        return res.status(400).json({
          success: false,
          errorMessage: "'데이터 형식이 올바르지 않습니다.'",
        });
      }

      const { postId, commentId } = req.params;
      const existsPost = await Posts.findOne({ where: { postId } });
      if (!existsPost) {
        return res.status(404).json({
          success: false,
          errorMessage: '게시글이 존재하지 않습니다.',
        });
      }

      const existsComment = await Comments.findOne({ where: { commentId } });
      const userId = res.locals.userId;
      if (existsComment) {
        if (userId === existsComment.UserId)
          await Comments.destroy({ where: { commentId } });
        else {
          return res.status(403).json({
            success: false,
            errorMessage: '댓글의 삭제 권한이 존재하지 않습니다.',
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          errorMessage: "'댓글 조회에 실패하였습니다.'",
        });
      }
      res.json({ message: '댓글을 삭제하였습니다.' });
    } catch (err) {
      return res.status(400).json({
        success: false,
        errorMessage: '댓글 삭제에 실패하였습니다.',
      });
    }
  },
);

module.exports = router;
