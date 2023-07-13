const CommentsRepository = require('../repositories/comments.repository');

class CommentsService {
  commentsRepository = new CommentsRepository();
  //게시글 댓글 조회
  findComments = async (postId) => {
    const comments = await this.commentsRepository.findComments(postId);

    return comments;
  };

  //댓글 작성
  createComment = async (userId, postId, comment) => {
    const createComment = await this.commentsRepository.createComment(
      userId,
      postId,
      comment,
    );
    return createComment;
  };

  //댓글 확인
  isComment = async (commentId) => {
    const isComment = await this.commentsRepository.isComment(commentId);

    return isComment;
  };

  //댓글 수정
  updateComment = async (postId, commentId, comment) => {
    const updateComment = await this.commentsRepository.updateComment(
      postId,
      commentId,
      comment,
    );

    return updateComment;
  };

  //댓글 삭제
  deleteComment = async (postId, commentId) => {
    const deleteComment = await this.commentsRepository.deleteComment(
      postId,
      commentId,
    );

    return deleteComment;
  };
}

module.exports = CommentsService;
