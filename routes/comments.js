var express = require('express')
const router = express.Router({mergeParams: true})
const Campground = require("../models/campground")
const Comment = require("../models/comment")

//Comments new
router.get("/new", isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id).then((camp)=>{
        res.render("comments/new",{campground: camp})
    }).catch(err => console.log(err))
    
})

// Comments save
router.post("/", isLoggedIn ,(req,res)=>{
    Campground.findById(req.params.id).then((camp)=>{
        Comment.create(req.body.comment).then((comment)=>{
            //add username to the comment
            comment.author.id = req.user._id
            comment.author.username = req.user.username
            comment.save().then(()=>console.log("Comment added user")).catch(err => console.log(err))

            camp.comments.push(comment);
            camp.save().then(camp => console.log(`Created Comment ${camp}`)).catch(err=>console.log(err))
            //redirect
            res.redirect(`/campgrounds/${camp._id}`)

        }).catch(err=> console.log(err))
        
        
    }).catch(err => console.log(err))
    
})


// middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        res.redirect("/login")
    }
}

module.exports = router;