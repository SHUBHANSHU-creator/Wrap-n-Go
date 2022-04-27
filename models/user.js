const mongoose=require('mongoose');
const { Passport } = require('passport/lib');
const passportLocalMongoose=require('passport-local-mongoose')

    const userSchema=new mongoose.Schema({
        // Firstname: {type: String },
        // Lastname: {type: String },
        // adress: {type: String},
        // phonenum: {type: Number},
        email: {type: String},
        password: {type: String}

    });

    userSchema.plugin(passportLocalMongoose);

    const User=mongoose.model("User",userSchema)
    



module.exports=User