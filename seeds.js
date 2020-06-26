const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Comment = require("./models/comment")

const data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    },
    {
        name: "Desert Mesa", 
        image: "https://media-cdn.tripadvisor.com/media/photo-s/09/ce/d4/f9/atta-desert-camp.jpg",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
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