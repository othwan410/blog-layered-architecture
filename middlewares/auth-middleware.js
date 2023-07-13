const jwt = require('jsonwebtoken');
const { Users } = require('../models');

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;

  const [authType, authToken] = (Authorization ?? '').split(' ');

  if (!authToken || authType !== 'Bearer') {
    res.status(403).send({
      errorMessage: '로그인 후 이용 가능한 기능입니다.',
    });
    return;
  }

  try {
    const { userId } = jwt.verify(authToken, process.env.COOKIE_SECRET);
    res.locals.userId = userId;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({
      errorMessage: '비정상적인 요청입니다.',
    });
  }
};
