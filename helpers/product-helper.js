var {productCollection} = require('../config/connection')
var objectId=require('mongodb').ObjectId;

module.exports={
    addProduct:(product)=>{
        return new Promise((resolve,reject)=>{
            productCollection.create(product).then((product)=>{
                resolve(product)
            })
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
         let products = await productCollection.find().lean()

             resolve(products)
         
         
        })
    }
}