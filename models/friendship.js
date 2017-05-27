/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('friendship', {
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    friendId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    freezeTableName: true,
    timestamps: true,
    underscored: true
  });
};
