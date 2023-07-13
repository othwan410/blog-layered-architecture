const UsersService = require('../services/users.service');
const { isValidNcknm, isValidPwd } = require('../modules/valid.js');

class UsersController {
  usersService = new UsersService();

  //회원가입
  signup = async (req, res, next) => {
    try {
      const { nickname, password, confirm } = req.body;

      if (!isValidNcknm(nickname)) {
        res.status(412).json({
          errorMessage: '닉네임의 형식이 일치하지 않습니다.',
        });
        return;
      }

      if (!isValidPwd(password)) {
        res.status(412).json({
          errorMessage: '패스워드 형식이 일치하지 않습니다.',
        });
        return;
      }

      if (password !== confirm) {
        res.status(412).json({
          errorMessage: '패스워드가 일치하지 않습니다.',
        });
        return;
      }

      if (password.includes(nickname)) {
        res.status(412).json({
          errorMessage: '패스워드에 닉네임이 포함되어 있습니다.',
        });
        return;
      }

      const signup = await this.usersService.signup(nickname, password);

      res.status(201).json({ data: signup });
    } catch (error) {
      res.status(400).json({ errorMessage: '회원가입에 실패했습니다.' });
    }
  };

  //로그인
  login = async (req, res, next) => {
    try {
      const { nickname, password } = req.body;
      const token = await this.usersService.login(nickname, password);
      res.cookie('authorization', `Bearer ${token}`);
      res.status(201).json({ message: '로그인 성공' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ errorMessage: '로그인에 실패했습니다.' });
    }
    return;
  };
}

module.exports = UsersController;
