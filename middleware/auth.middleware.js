import jwt from 'jsonwebtoken'
import redisClient from '../services/redis.server.js';


export const authUser =async(req, res ,next)=>{
    try{
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
        
        if(!token){
            return res.status(401).json({
                msg:"unauthorized user"
            })
        }
        
        const isBlackListed = await redisClient.get(token);
        if(isBlackListed){
            res.cookie('token', '');
            return res.status(200).send({error: true});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(req.user);
        next();
    }
    catch(error){
        res.status(401).json({
            msg:"you are not authenticate user",
            error:error
        })
    }
}