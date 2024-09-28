
var mongoose = require("mongoose");



const LoginSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
    
});

const AdminLoginSchema = new mongoose.Schema({
    name:{
        type: String,
        requied: true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:true
    }

});

const ProductSchema = new mongoose.Schema({
    product_name:{
        type: String,
        requied: true
    },
    product_category:{
        type:String,
        requied: true
    },
    product_price:{
        type:String,
        required:true
    },
    product_description:{
        type:String,
        required:true
    }
})


const loginCollection = new mongoose.model("users", LoginSchema)
const adminLoginCollection = new mongoose.model("admins", AdminLoginSchema)
const productCollection = new mongoose.model("products", ProductSchema)

module.exports = {
    loginCollection : loginCollection,
    adminLoginCollection : adminLoginCollection,
    productCollection : productCollection
}




