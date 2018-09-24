var mongoose = require("mongoose");

var ArtSchema = new mongoose.Schema({
    Theme: String,
    SubTheme: String,
    FeatureName: String,
    Coordinates: String
});

module.exports = mongoose.model("art",ArtSchema);