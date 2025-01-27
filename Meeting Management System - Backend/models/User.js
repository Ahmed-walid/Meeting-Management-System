const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Path to your Sequelize instance

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('Manager', 'Secretary'),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true // Adds createdAt and updatedAt
  }
);

module.exports = User;
