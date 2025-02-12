
import  userModel from '../models/user.model.js'
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';
import redisClient from '../services/redis.server.js';



export const createUserController = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await userService.createUser({ email, password });
        const token = user.generateAuthToken();
        console.log('hii')
        console.log(user.password);
        res.status(201).json({ user, token });
    } catch (error) {
        next(error);
    }
}

export const loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Find a single user and include the password
        const user = await userModel.findOne({ email }).select('+password');

        // If user not found
        if (!user) {
            return res.status(401).json({
                msg: "This email does not exist in the database",
            });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                msg: "Invalid password"
            });
        }

        // Generate Auth Token
        const token = user.generateAuthToken();

        res.status(200).json({
            msg: "User logged in successfully",
            user,
            token
        });

    } catch (err) {
        console.log(err);
        next(err);
    }
};


export const getProfile = async (req, res, next)=>{
    console.log(req.user)
    const user= req.user;
    res.status(200).json({
        user:user
    })
}

export const logOutUser = async(req, res, next)=>{
   try{
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    if(!token){
        res.status(401).json({
            msg:"unauthorized user"
        })
    }

    redisClient.set(token, 'logout', 'EX', 60*60 *24);
    
    res.status(200).json({
        msg:"logout successfully"
    })
   }catch(err){
    console.log(err)
   }
}

export const getAllUser=async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
try{
    const loggedInUser = await userModel.findOne({email:req.user.email});
    const userId = loggedInUser._id;

    const allUser= await userService.getAllUser({userId});
    res.status(200).json({
        msg:"all users are",
        users:allUser
    })
}catch(err){
    res.status(400).json({
        msg:"having trouble in fetching all users"
    })
}
    
  
}