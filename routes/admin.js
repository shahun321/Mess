var express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{
    res.render('index',{ name: 'ADMIN IS HERE' })
})


module.exports = router;