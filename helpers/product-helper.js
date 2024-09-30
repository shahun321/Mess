var {productCollection} = require('../config/connection')
var objectId=require('mongodb').ObjectId;

module.exports={
    addProduct:(product,proId)=>{
            productCollection.create(product).then((product)=>{
                proId(product._id)
            
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
         let products = await productCollection.find().lean()

             resolve(products)
         
         
        })
    },
    getProductDetails:(proId)=>{
        return new Promise(async(resolve,reject)=>{
            let products = await productCollection.findOne({_id:new objectId(proId)}).lean()
                resolve(products)  
        })
    },
    updateProduct:(proId,product)=>{
        console.log(proId)
        return new Promise(async(resolve,reject)=>{
           await productCollection.findByIdAndUpdate(proId,product)
           resolve()
        })
    },
    deleteProduct:(proId)=>{
        return new Promise(async(resolve,reject)=>{
           await productCollection.findByIdAndDelete(proId).then((response)=>{
            resolve(response)
           })
        })
        
    }
}