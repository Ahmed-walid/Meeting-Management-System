require('dotenv').config();
const express = require("express");
const {sequelize} = require('./config/database');
const meetingsRouter = require('./routes/meetings');
const bodyParser = require("body-parser");


// Import models
const {User, Meeting, Participant} = require('./config/databaseInit');


const app = express();
const port = 3010;

app.use(bodyParser.json());


app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
	  "Access-Control-Allow-Methods",
	  "GET, POST, PUT, PATCH, DELETE"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	if (req.method === "OPTIONS") {
	  return res.status(200).send();
	}
	next();
  }); 

app.use('/meetings', meetingsRouter);

app.get('/', (req, res) => {
	res.status(404).json({ message: 'Not Found' });
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

