const { Op } = require('sequelize');
const { Posts, Likeds, sequelize } = require('../models');
const { Transaction } = require('sequelize');

class PostsRepository {
  //전체 게시글 조회
  findAllPosts = async () => {
    return await Posts.findAll({
      attributes: [
        'postId',
        'title',
        'likedCount',
        'createdAt',
        'updatedAt',
        [
          sequelize.literal(
            '(SELECT nickname AS nickname FROM Users WHERE Users.userId = Posts.userId)',
          ),
          'nickname',
        ],
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
    });
  };

  //게시글 상세 조회
  findDetailPost = async (postId) => {
    return await Posts.findOne({
      attributes: [
        'postId',
        'UserId',
        'title',
        'content',
        'createdAt',
        'updatedAt',
        'likedCount',
        [
          sequelize.literal(
            '(SELECT nickname AS nickname FROM Users WHERE Users.userId = Posts.userId)',
          ),
          'nickname',
        ],
      ],
      where: { postId },
    });
  };

  //게시글 수정
  updatePost = async (postId, title, content) => {
    return await Posts.update({ title, content }, { where: { postId } });
  };

  //게시글 작성
  createPost = async (userId, title, content) => {
    return await Posts.create({
      userId,
      title,
      content,
    });
  };

  //게시글 삭제
  deletePost = async (postId) => {
    return await Posts.destroy({ where: { postId } });
  };

  //좋아요한 게시글 조회
  likedPosts = async (userId) => {
    const likedPostsId = await Likeds.findAll({
      attributes: ['PostId'],
      where: { userId },
    });

    const postsId = likedPostsId.map((post) => {
      return post.PostId;
    });

    return await Posts.findAll({
      attributes: [
        'postId',
        'UserId',
        'title',
        'content',
        'likedCount',
        'createdAt',
        'updatedAt',
        [
          sequelize.literal(
            '(SELECT nickname AS nickname FROM Users WHERE Users.userId = Posts.userId)',
          ),
          'nickname',
        ],
      ],
      where: { postid: { [Op.in]: postsId } },
      order: [['likedCount', 'DESC']],
    });
  };

  //좋아요 눌렀는지 확인
  isLiked = async (postId, userId) => {
    const likedUser = await Likeds.findOne({
      where: {
        postId,
        userId,
      },
    });
    if (likedUser) return true;
    return false;
  };

  //좋아요
  like = async (userId, postId) => {
    const t = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED, // 트랜잭션 격리 수준을 설정합니다.
    });
    try {
      await Posts.update(
        { likedCount: likedCount + 1 },
        { where: { userId, postId }, transaction: t },
      );

      await Likeds.create(
        { postId, userId },
        {
          transaction: t,
        },
      );

      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      return false;
    }
  };

  //좋아요 취소
  likeCancel = async (userId, postId) => {
    const t = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED, // 트랜잭션 격리 수준을 설정합니다.
    });
    try {
      await Posts.update(
        { likedCount: likedCount - 1 },
        { where: { userId, postId }, transaction: t },
      );

      await Likeds.destroy({
        where: { postId, userId },
        transaction: t,
      });

      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      return false;
    }
  };
}

module.exports = PostsRepository;
