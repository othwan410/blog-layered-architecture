const express = require("express");
const { Posts, Users } = require("../models");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware.js");

router.post("/posts", authMiddleware, async (req, res) => {
try {
  if (!req.body) {
    return res.status(412).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  }
  
  const { userId } = res.locals.user;
  const { title, content } = req.body;

  if (!title) {
    return res.status(412).json({
      success: false,
      errorMessage: "게시글 제목의 형식이 일치하지 않습니다.",
    });
  }

  if (!content) {
    return res.status(412).json({
      success: false,
      errorMessage: "게시글 내용의 형식이 일치하지 않습니다.",
    });
  }

  await Posts.create({
    UserId : userId,
    title,
    content,
  });

  res.json({ message: "게시글 작성에 성공하였습니다." });
} catch (error) {
  console.log(error);
  return res.status(404).json({
    success: false,
    errorMessage: "'게시글 조회에 실패하였습니다.'",
  });
}
});

router.get("/posts", async (req, res) => {
  const posts = await Posts.findAll({ 
    attributes: ["postId", "UserId",  "title", "content", "createdAt", "updatedAt"],
    include: [
      {
      model: Users,
      attributes: ["nickname"],
      },
    ],
    order : [["createdAt", "DESC"]]
  });

  const prPosts = posts.map((item) => {
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
    data: prPosts,
  });

});

router.get("/posts/:postId", async (req, res) => {
  try {
    if (!req.params) {
      return res.status(400).json({
        success: false,
        errorMessage: "'데이터 형식이 올바르지 않습니다.'",
      });
    }
  
    const { postId } = req.params;
    const postDetail = await Posts.findOne({
      attributes: ["postId", "UserId",  "title", "content", "createdAt", "updatedAt"],
      include: [
      {
      model: Users,
      attributes: ["nickname"],
      },
      ],
      where: { postId },
    });
  
    const prPost = [postDetail].map((item) => {
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
      post : {
        prPost
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      errorMessage: "게시글 조회에 실패하였습니다.",
    });
  }
});

router.put("/posts/:postId", authMiddleware, async (req, res) => {
  try {
    if (!req.params || !req.body) {
      return res.status(412).json({
        success: false,
        errorMessage: "데이터 형식이 올바르지 않습니다.",
      });
    }
  
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { title, content } = req.body;
  
    if (!title) {
      return res.status(412).json({
        success: false,
        errorMessage: "게시글 제목의 형식이 올바르지 않습니다.",
      });
    }
    
    if (!content) {
      return res.status(412).json({
        success: false,
        errorMessage: "게시글 내용의 형식이 올바르지 않습니다.",
      });
    }

    const existsPost = await Posts.findOne({where: { postId }});
  
    if (existsPost) {
      if(userId === existsPost.UserId){
        await Posts.update({title : title, content : content}, {where:{ postId }});
      }
      else{
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
    res.json({ message: "게시글을 수정하였습니다." });

  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      errorMessage: "게시글 수정에 실패하였습니다.",
    });
  }
});

router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  try{
    if (!req.params || !req.body) {
      return res.status(400).json({
        success: false,
        errorMessage: "'데이터 형식이 올바르지 않습니다.'",
      });
    }
  
    const { userId } = res.locals.user;
    const { postId } = req.params;
  
    const existsPost = await Posts.findOne({where: { postId }});
  
    if (existsPost) {
      if(userId === existsPost.UserId)
        await Posts.destroy({where:{ postId }});
      else {
        return res.status(403).json({
          success: false,
          errorMessage: "게시글의 삭제 권한이 존재하지 않습니다.",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        errorMessage: "게시글 조회에 실패하였습니다.",
      });
    }
    res.json({ message: "게시글을 삭제하였습니다." });

  } catch (err){
    console.log(err);
    return res.status(400).json({
      success: false,
      errorMessage: "게시글 삭제에 실패하였습니다.",
    });
  }
  
});

module.exports = router;
