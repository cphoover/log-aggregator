/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => sequelize.define('Request', {
  requestId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  datetime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  controller: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  parameters: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  format: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paramaters: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  statusCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  overallBenchmark: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  viewBenchmark: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dbBenchmark: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'Request',
});
