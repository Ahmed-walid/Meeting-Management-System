require("dotenv").config();
const express = require("express");
const meetingsRouter = require("./routes/meetings");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

const app = express();
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

app.use("/meetings", meetingsRouter);

app.get("/", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const io = require("./config/socket").init(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("new socket opened");
});
