const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require ("./models/user")
const Campground = require("./models/campground")
const Comment = require("./models/comment")
const seed = require('./seeds')
const methodOverride = require('method-override')
const flash = require('connect-flash')

//Routes
const commentRoutes = require("./routes/comments")
const campgroundRoutes= require("./routes/campgrounds")
const authRoutes = require("./routes/index")

//seed();
mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true, useUnifiedTopology: true })
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine','ejs')
app.use(express.static(__dirname+"/public"))
app.use(methodOverride("_method"))
app.use(flash())


//Passport
app.use(require("express-session")({
    secret: "Adrian Test",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next();
});

app.use("/campgrounds/:id/comments",commentRoutes)
app.use("/campgrounds",campgroundRoutes)
app.use("/",authRoutes)


app.listen(3000,()=>console.log("YelpCamp Server Started"))
