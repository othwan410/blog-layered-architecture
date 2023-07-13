const PostsService = require('../services/posts.service');

class PostsController {
  postsService = new PostsService();

  //게시글 전체 조회
  findAllPosts = async (req, res, next) => {
    try {
      const posts = await this.postsService.findAllPosts();
      return res.status(200).json({ data: posts });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        errorMessage: '게시글 조회에 실패하였습니다.',
      });
    }
  };

  //게시글 상세 조회
  findDetailPost = async (req, res, next) => {
    try {
      if (!req.params) {
        return res.status(400).json({
          success: false,
          errorMessage: "'데이터 형식이 올바르지 않습니다.'",
        });
      }
      const { postId } = req.params;
      const post = await this.postsService.findDetailPost(postId);
      return res.status(200).json({ post: { post } });
    } catch (error) {
      return res.status(400).json({
        success: false,
        errorMessage: '게시글 조회에 실패하였습니다.',
      });
    }
  };

  //게시글 작성
  createPost = async (req, res, next) => {
    try {
      if (!req.body) {
        return res.status(412).json({
          success: false,
          errorMessage: '데이터 형식이 올바르지 않습니다.',
        });
      }

      const userId = res.locals.user;
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

      const createPost = await this.postsService.createPost(
        userId,
        title,
        content,
      );

      return res.status(201).json({ message: '게시글 작성에 성공하였습니다.' });
    } catch (error) {
      return res.status(400).json({
        success: false,
        errorMessage: "'게시글 작성에 실패하였습니다.'",
      });
    }
  };

  //게시글 수정
  updatePost = async (req, res, next) => {
    try {
      if (!req.params || !req.body) {
        return res.status(412).json({
          success: false,
          errorMessage: '데이터 형식이 올바르지 않습니다.',
        });
      }

      const userId = res.locals.user;
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

      const updatePost = await this.postsService.updatePost(
        userId,
        postId,
        title,
        content,
      );

      if (!updatePost) {
        return res.status(400).json({ message: '게시글 수정에 실패했습니다.' });
      }
      return res.status(201).json({ message: '게시글 수정에 성공했습니다.' });
    } catch (error) {
      return res
        .status(400)
        .json({ errorMessage: '게시글 수정에 실패했습니다.' });
    }
  };

  //게시글 삭제
  deletePost = async (req, res, next) => {
    try {
      if (!req.params || !req.body) {
        return res.status(400).json({
          success: false,
          errorMessage: "'데이터 형식이 올바르지 않습니다.'",
        });
      }

      const userId = res.locals.user;
      const { postId } = req.params;
      const deletePost = await this.postsService.deletePost(userId, postId);

      if (!deletePost) {
        return res.status(400).json({ message: '게시글 삭제에 실패했습니다.' });
      }
      return res.status(201).json({ message: '게시글 삭제에 성공했습니다.' });
    } catch (error) {
      return res
        .status(400)
        .json({ errorMessage: '게시글 삭제에 실패했습니다.' });
    }
  };

  //좋아요 게시글 조회
  likedPosts = async (req, res, next) => {
    try {
      if (!req.params) {
        return res.status(400).json({
          success: false,
          errorMessage: "'데이터 형식이 올바르지 않습니다.'",
        });
      }

      const { userId } = req.params;
      const likedPosts = await this.postsService.likedPosts(userId);
      return res.status(200).json({ data: likedPosts });
    } catch (error) {
      return res
        .status(400)
        .json({ errorMessage: '좋아요 게시글 조회에 실패했습니다.' });
    }
  };

  isLiked = async (req, res, next) => {
    try {
      if (!req.params) {
        return res.status(400).json({
          success: false,
          errorMessage: "'데이터 형식이 올바르지 않습니다.'",
        });
      }

      const { userId, postId } = req.params;
      const likedPosts = await this.postsService.isLiked(userId, postId);
      return res.status(200).json({ data: likedPosts });
    } catch (error) {
      return res
        .status(400)
        .json({ errorMessage: '좋아요 게시글 조회에 실패했습니다.' });
    }
  };

  //좋아요
  like = async (req, res, next) => {
    try {
      if (!req.params) {
        return res.status(400).json({
          success: false,
          errorMessage: "'데이터 형식이 올바르지 않습니다.'",
        });
      }
      const { postId } = req.params;
      const userId = res.locals.user;

      await this.postsService.like(userId, postId);

      return res.status(201).json({ message: '게시글 좋아요에 성공했습니다.' });
    } catch (error) {
      return res
        .status(400)
        .json({ errorMessage: `게시글 좋아요에 실패하였습니다.` });
    }
  };

  likeCancel = async (req, res, next) => {
    try {
      if (!req.params) {
        return res.status(400).json({
          success: false,
          errorMessage: "'데이터 형식이 올바르지 않습니다.'",
        });
      }
      const { postId } = req.params;
      const userId = res.locals.user;
      await this.postsService.likeCancel(userId, postId);

      return res
        .status(201)
        .json({ message: '게시글 좋아요 취소에 성공했습니다.' });
    } catch (error) {
      return res
        .status(400)
        .json({ errorMessage: `게시글 좋아요 취소에 실패하였습니다.` });
    }
  };
}

module.exports = PostsController;
