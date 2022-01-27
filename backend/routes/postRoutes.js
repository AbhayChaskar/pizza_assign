const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const nodemailer=require('nodemailer')
const jwt=require("jsonwebtoken");
const jwtSecret="wbycduwbeuy37642bd2buid2";

function autenticateToken(req,res,next){
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];
    console.log(token)
    if(token==null){
        res.json({"err":1,"msg":"Token not match"})
    }
    else {
        jwt.verify(token,jwtSecret,(err,data)=>{
            if(err){
                res.json({"err":1,"msg":"Token incorrect"})
            }
            else {
                console.log("Match")
                next();
            }
        })
    }
}

// const fs=require('fs')
//dbconnection 
const db = "mongodb://localhost:27017/pizza";
const connectDB = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true });
        console.log("MongoDB connected")
    }
    catch (err) {
        console.log(err.message);
    }
}
connectDB();
//end
const displaymodel = require('../db/displaySchema')
const ordersmodel = require('../db/OrdersSchema')
const registermodel= require('../db/RegisterSchema')

router.post("/adduser",(req,res)=>{
    // console.log(req.body)
    let ins = new registermodel({ name: req.body.name, mobile: req.body.mobile,email:req.body.email,password:req.body.password });
    ins.save((err) => {
        if (err) {
            console.log(err)
            res.send("Already Added")
        }
        else {
            res.send("ok")
        }
    })
})
router.get("/verify",(req,res)=>{
    registermodel.find({}, (err, data) => {
        if (err) throw err;
        res.json({ 'data': data })
    })
    
})
router.get("/fetchpost",autenticateToken, (req, res) => {
    displaymodel.find({}, (err, data) => {
        if (err) throw err;
        res.json({ 'data': data })
    })

})

router.get("/fetchorders", (req, res) => {
    ordersmodel.find({}, (err, data) => {
        if (err) throw err;
        res.json({ 'data': data })
    })

})

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'abhayrc.521@gmail.com',
        pass: '@aabby520C'
    }
});
  
  
router.post("/addorder", (req, res) => {
    //    console.log()
    // console.log("post called")

    //     console.log(`add post called `);
    console.log(req.body.cart)
    let name = [];
    let price=0;
    
    for (let i = 0; i < req.body.cart.length; i++) {
             price=price+req.body.cart[i].price;
        if (i != (req.body.cart.length - 1)) {
            name.push(req.body.cart[i].name + ",")
            
        }
        else if (i = (req.body.cart.length - 1)) {
            name.push(req.body.cart[i].name)
           
        }

    }
    let ins = new ordersmodel({ name: name, card: req.body.card,price:price,user:req.body.user });
    ins.save((err) => {
        if (err) {
            console.log(err)
            // res.send("Already Added")
            console.log("Already Added to cart")
        }
        else {
            // res.send("ok")
            console.log("Added to cart")
        }
    })

    let mailDetails = {
        from: 'abhayrc.521@gmail.com',
        to: 'abhayrc.521@gmail.com',
        subject: 'PizzHouse Order details',
        text: `Order Details 
        order total - ${price}`
    };
 
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log(err)
            // console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
res.send("ok")

})

// router.post("/addorder", (req, res) => {
//     //    console.log()
//     // console.log("post called")

//     //     console.log(`add post called `);
//     console.log(req.body.cart)
//     let name = [];
//     let price=0;
//     for (let i = 0; i < req.body.cart.length; i++) {
//              price=price+req.body.cart[i].price;
//         if (i != (req.body.cart.length - 1)) {
//             name.push(req.body.cart[i].name + ",")     

//         }
//         else if (i = (req.body.cart.length - 1)) {
//             name.push(req.body.cart[i].name)
           
//         }
//     }

//     let ins = new ordersmodel({ name: name, card: req.body.card,price:price,user:req.body.user });
//     ins.save((err) => {
//         if (err) {
//             console.log(err)
//             res.send("Already Added")
//         }
//         else {
//             res.send("ok")
//         }
//     })

// })

router.post("/login", (req, res) => {
    let email=req.body.email;
    let password=req.body.password;
    registermodel.findOne({email:email,password:password},(err,data)=>{
        if(err){
            res.json({"err":1,"msg":"Email or password is invalid"})
        }
        else if(data==null){
            res.json({"err":1,"msg":"Email or password is invalid"})
        }
        else{
            let payload={
                uid:email
            }
            const token=jwt.sign(payload,jwtSecret,{expiresIn:36000})
            res.json({"err":0,"msg":"Logged in successfully","token":token})
        }
    })
})

module.exports = router;