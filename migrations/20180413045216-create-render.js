
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Render', {
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
    template: {
      type: Sequelize.STRING,
    },
    benchmark: {
      type: Sequelize.INTEGER,
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
  down: queryInterface => queryInterface.dropTable('Render'),
};
