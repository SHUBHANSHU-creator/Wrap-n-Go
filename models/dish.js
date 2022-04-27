const mongoose=require('mongoose');




    const dishSchema=new mongoose.Schema({
        name: {type: String },
        price: {type: Number}
    })
    const Dish= mongoose.model("Dish",dishSchema)


module.exports=Dish