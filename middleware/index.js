const Campground = require("../models/campground")
const Comment = require("../models/comment")
const middlewareObj = {}

middlewareObj.checkCampOwner = (req,res,next)=>{
    if(req.isAuthenticated()){
        Campground.findById(req.params.id).then((camp)=>{
            if(camp.author.id.equals(req.user._id)){
            
                next()
            }else{
                req.flash("error","Permision Denied")
                res.redirect(`back`)
            }
        }).catch(err => console.log(err))

    }else{
        req.flash("error","You must be Logged in")
        res.redirect("/login")
    }
}

middlewareObj.checkCommentOwner = (req,res,next) =>{
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id).then((comment)=>{
            if(comment.author.id.equals(req.user._id)){
                next()
            }else{
                res.redirect(`back`)
            }
        }).catch(err => console.log(err))

    }else{
        req.flash("error","You must be Logged in")
        res.redirect("/login")
    }
}


middlewareObj.isLoggedIn= (req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash("error","You must be Logged in")
        res.redirect("/login")
    }
}





module.exports=  middlewareObj