const CommentsService = require('../services/comments.service');

class CommentsController {
  commentsService = new CommentsService();

  //게시글 댓글 조회
  findComments = async (req, res, next) => {
    try {
      if (!req.params) {
        return res.status(400).json({
          success: false,
          errorMessage: "'데이터 형식이 올바르지 않습니다.'",
        });
      }
      const { postId } = req.params;

      const comments = await this.commentsService.findComments(postId);
      return res.status(200).json({ comments: comments });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ errorMessage: '댓글 조회에 실패했습니다.' });
    }
  };

  //댓글 작성
  createComment = async (req, res, next) => {
    try {
      if (!req.params || !req.body) {
        return res.status(412).json({
          success: false,
          errorMessage: '데이터 형식이 올바르지 않습니다.',
        });
      }
      const userId = res.locals.user;
      const { postId } = req.params;
      const { comment } = req.body;
      if (!comment) {
        return res.status(412).json({
          success: false,
          errorMessage: '댓글 형식이 올바르지 않습니다.',
        });
      }

      await this.commentsService.createComment(userId, postId, comment);
      return res.status(200).json({ message: '댓글을 생성하였습니다.' });
    } catch (error) {
      return res
        .status(400)
        .json({ errorMessage: '댓글 작성에 실패했습니다.' });
    }
  };

  //게시글 수정
  updateComment = async (req, res, next) => {
    try {
      if (!req.params || !req.body) {
        return res.status(400).json({
          success: false,
          errorMessage: "'데이터 형식이 올바르지 않습니다.'",
        });
      }

      const { comment } = req.body;
      if (!comment) {
        return res.status(412).json({
          success: false,
          errorMessage: '댓글 형식이 올바르지 않습니다.',
        });
      }

      const { postId, commentId } = req.params;
      const userId = res.locals.user;

      const isComment = await this.commentsService.isComment(commentId);
      if (!isComment) {
        return res.status(404).json({
          message: '해당 댓글이 존재하지 않습니다.',
        });
      }
      if (isComment.userId !== userId) {
        return res.status(404).json({
          message: '수정 권한이 존재하지 않습니다.',
        });
      }

      await this.commentsService.updateComment(postId, commentId, comment);

      return res.status(200).json({ message: '댓글을 수정하였습니다.' });
    } catch (error) {
      return res
        .status(400)
        .json({ errorMessage: '댓글 수정에 실패했습니다.' });
    }
  };

  //게시글 삭제
  deleteComment = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId, commentId } = req.params;

      const isComment = await this.commentsService.isComment(commentId);
      if (!isComment) {
        return res.status(404).json({
          message: '해당 댓글이 존재하지 않습니다.',
        });
      }
      if (isComment.userId !== userId) {
        return res.status(404).json({
          message: '삭제 권한이 존재하지 않습니다.',
        });
      }

      await this.commentsService.deleteComment(postId, commentId);
      return res.status(200).json({ message: '댓글을 삭제하였습니다.' });
    } catch (error) {
      return res
        .status(400)
        .json({ errorMessage: '댓글 삭제에 실패했습니다.' });
    }
  };
}

module.exports = CommentsController;
