var mongoose = require("mongoose");

var RecreationSchema = new mongoose.Schema({
    X: Number,
    Y: Number,
    FacilityName: String,
    StreetNo: String,
    Postcode: Number,
    SportsPlayed: String,
    StreetName: String,
    StreetType: String,
    SuburbTown: String,
    Latitude: Number,
    Longtitude: Number,
    NumberFieldCourts: Number,
    FieldSurfaceType: String,
    FacilityAge: String,
    FacilityCondition: String,
    FacilityUpgradeAge: String,
    Changerooms: String
});


module.exports = mongoose.model("recreation",RecreationSchema);