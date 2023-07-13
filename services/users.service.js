const UserRepository = require('../repositories/users.repository');
const jwt = require('jsonwebtoken');

class UserService {
  userRepository = new UserRepository();

  //회원가입
  signup = async (nickname, password) => {
    const findDuplication = await this.userRepository.findDuplication(nickname);

    if (findDuplication) {
      return '중복된 닉네임입니다.';
    }

    await this.userRepository.signup(nickname, password);

    return '회원가입이 완료되었습니다.';
  };

  //로그인
  login = async (nickname, password) => {
    const user = await this.userRepository.login(nickname);

    if (!user || password !== user.password) {
      return '닉네임 또는 패스워드를 확인해주세요.';
    }

    const token = jwt.sign({ userId: user.userId }, process.env.COOKIE_SECRET);

    return token;
  };
}

module.exports = UserService;
