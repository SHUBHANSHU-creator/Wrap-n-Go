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
const MongoStore = require('connect-mongo');
const axios = require('axios').default;


const app= express()

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'));
app.use(express.json({
  type: "*/*"
}))






//-----------------------------Database connections------------------------------

// const connection=mongoose.connection;
mongoose.connect('mongodb://localhost:27017/newuse');




//Collections imported
const User=require('./models/user');
const Dish=require('./models/dish');
//const Cart=require('./models/cart');
const Order=require('./models/order');
const e = require('connect-flash');
const { request } = require('express');



//Session Config 
app.use(session({
    secret: 'my name is shubhanshu',
    resave: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/newuse'
    }),
    unset: 'destroy',
    saveUninitialized: false,
    cookie: {maxAge:1000 *60* 60}//timelimit for the session->60 mins
 }))


//  app.use(function(req,res){
//     res.locals.session=req.session
    
// })


app.use(passport.initialize());
app.use(passport.session()); 
app.use(flush());




passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// 1.register
// 2.login
// 3.home
// 4.cart
// 5.subscription
// 6.order
// 7.all orders
// 8.logout




//get requests
let dish_ar=[]
Dish.find(async function(err,dishes){
    if(err){
        console.log(err);
    }else{
        dish_ar=dishes;
        return
    }
})


app.get('/',function(req,res){
    // console.log(dish_ar);
    res.render('home',{dishes:dish_ar,message:req.flash('message')});
    
})




app.post('/',function(req,res){
    // p_id=req.body.id
    // console.log(req.body);
    
    
    
})


app.get('/register',function(req,res){
    res.render('register',{message:req.flash('message')})
    
})

app.get('/login',function(req,res){
    res.render('login',{message:req.flash('message')})
})

// app.get('/update_pwd',function(req,res){
//     res.render('update_pwd')
// })

app.get('/subscribe',function(req,res){
     res.render('subscribe',{message:req.flash('message')})
})






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




// ------------------------mailing for update password-------------------

let value=false

app.get('/update-pwd',function(req,res){
    res.render('update-pwd',{value:value,message:req.flash('message')}) 
})



//xhmmhwzvnxxromtk
app.post('/update-pwd',function(req,res){
    OT=0
    if(!value){
        var OTP=Math.floor(Math.random() * 9999) + 1000;
        OT=OTP
        var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "shukumarbham0@gmail.com",
          pass: "xhmmhwzvnxxromtk"
        }
      });
      
      message = {
        from: "shukumarbham0@gmail.com",
        to: req.body.username,
        subject: 'OTP to update password',
        text: OTP.toString()
        }
   transporter.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
          req.flash('message', err);
        } else {
          console.log(info);
          value=true
        //   console.log(OTP);
          res.render('update-pwd',{value:value,OTP:OTP.toString()})
        }
    })
    }else{
        console.log(req.body.OTP,req.body.OT);
        if (req.body.OTP==req.body.OT){
            req.flash('message', 'Correct OTP');
            res.redirect('/')
        }else{
            value=false
            res.render('update-pwd',{value:value})
        }
    }
    
    
    
    
})




    // ------enter flash function???????????????????????????????
    

    // if(a==req.body.otp){
    //     res.redirect('/login')
    // }else{
    //     res.send('wrong password')
    // }









app.get('/subscription',function(req,res){
    if(req.isAuthenticated()){
        if(cart_ar.length>0){
            for(let i=0;i<cart_ar.length;i++){
                if(cart_ar[i][0]=='Tiffin'){
                    req.flash('message', 'You are already Subscribed to our tiffin service');
                    res.redirect('/')
                }else{
                    cart_ar.push(['Tiffin',500,"food/meal.jpg",1])
                    total_price+=500
                    res.redirect('/cart')
                }
                
            }
        }else{
            cart_ar.push(['Tiffin',500,"food/meal.jpg",1])
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
    let cart_ar=[]
    let total_price=0
    
    ses=req.session.cart
    if(ses){
        let keyss=Object.keys(req.session.cart.items)
        keyss.forEach(function(key){
            cart_ar.push([ses.items[key].item.name,ses.items[key].item.price,ses.items[key].item.img,ses.items[key].qty])
        })


        for(let i=0; i<cart_ar.length;i++){
            total_price+=cart_ar[i][1]*cart_ar[i][3]
        }

        console.log(cart_ar);
        res.render('cart',{carts:cart_ar,totalPrice:total_price})
        
        // console.log(req.session.cart);
    }else{
        let noprod="No products found"
        res.render('cart',{carts:cart_ar,noprod:noprod,totalPrice:total_price})
    }

    

    
        

        
    
    


    
})




app.post('/update-cart',function(req,res){
    if(!req.session.cart){
        req.session.cart={
            items:{},//items{productid:{qty:0}}
            totalQty:0,
        }
    }  
    let cart= req.session.cart
    if(!cart.items[req.body._id]){
        cart.items[req.body._id]={item:req.body,
            qty:1 
        }
        cart.totalQty=cart.totalQty+1
        // cart.totalPrice=cart.totalPrice+req.body.price
    }else{
        cart.items[req.body._id].qty=cart.items[req.body._id].qty+1
        cart.totalQty=cart.totalQty+1
        // cart.totalPrice=cart.totalPrice+req.body.price
    }
    
    
    
    
    res.redirect('/')
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
