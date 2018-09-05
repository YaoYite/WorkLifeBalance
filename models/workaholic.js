var mongoose = require("mongoose");

var WorkaholicSchema = new mongoose.Schema({
    name: String,
    email: String,
    gender: String,
    age: Number,
    relation: String,
    occupation: String
});


module.exports = mongoose.model("Workaholic",WorkaholicSchema);