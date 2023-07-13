'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      postId: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key (기본키)
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false, // NOT NULL
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Users 모델을 참조합니다.
          key: 'userId', // Users 모델의 userId를 참조합니다.
        },
        onDelete: 'CASCADE', // 만약 Users 모델의 userId가 삭제되면
      },
      title: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING,
      },
      content: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING,
      },
      likedCount: {
        allowNull: false, // NOT NULL
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  },
};
