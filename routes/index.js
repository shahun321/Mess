var express = require('express');
var router = express.Router();
const userHelper = require('../helpers/user-helper')
var fileUpload = require('express-fileupload');
const productHelper = require('../helpers/product-helper');
const verifyLogin = (req, res, next) => {
  if (req.session.userLoggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}





/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  if (req.session.user) {
    res.render('index', { user })
  } else
    res.render('index');
});

router.get('/login', (req, res) => {
  if (req.session.userLoggedIn) {
    res.redirect('/dashboard')
  } else {
    res.render('user/login', { "loginErr": req.session.userLoginErr })
    req.session.userLoginErr = false;
  }
})

router.get('/signup', (req, res) => {
  res.render('user/signup', { "signupErr": req.session.userSignupErr })
  req.session.userSignupErr = false
})

router.post('/signup', async (req, res, next) => {

  userHelper.doSignup(req.body).then((response) => {



    if (response.status) {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }

      let profileImage = req.files.profile_image;
      let email = req.body.email
      let uploadPath = './public/profile-pic/' + email + '.png';

      // Use the mv() method to place the file somewhere on your server
      profileImage.mv(uploadPath, function (err) {
        if (err)
          return res.status(500).send(err);
      });

      req.session.user = response.user
      req.session.userLoggedIn = true

      res.redirect('/dashboard')
    } else {
      req.session.userSignupErr = "Email already registered"
      res.redirect('/signup')
    }
  })
});

router.post('/login', async (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    // console.log(response.user)
    if (response.status) {
      req.session.user = response.user;
      req.session.userLoggedIn = true;
      res.redirect('/dashboard')
    } else {
      req.session.userLoginErr = "Invalid username or password"
      res.redirect('/login')
    }
  })
})

router.get('/dashboard', verifyLogin, (req, res) => {
  let user = req.session.user
  res.render('user/dashboard', { user })
})

router.get('/logout', (req, res) => {
  if (req.session.user) {
    req.session.user = null;
    req.session.userLoggedIn = false
    res.redirect('login')
  } else {
    res.redirect('/login')
  }
})

router.get('/menu', verifyLogin, (req, res) => {

  productHelper.getAllProducts().then((products) => {
    let user = req.session.user;
    res.render('user/menu', { products, user })
  })

})








module.exports = router;