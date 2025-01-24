//Mongoose library instance
const mongoose = require("mongoose");

const mongoDBUrl =
  "mongodb+srv://alfygitau:my_password@cluster0.wwtwv4m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

//connect to Database
const connectDb = async () => {
  try {
    await mongoose.connect(mongoDBUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection Successful");
  } catch (err) {
    console.log("Received an Error:", err);
  }
};

module.exports = connectDb;
