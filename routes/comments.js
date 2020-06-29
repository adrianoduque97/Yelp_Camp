var express = require('express')
const router = express.Router({mergeParams: true})
const Campground = require("../models/campground")
const Comment = require("../models/comment")
const middlewareObj = require("../middleware")

//Comments new
router.get("/new", middlewareObj.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id).then((camp)=>{
        res.render("comments/new",{campground: camp})
    }).catch(err => console.log(err))
    
})

// Comments save
router.post("/", middlewareObj.isLoggedIn ,(req,res)=>{
    Campground.findById(req.params.id).then((camp)=>{
        Comment.create(req.body.comment).then((comment)=>{
            //add username to the comment
            comment.author.id = req.user._id
            comment.author.username = req.user.username
            comment.save().then(()=>console.log("Comment added user")).catch(err => console.log(err))

            camp.comments.push(comment);
            camp.save().then(camp => console.log(`Created Comment ${camp}`)).catch(err=>console.log(err))
            //redirect
            req.flash("success","Added Comment")
            res.redirect(`/campgrounds/${camp._id}`)

        }).catch(err=> console.log(err))
        
        
    }).catch(err => console.log(err))
    
})

//edit Comment
router.get("/:comment_id/edit",middlewareObj.checkCommentOwner,(req,res)=>{
    Comment.findById(req.params.comment_id).then((comment)=>{
        res.render("comments/edit",{campground_id: req.params.id , comment: comment})
    }).catch(err => console.log(err))
    
})
// update route
router.put("/:comment_id",middlewareObj.checkCommentOwner,(req,res)=>{
    Comment.findById(req.params.comment_id).then((comment)=>{
        comment.updateOne(req.body.comment).then(()=>{
            req.flash("success","Comment updated")
            res.redirect(`/campgrounds/${req.params.id}`)
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
    
})

//delete comment
router.delete("/:comment_id",middlewareObj.checkCommentOwner,(req,res)=>{
    Comment.findById(req.params.comment_id).then((foundComment)=>{
        foundComment.deleteOne().then(()=>{
            req.flash("success","Comment deleted")
            res.redirect(`back`)
        }).catch((err)=>{
            res.redirect(`/campgrounds/${req.params.id}`)
        })
    }).catch(err=> console.log(err))
})

module.exports = router;