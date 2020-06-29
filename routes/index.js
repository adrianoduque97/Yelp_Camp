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
            req.flash("success",`User registered, Welcome ${req.body.username}` )
            res.redirect("/campgrounds") 
        })
      
    })
    .catch((err)=>{
        req.flash("error",err.message)
        res.redirect("/login")
    })
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
    req.flash("success","Loged you out")
    res.redirect("/campgrounds")

})



module.exports = router;