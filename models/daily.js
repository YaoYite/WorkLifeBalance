var mongoose = require("mongoose");

var DailySchema = new mongoose.Schema({
    date: String, 
    careofchildren: Number,
    teachhelpchildren: Number,
    playreadtalkwithchildren: Number,
    socialcommunity: Number,
    sportoutdoor: Number,
    hobbyarts: Number,
    media: Number,
    talkingreadingwriting: Number
});


module.exports = mongoose.model("Daily",DailySchema);