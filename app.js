const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const Campground = require("./models/campground")
const Comment = require("./models/comment")
const seed = require('./seeds')

//seed();
mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true, useUnifiedTopology: true })
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine','ejs')



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

app.get("/campgrounds/:id/comments/new", (req,res)=>{
    Campground.findById(req.params.id).then((camp)=>{
        res.render("comments/new",{campground: camp})
    }).catch(err => console.log(err))
    
})

app.post("/campgrounds/:id/comments/", (req,res)=>{
    Campground.findById(req.params.id).then((camp)=>{
        Comment.create(req.body.comment).then((comment)=>{
            camp.comments.push(comment);
            camp.save().then(camp => console.log(`Created Comment ${camp}`)).catch(err=>console.log(err))
            //redirect
            res.redirect(`/campgrounds/${camp._id}`)

        }).catch(err=> console.log(err))
        
        
    }).catch(err => console.log(err))
    
})



app.listen(3000,()=>console.log("YelpCamp Server Started"))