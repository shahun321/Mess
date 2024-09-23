
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

})

const loginCollection = new mongoose.model("users", LoginSchema)
const adminLoginCollection = new mongoose.model("admins", AdminLoginSchema)
// var collection={loginCollection,adminLoginCollection}
module.exports = {
    loginCollection: loginCollection,
    adminLoginCollection:adminLoginCollection
}




