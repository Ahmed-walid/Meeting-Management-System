const User = require("../models/User");
const Meeting = require("../models/Meeting");
const Participant = require("../models/Participant");
const sequelize = require("./database");

// Define associations
// Meeting.belongsToMany(Participant, { through: Participant });

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
