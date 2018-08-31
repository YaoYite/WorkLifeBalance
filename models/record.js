var mongoose = require("mongoose");

var RecordSchema = new mongoose.Schema({
    date: String,
    sleep: Number,
    work: Number,
    sport: Number,
    leisure: Number
});


module.exports = mongoose.model("Record",RecordSchema);