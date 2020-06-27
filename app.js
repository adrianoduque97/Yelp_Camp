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

//seed();
mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true, useUnifiedTopology: true })
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine','ejs')
app.use(express.static(__dirname+"/public"))


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
    next();
});



app.get("/", (req,res)=>{
    res.render("landing")
})

app.get("/campgrounds", (req,res)=>{
    Campground.find()
                .then((camp)=>{
                    res.render('campgrounds/index',{campgrounds: camp})
                })
                .catch(err => console.log(err))
}) 

app.get("/campgrounds/new", (req,res)=>{

    res.render('campgrounds/new')

})

//Post route
app.post("/campgrounds",(req,res)=>{
    const name =req.body.name
    const image = req.body.image
    const descr = req.body.description

    const camp = new Campground({
        name:name,
        image:image,
        description:descr
    })
    camp.save()
        .then(camp=> console.log(`New Campgroun added ${camp}`))
        .catch(err => console.log(err))
    res.redirect("/campgrounds")
})

app.get("/campgrounds/:id",(req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec()
            .then(camp => res.render("campgrounds/show",{campground: camp}))
            .catch(err=>console.log(err))       
   // Campground.find()
})

app.get("/campgrounds/:id/comments/new", isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id).then((camp)=>{
        res.render("comments/new",{campground: camp})
    }).catch(err => console.log(err))
    
})

app.post("/campgrounds/:id/comments/", isLoggedIn ,(req,res)=>{
    Campground.findById(req.params.id).then((camp)=>{
        Comment.create(req.body.comment).then((comment)=>{
            camp.comments.push(comment);
            camp.save().then(camp => console.log(`Created Comment ${camp}`)).catch(err=>console.log(err))
            //redirect
            res.redirect(`/campgrounds/${camp._id}`)

        }).catch(err=> console.log(err))
        
        
    }).catch(err => console.log(err))
    
})


// AUTH ROUTES

app.get("/register",(req,res)=>{
    res.render("register")
})
app.post("/register",(req,res)=>{
    User.register(new User({username: req.body.username}),req.body.password)
    .then((user)=>{
        console.log(user)
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/campgrounds") 
        })
      
    })
    .catch(err => console.log(err))
})

//LOGIN
app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect:"/login",
}),(req,res)=>{
})

// LOGOUT

app.get("/logout", (req,res)=>{
    req.logout()
    res.redirect("/campgrounds")

})


// Middleware to check if user is logged in
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        res.redirect("/login")
    }
}






app.listen(3000,()=>console.log("YelpCamp Server Started"))