require('sqreen');
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var request = require("request");
var moment = require('moment');


var User = require("./models/user");
var Workaholic = require("./models/workaholic");
var Daily = require("./models/daily");
var Recreation = require("./models/recreation");
var Art = require("./models/art");
var nodemailer = require("nodemailer");

app.use( express.static( "public" ) );

mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

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

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

//=======================
//Routes
//=======================
app.get("/carousel", function(req, res){
    res.render("carousel.ejs");
});

var city = "Melbourne";
var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=05b978ac528aee237d04a45fc54c6545`;

app.get("/weather", function(req, res){
    
    request(url, function(error, response, body){
       var weather_json = JSON.parse(body);
       console.log(weather_json);
       
       var weather = {
            city : city,
            temperature : Math.round((weather_json.main.temp-32)/1.8),
            description : weather_json.weather[0].description,
            icon : weather_json.weather[0].icon
        };
        
        var weather_data = {weather:weather};
        
       res.render("weather.ejs", weather_data);
    });
});

var zip = 3163;
app.get("/zipweather/:id", function(req, res){
    zip = req.params.id;
    var url1 = `http://api.openweathermap.org/data/2.5/weather?zip=${zip},au&units=imperial&appid=05b978ac528aee237d04a45fc54c6545`;
    
    request(url1, function(error, response, body){
       var weather_json = JSON.parse(body);
       
       if(weather_json.main == undefined){
        // res.render('zipweather.ejs', {weather:null,error: 'Sorry, We can not find the weather data'});
        res.send("Sorry, We can not find the weather data");
      } else {
        var weather = {
            city: zip,
            temperature : Math.round((weather_json.main.temp-32)/1.8),
            description : weather_json.weather[0].description,
            icon : weather_json.weather[0].icon
        };
        var weather_data = {weather:weather};
        
       res.render("zipweather.ejs", weather_data);
      }
    });
});

app.get("/arts", function(req, res){
    // Get all recreations info from DB
    Art.find({}, function(err, allArts){
      if(err){
          console.log(err);
      } else {
          res.render("arts",{arts:allArts});
      }
    });
});

app.get("/arts/:id", function(req, res){
    //find the workaholic with provided ID
    Art.findById(req.params.id, function(err, foundArt){
      if(err){
          res.redirect("back");
      } else {
          res.render("showArt",{art:foundArt});
   };
});
});

app.get("/recreations", function(req, res){
    // Get all recreations info from DB
    var sport = req.query.sport;
    Recreation.find({SportsPlayed:{"$regex":sport,"$options":"i"}}, function(err, allRecreations){
      if(err){
          console.log(err);
      } else {
          res.render("recreations",{recreations:allRecreations});
      }
    });
});

// app.get("/recreations/:type", function(req, res){
//     // Get all recreations info from DB
//     Recreation.find({SportsPlayed:{"$regex":req.params.type,"$options":"i"}}, function(err, allRecreations){
//       if(err){
//           console.log(err);
//       } else {
//           res.render("recreations",{recreations:allRecreations});
//       }
//     });
// });

app.get("/recreations/:id", function(req, res){
    //find the workaholic with provided ID
    Recreation.findById(req.params.id, function(err, foundRecreation){
      if(err){
          res.redirect("back");
      } else {
          zip = foundRecreation.Postcode;
          res.render("showRecreation",{recreation:foundRecreation});
   };
});
});

app.get("/life", function(req, res){
    res.render("life.ejs");
});

app.get("/", function(req, res){
    res.render("index.ejs");
});

app.get("/facts", function(req, res){
    res.render("facts.ejs");
});

//Index page - landing page
app.get("/index", function(req, res){
    res.render("index.ejs");
});

app.get("/timetreemap", function(req, res){
    res.render("graph/timetreemap.ejs");
});

app.get("/showtimetreemap", function(req, res){
    res.render("graph/showtimetreemap.ejs");
});

app.get("/diffchart", function(req, res){
    res.render("graph/diffchart.ejs");
});

app.get("/calendarchart", function(req, res){
    res.render("graph/calendarchart.ejs");
});

