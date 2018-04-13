
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Request', {
    requestId: {
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      type: Sequelize.UUID,
      primaryKey: true,
    },
    url: {
      type: Sequelize.STRING,
    },
    ipAddress: {
      type: Sequelize.STRING,
    },
    datetime: {
      type: Sequelize.DATE,
    },
    controller: {
      type: Sequelize.STRING,
    },
    format: {
      type: Sequelize.STRING,
    },
    parameters: {
      type: Sequelize.TEXT,
    },
    statusCode: {
      type: Sequelize.STRING,
    },
    overallBenchmark: {
      type: Sequelize.INTEGER,
    },
    viewBenchmark: {
      type: Sequelize.INTEGER,
    },
    dbBenchmark: {
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
  down: queryInterface => queryInterface.dropTable('Request'),
};
