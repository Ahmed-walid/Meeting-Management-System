const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/database'); // Path to your Sequelize instance

class Participant extends Model {
}

Participant.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false
        },
        meeting:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: 'meetings'
            }
        }
    },
    {
        sequelize,
        modelName: 'Participant',
        tableName: 'participants',
        timestamps: true // Adds createdAt and updatedAt
    }
);



module.exports = Participant;