app.get("/linechart", function(req, res){
    res.render("graph/linechart.ejs");
});

app.get("/worktimegraph", function(req, res){
    res.render("graph/graph_worktime.ejs");
});

app.get("/showworktimegraph", function(req, res){
    res.render("graph/graph_worktime_show.ejs");
});

app.get("/paidjobgraph", function(req, res){
    res.render("graph/graph_paid_job.ejs");
});

app.get("/showpaidjobgraph", function(req, res){
    res.render("graph/graph_paid_job_show.ejs");
});

app.get("/paidindustrygraph", function(req, res){
    res.render("graph/graph_paid_industry.ejs");
});

app.get("/showpaidindustrygraph", function(req, res){
    res.render("graph/graph_paid_industry_show.ejs");
});

app.get("/paidgendergraph", function(req, res){
    res.render("graph/graph_paid_gender.ejs");
});

app.get("/showpaidgendergraph", function(req, res){
    res.render("graph/graph_paid_gender_show.ejs");
});

app.get("/maleexercisegraph", function(req, res){
    res.render("graph/graph_exercise_male.ejs");
});

app.get("/showmaleexercisegraph", function(req, res){
    res.render("graph/graph_exercise_male_show.ejs");
});

app.get("/femaleexercisegraph", function(req, res){
    res.render("graph/graph_exercise_female.ejs");
});

app.get("/showfemaleexercisegraph", function(req, res){
    res.render("graph/graph_exercise_female_show.ejs");
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

app.get("/workaholics", isLoggedIn, function(req, res){
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
app.post("/workaholics",isLoggedIn, function(req, res){
    // get data from form and add to workaholics array
    var name = req.body.name;
    var email = req.body.email;
    var gender = req.body.gender;
    var age = req.body.age;
    var occupation = req.body.occupation;
    var relation = req.body.relation;
    var hobby = req.body.hobby;
    var user = {
        id: req.user._id,
        username: req.user.username
    }
    var newWorkaholic = {name: name, email: email, gender: gender, age:age, relation:relation, occupation:occupation, user:user, hobby:hobby}
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
app.get("/workaholics/newWorkaholic",isLoggedIn, function(req, res){
   res.render("newWorkaholic.ejs"); 
});

// SHOW - shows more info about one workaholic
app.get("/workaholics/:id",isLoggedIn, function(req, res){
    //find the workaholic with provided ID
    Workaholic.findById(req.params.id).populate("dailys").exec(function(err, foundWorkaholic){
        if(err){
            console.log(err);
        } else {
            res.render("showWorkaholic", {workaholic: foundWorkaholic});
        }
    });
})

// show workaholic information edit form
app.get("/workaholics/:id/edit",checkWorkaholicOwnership , function(req, res){
    Workaholic.findById(req.params.id, function(err, foundWorkaholic){
        if(err){
            console.log(err);
        } else {
        res.render("editWorkaholic", {workaholic: foundWorkaholic})
        };
    });
});

app.get("/workaholics/:id/detail",checkWorkaholicOwnership , function(req, res){
    Workaholic.findById(req.params.id, function(err, foundWorkaholic){
        if(err){
            console.log(err);
        } else {
        res.render("detailWorkaholic", {workaholic: foundWorkaholic})
        };
    });
});

// workaholic information put route
app.put("/workaholics/:id",checkWorkaholicOwnership , function(req, res){
    // find and update the correct campground
    Workaholic.findByIdAndUpdate(req.params.id, req.body.workaholic, function(err, updatedWorkaholic){
       if(err){
           res.redirect("/workaholics");
       } else {
           //redirect somewhere(show page)
           res.redirect("/workaholics/" + req.params.id);
       }
    });
});

// destroy workaholic route
app.delete("/workaholics/:id",checkWorkaholicOwnership, function(req, res){
   Workaholic.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/workaholics");
      } else {
          res.redirect("/workaholics");
      }
   });
});


app.get("/track",isLoggedIn,function(req, res){
    res.render("track.ejs");
});

// ===============================================
// Daily activities tracking routes
// ===============================================

app.get("/workaholics/:id/dailys/:daily_id/show",isLoggedIn, function(req, res){
   Daily.findById(req.params.daily_id, function(err, foundDaily){
      if(err){
          res.redirect("back");
      } else {
        res.render("dailys/show", {workaholic_id: req.params.id, daily: foundDaily});
      }
   });
});

app.get("/workaholics/:id/dailys/:daily_id/edit",isLoggedIn,function(req, res){
   Daily.findById(req.params.daily_id, function(err, foundDaily){
      if(err){
          res.redirect("back");
      } else {
        res.render("dailys/edit", {workaholic_id: req.params.id, daily: foundDaily});
      }
   });
});

app.put("/workaholics/:id/dailys/:daily_id",isLoggedIn, function(req, res){
    var date = req.body.date;
    var familyhour = Number(req.body.familyhour);
    var familyminutes = Number(req.body.familyminutes);
    var hobbyhour = Number(req.body.hobbyhour);
    var hobbyminutes = Number(req.body.hobbyminutes);
    var familyhour = Number(familyhour) + Number(familyminutes/60);
    var hobbyhour = Number(hobbyhour) + Number(hobbyminutes/60);
    var newDaily = {date: date, family: familyhour, hobbies: hobbyhour};
   Daily.findByIdAndUpdate(req.params.daily_id, newDaily, function(err, updatedDaily){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/workaholics/" + req.params.id );
      }
   });
});

app.delete("/workaholics/:id/dailys/:daily_id",isLoggedIn, function(req, res){
    //findByIdAndRemove
    Daily.findByIdAndRemove(req.params.daily_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/workaholics/" + req.params.id);
       }
    });
});

