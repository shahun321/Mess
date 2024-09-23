// var collection = require('../config/connection')
const {adminLoginCollection}=require('../config/connection')
var collection = require('../config/collections')
const bcryptjs = require('bcryptjs')


module.exports = {

    adminSignup: (adminData) => {
        return new Promise(async (resolve, reject) => {
            console.log(adminData);
            
            let response = {};
            const existingAdmin = await adminLoginCollection.findOne({ email: adminData.email });
            if (!existingAdmin) {
                
                        adminData.password = await bcryptjs.hash(adminData.password, 10)
                        // console.log(userData.password);
        
                        adminLoginCollection.create(adminData).then((status) => {
                            response.status = true;
                            response.admin = adminData
                            resolve(response)
                        })
                    
                
                

            } else {

                resolve({ status: false })
            }

        })

    },
    adminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            const admin = await adminLoginCollection.findOne({ email: adminData.email });
            if (admin) {
                bcryptjs.compare(adminData.password, admin.password).then((status) => {
                    if (status) {

                        response.admin = admin
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