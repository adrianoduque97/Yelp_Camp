var express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require("../models/user")

// Root route
router.get("/", (req,res)=>{
    res.render("landing")
})

// AUTH ROUTES

router.get("/register",(req,res)=>{
    res.render("register")
})
router.post("/register",(req,res)=>{
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
router.get("/login",(req,res)=>{
    res.render("login")
})

router.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect:"/login",
}),(req,res)=>{
})

// LOGOUT

router.get("/logout", (req,res)=>{
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


module.exports = router;