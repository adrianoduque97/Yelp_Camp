var express = require('express')
const router = express.Router({mergeParams: true})
const Campground = require("../models/campground")

// Get all campgrounds
router.get("/", (req,res)=>{
    Campground.find()
                .then((camp)=>{
                    res.render('campgrounds/index',{campgrounds: camp})
                })
                .catch(err => console.log(err))
}) 

//new Campground
router.get("/new",isLoggedIn ,(req,res)=>{

    res.render('campgrounds/new')

})

//Create Campground
router.post("/",isLoggedIn,(req,res)=>{
    const name =req.body.name
    const image = req.body.image
    const descr = req.body.description
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const camp = new Campground({
        name:name,
        image:image,
        description:descr,
        author: author
    })
    camp.save()
        .then(camp=> console.log(`New Campgroun added ${camp}`))
        .catch(err => console.log(err))
    res.redirect("/campgrounds")
})

// Get a campground by :id
router.get("/:id",(req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec()
            .then(camp => res.render("campgrounds/show",{campground: camp}))
            .catch(err=>console.log(err))       
})

// EDIT 
router.get("/:id/edit",checkCampOwner,(req,res)=>{
    Campground.findById(req.params.id).then((foundCamp)=>{
        res.render("campgrounds/edit", {campground : foundCamp})
    }).catch(err => console.log(err))
    
})

// UPDATE
router.put("/:id",checkCampOwner,(req,res)=>{

    Campground.findById(req.params.id).then((foundCamp)=>{
        foundCamp.updateOne(req.body.camp).then((camp)=>{
            res.redirect(`/campgrounds/${req.params.id}`)
        }).catch((err)=>{
            console.log(err)
            res.redirect("/campgrounds")
        })
    }).catch(err => console.log(err))
    
})

// Delete Camp
router.delete("/:id",checkCampOwner,(req,res)=>{
    Campground.findById(req.params.id).then((foundCamp)=>{
        foundCamp.deleteOne().then(()=>{
            res.redirect("/campgrounds")
        }).catch((err)=>{
            console.log(err)
            res.redirect(`/campgrounds/${req.param.id}`)
        })
    }).catch(err=> console.log(err))
})
// Middleware to check if user is logged in
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        res.redirect("/login")
    }
}

//middleware for check the user is connceted 
function checkCampOwner(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id).then((camp)=>{
            if(camp.author.id.equals(req.user._id)){
                next()
            }else{
                res.redirect(`back`)
            }
        }).catch(err => console.log(err))

    }else{
        res.redirect("/login")
    }
}

module.exports = router;