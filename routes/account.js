const express = require('express');
const mongoose = require('mongoose')
const { authMiddleware } = require('../middlewares');
const { User, Account } = require('../db');

const router = express.Router();

router.get('/balance', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    const userBal = await Account.findOne({ userId: userId });
    return res.json({ username: user.username, balance: userBal.balance })
})

router.post('/transfer', authMiddleware, async (req, res) => {
    const sendersId = req.userId;
    const receiversId = req.body.to;
    const amount = req.body.amount;
    const session = await mongoose.startSession(); 
    session.startTransaction();
    try {
        const sendersAcc = await Account.findOne({ userId: sendersId }); 
        if(!sendersAcc){
            await session.abortTransaction();
            return res.json({message :"User Not Logged In !!"})
        }
        const receiversAcc = await Account.findOne({ userId: receiversId });
        if(!receiversAcc){
            await session.abortTransaction();
            return res.json({message:"Invalid User"})
        }
        if(sendersAcc.balance<amount){
            await session.abortTransaction();
            return res.json({message:"Insufficient Balance!!!",
                user:sendersAcc 
            })
        }
        await Account.updateOne(
            { userId: sendersId },
            { $inc: { balance: -amount } },
            { session }
        )
        await Account.updateOne(
            { userId:receiversId },
            { $inc : {balance: amount}},
            {session} 
        )
        await session.commitTransaction();
        session.endSession();
        return res.json({
            message:`Transaction SuccessFull ${amount}`,
            sendersId:sendersId,
            receiversId:receiversId,
            amount:amount
        })
    }
    catch (err) {
        return res.json({ message: "Transaction Failed : " + err })
    }
})

router.get('/allUsers', authMiddleware, async (req, res) => {
    const users = await User.find({});
    return res.json({
        users
    })
})

module.exports = router;