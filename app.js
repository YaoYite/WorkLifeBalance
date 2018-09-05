var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

var User = require("./models/user");
var Workaholic = require("./models/workaholic");

app.use( express.static( "public" ) );

mongoose.connect("mongodb://localhost/app",{ useNewUrlParser: true });
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

app.get("/workaholics", function(req, res){
    // Get all workaholics from DB
    Workaholic.find({}, function(err, allWorkaholics){
       if(err){
           console.log(err);
       } else {
          res.render("workaholics",{workaholics:allWorkaholics});
       }
    });
});

//CREATE - add new workaholic to DB
app.post("/workaholics", function(req, res){
    // get data from form and add to workaholics array
    var name = req.body.name;
    var email = req.body.email;
    var gender = req.body.gender;
    var age = req.body.age;
    var occupation = req.body.occupation;
    var relation = req.body.relation;
    var newWorkaholic = {name: name, email: email, gender: gender, age:age, relation:relation, occupation:occupation}
    // Create a new record and save to DB
    Workaholic.create(newWorkaholic, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to workaholics page
            res.redirect("/workaholics");
        }
    });
});

//NEW - show form to add new workaholic
app.get("/workaholics/newWorkaholic", function(req, res){
   res.render("newWorkaholic.ejs"); 
});

// SHOW - shows more info about one campground
app.get("/workaholics/:id", function(req, res){
    //find the campground with provided ID
    Workaholic.findById(req.params.id, function(err, foundWorkaholic){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("showWorkaholic", {workaholic: foundWorkaholic});
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
    req.body.email;
    User.register(new User({username: req.body.username,email:req.body.email}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/track");
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
    successRedirect: "/track",
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