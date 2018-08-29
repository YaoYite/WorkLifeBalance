var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use( express.static( "public" ) );


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Index page - landing page
app.get("/", function(req, res){
    res.render("index.ejs");
});

//About page - website and team information
app.get("/about", function(req, res){
    res.render("about.ejs");
});

//Contact page - team contact information
app.get("/contact", function(req, res){
    res.render("contact.ejs");
});

//Assessment page - workaholic quick assessment
app.get("/assessment", function(req, res){
    res.render("assessment.ejs");
});

//Family page - Show general tips of how to help workaholic family
app.get("/family", function(req, res){
    res.render("family.ejs");
});

//Workaholic page - show information of workaholic
app.get("/workaholic", function(req, res){
    res.render("workaholic.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Work Life Balance Server Has Started!");
});