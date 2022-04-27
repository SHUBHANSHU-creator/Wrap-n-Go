const mongoose=require('mongoose');


    const orderSchema=new mongoose.Schema({
        Firstname: {type: String },
        Lastname: {type: String },
        adress: {type: String},
        phonenum: {type: Number},
    });

    const Order=mongoose.model("Order",orderSchema)
    



module.exports=Order