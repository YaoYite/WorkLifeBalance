var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {type:String,match:"[A-Za-z0-9]+",minlength:1,maxlength:20},
    password: String,
    email: {type:String,maxlength:50}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);