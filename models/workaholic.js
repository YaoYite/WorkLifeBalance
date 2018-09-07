var mongoose = require("mongoose");

var WorkaholicSchema = new mongoose.Schema({
    user: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
    name: String,
    email: String,
    gender: String,
    age: Number,
    relation: String,
    occupation: String,
    dailys:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Daily"
        }
    ]
});


module.exports = mongoose.model("Workaholic",WorkaholicSchema);