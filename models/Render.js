/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => sequelize.define('Render', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  requestId: {
    type: DataTypes.UUIDV4,
    allowNull: true,
    references: {
      model: 'Request',
      key: 'requestId',
    },
  },
  template: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  benchmark: {
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
  tableName: 'Render',
});
