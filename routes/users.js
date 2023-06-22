const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const { isValidNcknm, isValidPwd } = require("../modules/valid.js");

// 회원가입 API
router.post("/signup", async (req, res) => {
  try {
    const {nickname, password, confirm } = req.body;
    
    if (!isValidNcknm(nickname)) {
      res.status(412).json({
        errorMessage: "닉네임의 형식이 일치하지 않습니다.",
      });
      return;
    }

    if (!isValidPwd(password)) {
      res.status(412).json({
        errorMessage: "패스워드 형식이 일치하지 않습니다.",
      });
      return;
    }

    if (password !== confirm) {
      res.status(412).json({
        errorMessage: "패스워드가 일치하지 않습니다.",
      });
      return;
    }

    if(password.includes(nickname)){
      res.status(412).json({
        errorMessage: "패스워드에 닉네임이 포함되어 있습니다.",
      });
      return;
    }

    // nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
    const existsUsers = await Users.findOne({where: { nickname }})

    if (existsUsers) {
      // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다.
      res.status(412).json({
        errorMessage: "중복된 닉네임입니다.",
      });
      return;
    }
    await Users.create({ nickname, password });
    res.status(201).json({ message : "회원 가입에 성공하였습니다."});
    
  } catch (error) {
    res.status(400).json({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
    return;
  }
});

module.exports = router;
