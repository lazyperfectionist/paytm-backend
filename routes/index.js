const express = require('express');
const router = express.Router();


const userRouter = require('./users');
const accountRouter = require('./account');

router.use('/user',userRouter);    
router.use('/account',accountRouter)                  


router.get('/',(req,res)=>{
    return res.json({message:"Home page"})
})
 

module.exports = router;