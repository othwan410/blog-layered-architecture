const express = require('express');
const { Posts, Users, sequelize, Likeds } = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware.js');
const { Transaction, Op } = require('sequelize');

router.post('/posts', authMiddleware, async (req, res) => {
  try {
    if (!req.body) {
      return res.status(412).json({
        success: false,
        errorMessage: '데이터 형식이 올바르지 않습니다.',
      });
    }

    const userId = res.locals.userId;
    const { title, content } = req.body;

    if (!title) {
      return res.status(412).json({
        success: false,
        errorMessage: '게시글 제목의 형식이 일치하지 않습니다.',
      });
    }

    if (!content) {
      return res.status(412).json({
        success: false,
        errorMessage: '게시글 내용의 형식이 일치하지 않습니다.',
      });
    }

    await Posts.create({
      UserId: userId,
      title,
      content,
    });

    res.json({ message: '게시글 작성에 성공하였습니다.' });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      errorMessage: "'게시글 작성에 실패하였습니다.'",
    });
  }
});

router.get('/posts', async (req, res) => {
  try {
    const joinPosts = await Posts.findAll({
      attributes: [
        'postId',
        'UserId',
        'title',
        'content',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const posts = joinPosts.map((item) => {
      return {
        postId: item.postId,
        userId: item.User.userId,
        title: item.title,
        nickname: item.User.nickname,
        content: item.content,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    res.json({
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      errorMessage: '게시글 조회에 실패하였습니다.',
    });
  }
});

router.get('/posts/:postId', async (req, res) => {
  try {
    if (!req.params) {
      return res.status(400).json({
        success: false,
        errorMessage: "'데이터 형식이 올바르지 않습니다.'",
      });
    }

    const { postId } = req.params;
    const joinpostDetail = await Posts.findOne({
      attributes: [
        'postId',
        'UserId',
        'title',
        'content',
        'createdAt',
        'updatedAt',
        'likedCount',
      ],
      include: [
        {
          model: Users,
          attributes: ['nickname'],
          required: true,
        },
      ],
      where: { postId },
    });

    const post = [joinpostDetail].map((item) => {
      return {
        postId: item.postId,
        userId: item.User.userId,
        title: item.title,
        nickname: item.User.nickname,
        content: item.content,
        likedCount: item.likedCount,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    res.json({
      post: {
        post,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      errorMessage: '게시글 조회에 실패하였습니다.',
    });
  }
});

router.put('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    if (!req.params || !req.body) {
      return res.status(412).json({
        success: false,
        errorMessage: '데이터 형식이 올바르지 않습니다.',
      });
    }

    const userId = res.locals.userId;
    const { postId } = req.params;
    const { title, content } = req.body;

    if (!title) {
      return res.status(412).json({
        success: false,
        errorMessage: '게시글 제목의 형식이 올바르지 않습니다.',
      });
    }

    if (!content) {
      return res.status(412).json({
        success: false,
        errorMessage: '게시글 내용의 형식이 올바르지 않습니다.',
      });
    }

    const existsPost = await Posts.findOne({ where: { postId } });

    if (existsPost) {
      if (userId === existsPost.UserId) {
        await Posts.update(
          { title: title, content: content },
          { where: { postId } },
        );
      } else {
        return res.status(403).json({
          success: false,
          errorMessage: "'게시글 수정의 권한이 존재하지 않습니다.'",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        errorMessage: "'게시글 조회에 실패하였습니다.'",
      });
    }
    res.json({ message: '게시글을 수정하였습니다.' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      errorMessage: '게시글 수정에 실패하였습니다.',
    });
  }
});

router.delete('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    if (!req.params || !req.body) {
      return res.status(400).json({
        success: false,
        errorMessage: "'데이터 형식이 올바르지 않습니다.'",
      });
    }

    const userId = res.locals.userId;
    const { postId } = req.params;

    const existsPost = await Posts.findOne({ where: { postId } });

    if (existsPost) {
      if (userId === existsPost.UserId)
        await Posts.destroy({ where: { postId } });
      else {
        return res.status(403).json({
          success: false,
          errorMessage: '게시글의 삭제 권한이 존재하지 않습니다.',
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        errorMessage: '게시글 조회에 실패하였습니다.',
      });
    }
    res.json({ message: '게시글을 삭제하였습니다.' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      errorMessage: '게시글 삭제에 실패하였습니다.',
    });
  }
});

//좋아요 누른 게시물들 조회
router.get('/posts/liked/:userId', async (req, res) => {
  try {
    if (!req.params) {
      return res.status(400).json({
        success: false,
        errorMessage: "'데이터 형식이 올바르지 않습니다.'",
      });
    }

    const { userId } = req.params;
    const likedPost = await Likeds.findAll({
      attributes: ['PostId'],
      where: { userId },
    });

    const postsId = likedPost.map((post) => {
      return post.PostId;
    });

    const joinPosts = await Posts.findAll({
      attributes: [
        'postId',
        'UserId',
        'title',
        'content',
        'likedCount',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: Users,
          attributes: ['nickname'],
          required: true,
        },
      ],
      where: { postid: { [Op.in]: postsId } },
      order: [['likedCount', 'DESC']],
    });

    const posts = joinPosts.map((item) => {
      console.log(item.User);
      return {
        postId: item.postId,
        userId: item.User.userId,
        title: item.title,
        nickname: item.User.nickname,
        likedCount: item.likedCount,
        content: item.content,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    res.json({
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      errorMessage: '게시글 조회에 실패하였습니다.',
    });
  }
});

router.get('/posts/:postId/liked/:userId', async (req, res) => {
  try {
    const { postId, userId } = req.params;
    const likedUser = await Likeds.findOne({
      where: {
        postId,
        userId,
      },
    });
    if (likedUser) {
      res.json({
        isLiked: true,
      });
    } else {
      res.json({
        isLiked: false,
      });
    }
  } catch {
    return res.status(400).json({
      success: false,
      errorMessage: '좋아요 확인 오류',
    });
  }
});

router.post('/posts/:postId/liked', authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.userId;
    const { postId } = req.params;

    const post = await Posts.findOne({ where: { postId } });

    if (post) {
      const t = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED, // 트랜잭션 격리 수준을 설정합니다.
      });
      try {
        await post.update(
          { likedCount: post.likedCount + 1 },
          { where: { UserId: userId, PostId: postId }, transaction: t },
        );

        await Likeds.create(
          { PostId: post.postId, UserId: userId },
          {
            transaction: t,
          },
        );

        await t.commit();
        return res.json({ message: '게시글 좋아요에 성공했습니다.' });
      } catch (error) {
        console.log(error);
        await t.rollback();
        return res
          .status(400)
          .json({ errorMessage: `게시글 좋아요에 실패하였습니다.` });
      }
    } else {
      return res.status(404).json({
        success: false,
        errorMessage: '게시글 조회에 실패하였습니다.',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      errorMessage: '오류가 발생했습니다.',
    });
  }
});

router.delete('/posts/:postId/liked', authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.userId;
    const { postId } = req.params;

    const post = await Posts.findOne({ where: { postId } });

    if (post) {
      const t = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED, // 트랜잭션 격리 수준을 설정합니다.
      });

      try {
        await post.update(
          { likedCount: post.likedCount - 1 },
          { where: { UserId: userId, PostId: postId }, transaction: t },
        );

        await Likeds.destroy({
          where: { UserId: userId, PostId: postId },
          transaction: t,
        });

        await t.commit();
        return res.json({ message: '게시글 좋아요에 성공했습니다.' });
      } catch (error) {
        console.log(error);
        await t.rollback();
        return res
          .status(400)
          .json({ errorMessage: `게시글 좋아요에 실패하였습니다.` });
      }
    } else {
      return res.status(404).json({
        success: false,
        errorMessage: '게시글 조회에 실패하였습니다.',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      errorMessage: '게시글 좋아요 취소에 실패하였습니다.',
    });
  }
});

module.exports = router;
