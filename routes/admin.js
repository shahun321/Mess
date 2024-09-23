var express = require('express');
var router = express.Router();
const adminHelper = require('../helpers/admin-helper')


router.get('/', (req, res) => {
    if (req.session.adminLoggedIn) {
        res.redirect('/dashboard')
    } else {
        res.render('admin/login', { "loginErr": req.session.adminLoginErr })
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
            let uploadPath = './public/images/admin_profile' + email + '.png';

            // Use the mv() method to place the file somewhere on your server
            adminImage.mv(uploadPath, function (err) {
                if (err)
                    return res.status(500).send(err);
            });

            req.session.admin = response.admin
            req.session.adminLoggedIn = true

            res.redirect('/admin/dashboard')
        } else {
            req.session.adminSignupErr = "Already registered Admin"
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
            req.session.userLoginErr = "Invalid username or password"
            res.redirect('/admin/')
        }
    })
})

router.get('/dashboard', (req, res) => {
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


module.exports = router;