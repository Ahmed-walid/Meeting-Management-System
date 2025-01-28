const User = require("../models/User");
const Meeting = require("../models/Meeting");
const Participant = require("../models/Participant");
const sequelize = require("./database");

// Define associations
Meeting.hasMany(Participant, {
	foreignKey: 'meeting',
});
Participant.belongsTo(Meeting, {
	foreignKey: 'meeting',
});
  

// Sync all models that are not yet in the database
sequelize
	.sync({
		// alter: true
		// force: true
	})
	.then(() => {
		console.log("Tables have been created");
	});

// Export models
module.exports = { User, Meeting, Participant };
