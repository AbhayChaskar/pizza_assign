const mongoose=require('mongoose');
const OrderSchema=new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    name:{
        type:Array,
        required:true
       
    },
    card:{
        type:Number,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true
    },
    // image:{
    //     type:String,
    //     required:true
    // },
    // quantity:{
    //     type:Number,
    //     required:true
    // },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model("order",OrderSchema);