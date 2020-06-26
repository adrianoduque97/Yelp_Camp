const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Comment = require("./models/comment")

const data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "blah blah blah"
    },
    {
        name: "Desert Mesa", 
        image: "https://media-cdn.tripadvisor.com/media/photo-s/09/ce/d4/f9/atta-desert-camp.jpg",
        description: "blah blah blah"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "blah blah blah"
    }
]

function seedDB() {

    //Remove Camps
    Campground.remove().then((camps) => {
        console.log("REMOVED ALL")
    }).then(()=>{
        //Add camps
        data.forEach((seed)=>{
            Campground.create(seed).then((camp) =>{
                console.log(`Created \n ${camp}`)
                // comment
                Comment.create({
                    text: "This place is great but no INternet",
                    author: "Adrian"
                }).then((comment)=>{

                    camp.comments.push(comment)
                    camp.save().then(()=>{console.log("ADDED Comment")}).catch(err=> console.log(err))

                }).catch(err=> console.log(err))

            } ).catch(err => console.log(err))
        })
    })
    .catch(err => console.log(err))

    
    
    
}

module.exports = seedDB;