var mongoose = require("mongoose");

var WorkaholicSchema = new mongoose.Schema({
    user: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
    name: {type:String,match:"[A-Za-z0-9 ]+",minlength:1,maxlength:20},
    email: {type:String,maxlength:50},
    gender: {type:String,match:"[A-Za-z0-9 ]+",minlength:1,maxlength:20},
    age: {type: Number,min:0,max:100},
    relation: {type:String,match:"[A-Za-z0-9 ]+",minlength:1,maxlength:20},
    occupation: {type:String,match:"[A-Za-z0-9 ]+",minlength:1,maxlength:20},
    hobby: {type:String,match:"[A-Za-z0-9 ]+",minlength:1,maxlength:20},
    dailys:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Daily"
        }
    ]
});


module.exports = mongoose.model("Workaholic",WorkaholicSchema);