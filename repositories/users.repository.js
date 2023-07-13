const { Users } = require('../models');

class UsersRepository {
  findDuplication = async (nickname) => {
    const findDuplication = await Users.findOne({ where: { nickname } });

    return findDuplication;
  };

  signup = async (nickname, password) => {
    const signup = await Users.create({ nickname, password });

    return signup;
  };

  login = async (nickname) => {
    const user = await Users.findOne({ where: { nickname } });

    return user;
  };
}

module.exports = UsersRepository;
