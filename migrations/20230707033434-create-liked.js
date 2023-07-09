'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Likeds', {
      PostId: {
        allowNull: false, // NOT NULL
        type: Sequelize.INTEGER,
        references: {
          model: 'Posts', // Posts 모델을 참조합니다.
          key: 'postId', // Posts 모델의 postId 참조합니다.
        },
        onDelete: 'CASCADE', // 만약 Posts 모델의 Posts 삭제되면
      },
      UserId: {
        allowNull: false, // NOT NULL
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Users 모델을 참조합니다.
          key: 'userId', // Users 모델의 userId를 참조합니다.
        },
        onDelete: 'CASCADE', // 만약 Users 모델의 userId가 삭제되면
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
    await queryInterface.dropTable('Likeds');
  },
};
