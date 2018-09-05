var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

var User = require("./models/user");
var Record = require("./models/record");

app.use( express.static( "public" ) );

mongoose.connect("mongodb://localhost/auth_demo_app",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "abcd1234",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=======================
//Routes
//=======================



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

app.get("/records", function(req, res){
    // Get all campgrounds from DB
    Record.find({}, function(err, allRecords){
       if(err){
           console.log(err);
       } else {
          res.render("records",{records:allRecords});
       }
    });
});

//CREATE - add new record to DB
app.post("/records", function(req, res){
    // get data from form and add to records array
    var date = req.body.date;
    var sleep = req.body.sleep;
    var work = req.body.work;
    var sport = req.body.sport;
    var leisure = req.body.leisure;
    var newRecord = {date: date, sleep: sleep, woek: work, sport:sport, leisure:leisure}
    // Create a new record and save to DB
    Record.create(newRecord, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/records");
        }
    });
});

//NEW - show form to create new record
app.get("/records/newRecord", function(req, res){
   res.render("newRecord.ejs"); 
});

// SHOW - shows more info about one campground
app.get("/records/:id", function(req, res){
    //find the campground with provided ID
    Record.findById(req.params.id, function(err, foundRecord){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("showRecord", {record: foundRecord});
        }
    });
})

app.get("/track",isLoggedIn,function(req, res){
    res.render("track.ejs");
});

//show sigu up form
app.get("/register", function(req, res){
    res.render("register.ejs");
});

//handling user sign up
app.post("/register", function(req, res){
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/secret");
        });
    });
});

//show login form
app.get("/login", function(req, res){
    res.render("login.ejs");
});

//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Work Life Balance Server Has Started!");
});