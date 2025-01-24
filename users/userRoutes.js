const express = require("express");

const router = express.Router();

router.post("/create", (req, res) => {
  console.log(req.body);
  res.status(200).send("Success");
});

router.get("/", (req, res) => {
  res.status(200).json({
    id: 1,
    name: "Alfred Kariuki",
    age: 30,
    mobile: "76t4857ei7t",
    date: new Date().toDateString(),
  });
});

module.exports = router;
