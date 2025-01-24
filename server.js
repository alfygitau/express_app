const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./users/userRoutes");
const studentRoutes = require("./students/studentRoutes");

const server = express();
const PORT = 8000;

// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded());
// parse application/json
server.use(bodyParser.json());

server.use("/users", userRoutes);
server.use("/students", studentRoutes);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// http://localhost:8000/users
