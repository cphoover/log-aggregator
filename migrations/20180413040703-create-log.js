
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Log', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    requestId: {
      type: Sequelize.UUID,
      references: {
        model: 'Request',
        key: 'requestId',
      },
    },
    msg: {
      type: Sequelize.TEXT,
    },
    type: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('Log'),
};
