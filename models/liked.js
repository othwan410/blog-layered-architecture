'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likeds extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        targetKey: 'userId',
        foreignKey: 'UserId',
      });

      this.belongsTo(models.Posts, {
        // 2. Users 모델에게 N:1 관계 설정을 합니다.
        targetKey: 'postId', // 3. Users 모델의 userId 컬럼을
        foreignKey: 'PostId', // 4. Posts 모델의 UserId 컬럼과 연결합니다.
      });
    }
  }
  Likeds.init(
    {
      PostId: {
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      UserId: {
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      createdAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Likeds',
    },
  );
  return Likeds;
};
