var express = require('express')
const router = express.Router({mergeParams: true})
const Campground = require("../models/campground")
const middlewareObj = require("../middleware")

// Get all campgrounds
router.get("/", (req,res)=>{
    Campground.find()
                .then((camp)=>{
                    res.render('campgrounds/index',{campgrounds: camp})
                })
                .catch(err => console.log(err))
}) 

//new Campground
router.get("/new",middlewareObj.isLoggedIn ,(req,res)=>{

    res.render('campgrounds/new')

})

//Create Campground
router.post("/",middlewareObj.isLoggedIn,(req,res)=>{
    const name =req.body.name
    const image = req.body.image
    const descr = req.body.description
    const price = req.body.price
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const camp = new Campground({
        name:name,
        image:image,
        description:descr,
        author: author,
        price: price
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
router.get("/:id/edit",middlewareObj.checkCampOwner,(req,res)=>{
    Campground.findById(req.params.id).then((foundCamp)=>{
        res.render("campgrounds/edit", {campground : foundCamp})
    }).catch(err => console.log(err))
    
})

// UPDATE
router.put("/:id",middlewareObj.checkCampOwner,(req,res)=>{

    Campground.findById(req.params.id).then((foundCamp)=>{
        foundCamp.updateOne(req.body.camp).then((camp)=>{
            req.flash("success","Camp Updated")
            res.redirect(`/campgrounds/${req.params.id}`)
        }).catch((err)=>{
            console.log(err)
            res.redirect("/campgrounds")
        })
    }).catch(err => console.log(err))
    
})

// Delete Camp
router.delete("/:id",middlewareObj.checkCampOwner,(req,res)=>{
    Campground.findById(req.params.id).then((foundCamp)=>{
        foundCamp.deleteOne().then(()=>{
            req.flash("success","Camp Deleted")
            res.redirect("/campgrounds")
        }).catch((err)=>{
            res.redirect(`/campgrounds/${req.param.id}`)
        })
    }).catch(err=> console.log(err))
})

module.exports = router;