app.get("/workaholics/:id/dailys/new",isLoggedIn, function(req, res){
    Workaholic.findById(req.params.id, function(err, workaholic){
        if(err){
            console.log(err);
        } else {

            res.render("dailys/new.ejs", {workaholic: workaholic});
        }
    })
});

app.post("/workaholics/:id/dailys",isLoggedIn, function(req, res){
    var date = req.body.date;
    var familyhour = Number(req.body.familyhour);
    var familyminutes = Number(req.body.familyminutes);
    var hobbyhour = Number(req.body.hobbyhour);
    var hobbyminutes = Number(req.body.hobbyminutes);
    console.log(familyhour);
    console.log(typeof familyhour);
    var familyhour = Number(familyhour) + Number(familyminutes/60);
    var hobbyhour = Number(hobbyhour) + Number(hobbyminutes/60);
    console.log(familyhour);
    console.log(typeof familyhour);
    var newDaily = {date: date, family: familyhour, hobbies: hobbyhour};
    Workaholic.findById(req.params.id, function(err, workaholic){
       if(err){
           console.log(err);
           res.redirect("/workaholics");
       } else {
        Daily.create(newDaily, function(err, daily){
           if(err){
               console.log(err);
           } else {
               workaholic.dailys.push(daily);
               workaholic.save();
               res.redirect('/workaholics/' + workaholic._id);
           }
        });
       }
   });
});

// ===============================================
// Auth routes
// ===============================================

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
            return res.render('registerfail',{err:err});
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/workaholics");
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
    successRedirect: "/workaholics",
    failureRedirect: "/loginfail"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/index");
});

app.get("/userprofile", isLoggedIn, function(req, res){
    // Get all workaholics from DB
    User.find({}, function(err, allUsers){
       if(err){
           console.log(err);
       } else {
          res.render("userprofile",{users:allUsers});
       }
    });
});

app.get("/loginfail", function(req, res){
    res.render("loginfail.ejs");
});

app.get("/registerfail", function(req, res){
    res.render("registerfail.ejs");
});


app.use(function(req, res){
   res.render("404"); 
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkWorkaholicOwnership(req, res, next) {
 if(req.isAuthenticated()){
        Workaholic.findById(req.params.id, function(err, foundWorkaholic){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundWorkaholic.user.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Work Life Balance Server Has Started!");
});