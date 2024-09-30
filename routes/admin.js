var express = require('express');
var router = express.Router();
const adminHelper = require('../helpers/admin-helper')
const productHelper = require('../helpers/product-helper')
const fs = require('fs')
const verifyAdmin = (req, res, next) => {
    if (req.session.adminLoggedIn) {
        next()
    } else {
        res.redirect('/admin/')
    }
}



router.get('/', (req, res) => {
    let admin = req.session.admin;
    if (admin) {
        res.redirect('/admin/dashboard')
    } else {
        res.render('admin/login', { "loginErr": req.session.adminLoginErr, admin: true })
        req.session.adminLoginErr = false;
    }
})

router.get('/signup', (req, res) => {
    res.render('admin/signup', { "signupErr": req.session.adminSignupErr })
    req.session.adminSignupErr = false
})

router.post('/signup', async (req, res, next) => {

    adminHelper.adminSignup(req.body).then((response) => {



        if (response.status) {
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded.');
            }

            let adminImage = req.files.profile_image;
            let email = req.body.email
            let uploadPath = './public/images/admin_profile/' + email + '.png';

            // Use the mv() method to place the file somewhere on your server
            adminImage.mv(uploadPath, function (err) {
                if (err)
                    return res.status(500).send(err);
            });

            req.session.admin = response.admin
            req.session.adminLoggedIn = true


            res.redirect('/admin/dashboard')
        } else {
            req.session.adminSignupErr = "Admin already registered"
            res.redirect('/admin/signup')
        }
    })
});

router.post('/login', async (req, res) => {
    adminHelper.adminLogin(req.body).then((response) => {

        // console.log(response.user)
        if (response.status) {
            req.session.admin = response.admin;
            req.session.adminLoggedIn = true;
            res.redirect('/admin/dashboard')
        } else {
            req.session.adminLoginErr = "Invalid username or password"
            res.redirect('/admin/')
        }
    })
})

router.get('/dashboard', verifyAdmin, (req, res) => {
    let admin = req.session.admin
    res.render('admin/dashboard', { admin })

})
router.get('/logout', (req, res) => {
    if (req.session.admin) {
        req.session.admin = null;
        req.session.adminLoggedIn = false
        res.redirect('/admin/')
    } else {
        res.redirect('/admin/')
    }
})

router.get('/addmenu', verifyAdmin, (req, res) => {
    let admin = req.session.admin;
    res.render('admin/add-menu', { admin })
})

router.post('/addmenu', async (req, res) => {

    productHelper.addProduct(req.body, (proId) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return;
        }

        let productImage = req.files.product_image;
        let id = proId
        let uploadPath = './public/images/product_image/' + id + '.png';

        // Use the mv() method to place the file somewhere on your server
        productImage.mv(uploadPath, function (err) {
            if (err)
                return res.status(500).send(err);
        });

    })


    res.redirect('/admin/addmenu')

})

router.get('/allproducts', verifyAdmin, (req, res) => {
    productHelper.getAllProducts().then((products) => {
        let admin = req.session.admin
        res.render('admin/all-products', { products, admin })
    })
})

router.get('/editproduct/:id', verifyAdmin, (req, res) => {
    let admin = req.session.admin
    productHelper.getProductDetails(req.params.id).then((products) => {

        res.render('admin/edit-product', { products, admin })
    })
})

router.post('/editproduct/:id', (req, res) => {
    productHelper.updateProduct(req.params.id, req.body,req.files).then(() => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return;
        }

        let productImage = req.files.product_image;
        let id = req.params.id
        let uploadPath = './public/images/product_image/' + id + '.png';

        productImage.mv(uploadPath, function (err) {
            if (err)
                return res.status(500).send(err);
        });
        
        res.redirect('/admin/allproducts')
    })
})

router.get('/deleteproduct/:id',(req,res)=>{
    
    productHelper.deleteProduct(req.params.id).then((response)=>{
        fs.unlink( './public/images/product_image/' + req.params.id + ".png", (err) => {
            if (err) throw err;
          });
        console.log(response)
        res.redirect('/admin/allproducts')
    })
})


module.exports = router;