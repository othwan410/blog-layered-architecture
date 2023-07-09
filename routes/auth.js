const jwt = require('jsonwebtoken');
const express = require('express');
const { Users } = require('../models');
const router = express.Router();

// 로그인 API
router.post('/login', async (req, res) => {
  try {
    const { nickname, password } = req.body;

    const user = await Users.findOne({ where: { nickname } });

    // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다.
    if (!user || password !== user.password) {
      res.status(412).json({
        errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
      });
      return;
    }

    const token = jwt.sign({ userId: user.userId }, 'custom-secret-key');

    res.cookie('Authorization', `Bearer ${token}`); // JWT를 Cookie로 할당합니다!
    res.status(200).json({ token }); // JWT를 Body로 할당합니다!
  } catch (error) {
    console.log(error);
    res.status(401).json({
      errorMessage: '로그인에 실패하였습니다.',
    });
    return;
  }
});

module.exports = router;
