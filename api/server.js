require("dotenv").config();
const express = require("express");
const userRoutes = require("../users/routes");
const schoolRoutes = require("../school/routes");
const subjectRoutes = require("../subject/routes");
const classRoutes = require("../myClass/routes");
const authRoutes = require("../auth/routes");
const marksRoutes = require("../marks/routes");
const assessmentRoutes = require("../assessment/routes");
const reportRoutes = require("../report/routes");
const cors = require("cors");
const connection = require("../db/connect");
const server = express();
const PORT = 8000;

// coonect to db
connection();

// Use Express's built-in body parsing middleware
server.use(express.json()); // For parsing application/json
server.use(express.urlencoded({ extended: true }));

var corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
};
server.use(cors(corsOptions));

server.use("/users", userRoutes);
server.use("/", schoolRoutes);
server.use("/", subjectRoutes);
server.use("/", classRoutes);
server.use("/auth", authRoutes);
server.use("/", marksRoutes);
server.use("/", assessmentRoutes);
server.use("/", reportRoutes);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// http://localhost:8000/users
