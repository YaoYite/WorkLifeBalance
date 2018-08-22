var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use( express.static( "public" ) );


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("index.ejs");
});

app.get("/about", function(req, res){
    res.render("about.ejs");
});

app.get("/contact", function(req, res){
    res.render("contact.ejs");
});

app.get("/workaholic", function(req, res){
    res.render("workaholic.ejs");
});

app.get("/family", function(req, res){
    res.render("family.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Work Life Balance Server Has Started!");
});