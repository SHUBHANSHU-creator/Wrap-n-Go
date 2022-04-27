const express=require('express')
const bodyParser=require('body-parser')
const ejs=require('ejs')
const mongoose=require('mongoose')
const nodemailer = require('nodemailer');
var session = require('express-session')
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose')
var flush = require('connect-flash')
// const mongoSession=require('connect-mongodb-session')
// const MongoDbStore=require('connect-mongo')(session)


const app= express()

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'));
app.use(express.json())



//Session Config 
app.use(session({
    secret: 'my name is shubhanshu',
    resave: false,
 //    store:mongoStore,
    saveUninitialized: false,
 //    cookie: {maxAge:1000*60*60*15}
 }))


app.use(passport.initialize());
app.use(passport.session()); 
app.use(flush());







//-----------------------------Database connections------------------------------

mongoose.connect('mongodb://localhost:27017/newuse');
// const connection=mongoose.connection;


//Collections imported
const User=require('./models/user');
const Dish=require('./models/dish');
//const Cart=require('./models/cart');
const Order=require('./models/order');
const e = require('connect-flash');



passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//Session Store
// let mongoStore=new MongoDbStore({
//                 mongooseConnection:connection,
//                 collection:'sessions'

//             })






// 1.register
// 2.login
// 3.home
// 4.cart
// 5.subscription
// 6.order
// 7.all orders
// 8.logout




//get requests
let dish_arr=[]
Dish.find(function(err,dishes){
    if (err){
        console.log(err);
    }else{
        dishes.forEach(function(dish){
            dish_arr.push([dish.id,dish.name,dish.price])
        })
    }
});


app.get('/',function(req,res){
    res.render('home',{dishes:dish_arr, message:req.flash('message')});
    
})

app.get('/register',function(req,res){
    res.render('register',{message:req.flash('message')})
    
})

app.get('/login',function(req,res){
    res.render('login')
})

// app.get('/update_pwd',function(req,res){
//     res.render('update_pwd')
// })

app.get('/subscribe',function(req,res){
     res.render('subscribe',{message:req.flash('message')})
})





//--------------------------------------------------Register page-------------------------------
//post request from register page
// app.post('/register',function(req,res){
//     //checking if password field and confirm password fields are same
//     if (req.body.password == req.body.password1){
//         //checking if the email is already registered
//         User.findOne({email:req.body.email},function(err,founduser){
//             if(err){
//                 console.log(err);
//             }else{
//                 if(founduser){
//                     res.send('email already exists')
//                 }else{
//                     User.findOne({phonenum:req.body.phnum},function(err,foundnum){
//                         if(err){
//                             console.log(err)
//                         }else{
//                             if(foundnum){//if already number is registered 
//                                 res.send('phone number already registered, please try using new number or login using previous one')
//                             }
//                             else{
//                                 //If phone number and email are not registered then create a new id for user 
//                                 //adding all the detais to the database
//                                 const newuser=new User({
//                                     Firstname:req.body.fname,
//                                     Lastname:req.body.lname,
//                                     adress:req.body.adress,
//                                     phonenum:req.body.phnum,
//                                     email:req.body.email,
//                                     password:req.body.password
//                                 })
                            
//                                 newuser.save(function(err){
//                                     if(err){
//                                         console.log(err)
//                                     }else{
//                                         res.redirect('/login')
//                                     }
//                                 })
//                             }
//                         }
//                     })

                    
//                 }
//             }
//         })
    
    
    
    

// }else{
//     //if password fields not matched then show error
//     res.send('password not matched')
//     res.render('register')
// }  
// });

app.post('/register',function(req,res){
    User.register({username:req.body.username},req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect('/register');
        }else{
            User.findOne({email:req.body.username},function(err,founduser){
                if(err){
                    console.log(err);
                }else{
                    if(founduser){
                        res.send('email already exists')
                    }else{
                            passport.authenticate('local')(req,res,function(){
                            res.redirect('/login')
                        })
                    }
                }
            }) 
        }
    })
})

//----------------------------------------------login page-------------------------------------

// app.post('/login',function(req,res){
//     User.findOne({username:req.body.email},function(err,founduser){
//         if(err){
//             res.send(err)
//         }else{
//             if(founduser){
//                 if(founduser.password==req.body.password){
//                     res.redirect('/')
//                 }else{
//                     res.send('Wrong Password')
//                 }
//             }else{
//                 res.send('You are not registered')
//             }
//         }
//     })
    
// })

app.post('/login',function(req,res){
    const user=new User({
        username:req.body.username,
        password:req.body.password
    })

    req.login(user,function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate('local')(req,res,function(){
                res.redirect('/')
            })
        }
    })
})




