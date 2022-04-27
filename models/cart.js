const mongoose=require('mongoose');




    const cartSchema=new mongoose.Schema({
        name: {type: String },
        price: {type: Number}
    })

    const Cart=mongoose.model("Cart",cartSchema)


module.exports=Cart