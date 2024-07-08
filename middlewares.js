const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('./config')



function authMiddleware(req,res,next){
    let authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(403).json({message:"Token not Found !!"})
    }
    else{
        try{
            const token =  authHeader.split(" ")[1];
            const data = jwt.verify(token,JWT_SECRET);
            req.userId=data.userId;
            next();
        }
        catch(err){
            return res.status(403).json({message:"Invalid Token"})
        }
    }
}
 
module.exports = {authMiddleware};  