var loginCollection = require('../config/connection')
var collection = require('../config/collections')
const bcryptjs = require('bcryptjs')
const { USER_COLLECTION } = require('../config/collections')
var objectId = require('mongodb').ObjectId


module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {};
            const existingUser = await loginCollection.findOne({ email: userData.email });
            if (!existingUser) {
                
                        userData.password = await bcryptjs.hash(userData.password, 10)
                        // console.log(userData.password);
        
                        loginCollection.create(userData).then((status) => {
                            response.status = true;
                            response.user = userData
                            resolve(response)
                        })
                    
                
                

            } else {

                resolve({ status: false })
            }

        })

    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            const user = await loginCollection.findOne({ email: userData.email });
            if (user) {
                bcryptjs.compare(userData.password, user.password).then((status) => {
                    if (status) {

                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        resolve({ status: false })
                    }
                })

            } else {
                resolve({ status: false })
            }


        })
    }
}