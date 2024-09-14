var express = require('express');
var router = express.Router();
const userHelper = require('../helpers/user-helper')
const bcryptjs = require('bcryptjs');
var collection = require('../config/connection') 



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login',(req,res)=>{
  res.render('user/login')
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup', async (req,res)=>{
  
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };
  
  const existingUser = await collection.findOne({name: data.name});

  if(existingUser){
    return res.render("User Exists");
  }else{
    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(data.password, saltRounds);
    data.password = hashedPassword;

    try{
      const userData = await collection.create(data);
      console.log(userData);
      res.render("index")
    } catch (error){
      console.error(error);
      res.render("error")
    }
  }
});

router.post('/login', async (req, res)=>{
  try{
    const user = await collection.findOne({email:req.body.email});
    if(!user){
      return res.send("User not found");
    }
    const passwordMatch = await bcryptjs.compare(req.body.password, user.password);

    if (passwordMatch){
      res.render("index");
    }else{
      res.send("Wrong Password");
    }
  }catch (error){
    console.log(error);
    res.render("error")
  }
})






module.exports = router;