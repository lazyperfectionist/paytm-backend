const  express = require('express');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config')
const { authMiddleware } = require('../middlewares');
const {User, Account} = require('../db')
const {userSchema,loginSchema,updateSchema} = require('../types');

const router = express.Router()

router.post('/signup',async(req,res)=>{
    const {username,password,firstName,lastName} = req.body;
    const userPayload = {username,password,firstName,lastName};
    const parsedPayload = userSchema.safeParse(userPayload);
    if(parsedPayload.success){
        const user = await User.findOne({username});
        if(user){
            return res.status(411).json({
                message:"Email already taken ",
            })
        }
        else{   
            const user = new User({username,password,firstName,lastName});
            await user.save()
            const amount = new Account({userId:user._id,balance:1000});          
            await amount.save();
            return res.json({
                message:"User created successfully!!",
                user:user,amount:amount
            })
        }
    }
    else{
        return res.status(400).json({
            message:"Invalid Inputs : ",
            payload:parsedPayload
        })
    }
})

router.post('/signin',async(req,res)=>{
    const {username,password} = req.body;
    const userPayload = {username,password};
    const parsedPayload = loginSchema.safeParse(userPayload);
    if(parsedPayload.success){
        const user = await User.findOne({username});
        if(user){
            const token = jwt.sign({userId:user._id},JWT_SECRET);
            if(user.password === password){
                return res.json({
                    token:token,
                    userId:user._id
                })
            } 
            return res.status(400).json({
                message:"Wrong password !!!" 
            })
        }
        return res.status(400).json({
            message:"User not Found !! Please Signup!!"
        })
    }
    else{
        return res.status(411).json({
            message:"Invalid Inputs !!"
        })
    }
})

router.put('/',authMiddleware,async(req,res)=>{
    const updatePayload = req.body;
    const parsedPayload = updateSchema.safeParse(updatePayload);
    if(parsedPayload.success){
        const userId = req.userId;
        const user = await User.findByIdAndUpdate(userId, updatePayload ,{new:true})
        return res.json({userId,user})    
    }
    else{
        return res.status(411).json({message:"Error while updating information"})
    }
})


// Testing route in prod : 
router.get('/testing',(req,res)=>{
    return res.json('Successfull request')
})

router.get('/bulk',authMiddleware,async(req,res)=>{
    const filter = req.query.filter || "";
    const users = await User.find({
        $or:[{
            firstName:{
                "$regex":filter
            },
            lastName:{
                "$regex":filter
            }
        }]
    })
    return res.json({
        user:users.map((user=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            userId:user._id
        })))
    })
})

module.exports = router; 