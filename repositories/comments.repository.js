const { Comments, sequelize } = require('../models');

class CommentsRepository {
  //게시글 댓글 조회
  findComments = async (postId) => {
    const comments = await Comments.findAll({
      attributes: [
        'commentId',
        'userId',
        'comment',
        'createdAt',
        'updatedAt',
        [
          sequelize.literal(
            '(SELECT nickname AS nickname FROM Users WHERE Users.userId = Posts.userId)',
          ),
          'nickname',
        ],
      ],
      where: { postId },
      order: [['createdAt', 'DESC']],
    });

    return comments;
  };

  //댓글 확인
  isComment = async (commentId) => {
    const isComment = await Comments.findOne({
      where: { commentId },
    });
    return isComment;
  };

  //댓글 작성
  createComment = async (userId, postId, comment) => {
    const createComment = await Comments.create({
      postId,
      userId,
      comment,
    });

    return createComment;
  };

  //댓글 수정
  updateComment = async (commentId, comment) => {
    const updateComment = await Comments.update(
      { comment },
      { where: { commentId } },
    );

    return updateComment;
  };

  //댓글 삭제
  deleteComment = async (commentId) => {
    const deleteComment = await Comments.destroy({ where: { commentId } });

    return deleteComment;
  };
}

module.exports = CommentsRepository;
