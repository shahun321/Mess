var express = require('express');
var router = express.Router();
const userHelper = require('../helpers/user-helper')
const bcryptjs = require('bcryptjs');
var loginCollection = require('../config/connection')
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}



/* GET home page. */
router.get('/', function(req, res, next) {
  let user = req.session.user
  if(req.session.user){
    res.render('user/dashboard')
  }else
  res.render('index', {user});
});

router.get('/login',(req,res)=>{
  
  
  if(req.session.user){
    res.redirect('/')
  }else{
  res.render('user/login')
}
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup', async (req,res)=>{
 userHelper.doSignup(req.body).then((response)=>{
  if(response.status){
   let user = response.user;
    req.session.userLogin=true
  // console.log(response)
  res.render('index',{user})
}else{
    req.session.signupErr="Email already registered"
    res.redirect('/signup')
  }
 }) 
});

router.post('/login', async (req, res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    let user = response.user
    if(response.status){
       req.session.user=response.user;
    req.session.loggedIn=true;
    res.render('index',{user})
    }
  })
  

    
  

})

router.get('/dashboard',(res,req)=>{
  res.render('user/dashboard')
})






module.exports = router;