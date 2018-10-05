var mongoose = require("mongoose");

var DailySchema = new mongoose.Schema({
    date: {type:String, maxlength:12}, 
    family:{type: Number,min:0,max:24},
    hobbies: {type: Number,min:0,max:24}
});


module.exports = mongoose.model("Daily",DailySchema);