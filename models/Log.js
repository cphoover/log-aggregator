/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => sequelize.define('Log', {
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
  msg: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
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
  tableName: 'Log',
});
