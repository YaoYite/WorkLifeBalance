var mongoose = require("mongoose");

var DailySchema = new mongoose.Schema({
    date: String, 
    family:Number,
    hobbies: Number
});


module.exports = mongoose.model("Daily",DailySchema);