const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')

mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true, useUnifiedTopology: true })
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine','ejs')

// SCHEMA

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})
const Campground = mongoose.model('Campground',campgroundSchema)
// Campground.create(
//     {name: "Salmon Creek", 
//     image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
//     description: "Salmon Creek Description camp, no bathroom"})
//                 .then(camp => console.log(camp))
//                 .catch(err=>console.log(err))

// var campgrounds = [
//     {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//     {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//     {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//     {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//     {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//     {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
// ];


app.get("/", (req,res)=>{
    res.render("landing")
})

app.get("/campgrounds", (req,res)=>{

    Campground.find()
                .then((camp)=>{
                    res.render('index',{campgrounds: camp})
                })
                .catch(err => console.log(err))

    //res.render('campgrounds',{campgrounds: campgrounds})

})

app.get("/campgrounds/new", (req,res)=>{

    res.render('new')

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
    Campground.findById(req.params.id)
            .then(camp => res.render("show",{campground: camp}))
            .catch(err=>console.log(err))   
    
   // Campground.find()

})


app.listen(3000,()=>console.log("YelpCamp Server Started"))