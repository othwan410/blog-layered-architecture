const PostsRepository = require('../repositories/posts.repository');

class PostsService {
  postsRepository = new PostsRepository();

  //전체 게시글 조회
  findAllPosts = async () => {
    return await this.postsRepository.findAllPosts();
  };

  //게시글 상세 조회
  findDetailPost = async (postId) => {
    return await this.postsRepository.findDetailPost(postId);
  };

  //게시글 수정
  updatePost = async (postId, title, content) => {
    return await this.postsRepository.updatePost(
      userId,
      postId,
      title,
      content,
    );
  };

  //게시글 작성
  createPost = async (userId, title, content) => {
    return await this.postsRepository.createPost(userId, title, content);
  };

  //게시글 삭제
  deletePost = async (postId) => {
    return await this.postsRepository.deletePost(userId, postId);
  };

  //좋아요 게시글 조회
  likedPosts = async (userId) => {
    return await this.postsRepository.likedPosts(userId);
  };

  //좋아요 눌렀는지 확인
  isLiked = async (postId, userId) => {
    return await this.postsRepository.isLiked(postId, userId);
  };

  //좋아요
  like = async (userId, postId) => {
    return await this.postsRepository.like(userId, postId);
  };

  likeCancel = async (userId, postId) => {
    return await this.postsRepository.likeCancel(userId, postId);
  };
}

module.exports = PostsService;
