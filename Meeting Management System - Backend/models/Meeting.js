const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Path to your Sequelize instance

class Meeting extends Model {}

Meeting.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true 
    },
    priority: {
      type: DataTypes.ENUM('High', 'Medium', 'Low'),
      defaultValue: 'Medium',
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER, // duration in minutes
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Running', 'Expected', 'Waiting', 'Completed', 'Canceled'),
      allowNull: false,
      defaultValue: 'Expected'
    }
  },
  {
    sequelize,
    modelName: 'Meeting',
    tableName: 'meetings',
    timestamps: true // Adds createdAt and updatedAt
  }
);

module.exports = Meeting;
