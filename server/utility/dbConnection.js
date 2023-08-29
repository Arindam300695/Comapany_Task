const mongoose = require("mongoose");
require("dotenv").config();
const connectToDb = async()=>{
    await mongoose.connect(process.env.dbUri);
    console.log("connected to the database successfully!");
};

module.exports = connectToDb;