//------------------------mailing for update password-------------------
// app.post('/update_pwd',function(req,res){
//     var a=Math.floor(Math.random() * 9999) + 1000;
//     var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: "nikhita.garg2020@vitbhopal.ac.in",
//           pass: 'vit_Nik_10'
//         }
//       });
      
//       message = {
//         from: "nikhita.garg2020@vitbhopal.ac.in",
//         to: req.body.email,
//         subject: 'OTP to update password',
//         text: a
//         }
//    transporter.sendMail(message, function(err, info) {
//         if (err) {
//           console.log(err)
//         } else {
//           console.log(info);
//         }
//     })
// })


    //------enter flash function???????????????????????????????
    // res.end('Mail sent')

    // if(a==req.body.otp){
    //     res.redirect('/login')
    // }else{
    //     res.send('wrong password')
    // }


let cart_ar=[]
let total_price=0
let names=[]


app.post('/add-to-cart',function(req,res){
    let a=req.body.id  
    Dish.findOne({_id:a},function(err,founddish){
        // console.log(a);
        // console.log(founddish);
        if(err){
            res.send(err)
        }else{
            if(founddish){
                    cart_ar.push([founddish.name,founddish.price])
                    names.push(founddish.name)
                    total_price+=founddish.price
                
                // console.log(founddish.name,founddish.price);
                // if(founddish.name in names){
                //     for(let i=0;i<cart_ar.length;i++){
                //         if(founddish.name==cart_ar[i][0]){
                //             cart_ar[i][2]+=1
                //             total_price+=founddish.price
                //         }
                //     }
                    
                // }else{
                //     cart_ar.push([founddish.name,founddish.price,1])
                //     names.push(founddish.name)
                //     total_price+=founddish.price
                // }
                // console.log(names);
                


            }
        }
    })
    
    
});



// if(founddish){
//     // console.log(founddish.name,founddish.price);
//     for(let j=0;j<names.length;j++){
//         if(founddish.name==names[j]){
//             for(let i=0;i<cart_ar.length;i++){
//                 if(founddish.name==cart_ar[i][0]){
//                     cart_ar[i][2]+=1
//                     total_price+=founddish.price
//                 }
//             }
//         }
//         else{
//             cart_ar.push([founddish.name,founddish.price,1])
//             names.push(founddish.name)
//             total_price+=founddish.price
//         } 
//     }
// }


// for(let i=0;i<cart_ar.length;i++){
//     total_price+=cart_ar[i][1]
// }

// console.log(total_price)

app.get('/subscription',function(req,res){
    if(req.isAuthenticated()){
        if(cart_ar.length>0){
            for(let i=0;i<cart_ar.length;i++){
                if(cart_ar[i][0]=='Tiffin'){
                    req.flash('message', 'You are already Subscribed to our tiffin service');
                    res.redirect('/')
                }else{
                    cart_ar.push(['Tiffin',500])
                    total_price+=500
                    res.redirect('/cart')
                }
                
            }
        }else{
            cart_ar.push(['Tiffin',500])
            total_price+=500
            res.redirect('/cart')
        }
    }else{
        res.redirect('/register')
    }
})


app.get('/unsubscribe',function(req,res){
    if(req.isAuthenticated()){
        var index=-1
        for(let j=0;j<cart_ar.length;j++){
            if(cart_ar[j][0]=='Tiffin'){
                index=j
            }
        cart_ar.splice(index,1)
        req.flash('message', 'You have unsubscribed from the tiffin service');
        res.redirect('/')
        }
        
    }else{
        res.redirect('/register')
    }
})



app.get('/cart',function(req,res){
    res.render('cart',{carts:cart_ar, total:total_price})
})

app.get('/order',function(req,res){
    res.render('order')
})

let order_ar=[]


app.post('/order',function(req,res){
    if(req.isAuthenticated()){
        cart_ar.forEach(function(cart){
            order_ar.push(cart)
        })
        const neworder=new Order({
            Firstname:req.body.fname,
            Lastname:req.body.lname,
            phonenum:req.body.phnum,
            adress:req.body.adress,
        })
    
        neworder.save(function(err){
            if(err){
                console.log(err)
            }else{
                req.flash('message', 'order placed Successfully');
                cart_ar=[]
                total_price=0
                res.redirect('/')
            }
        })
    }else{
        res.redirect('/register')
    }
})

app.get('/all_orders',function(req,res){
    res.render('all_orders',{orders:order_ar})
})

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });


  


    
app.listen(3000,function(){
    console.log('server created')
})
