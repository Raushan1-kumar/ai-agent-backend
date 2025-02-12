
import userModel from '../models/user.model.js'



export const createUser = async({
    email, password
})=>{
    if (!email || !password) {
        throw new Error('Email and password are required');
    }
    try {
        const hashpassword =  await userModel.hashPassword(password);
        console.log(hashpassword);
        const newUser = new userModel({
            email,
            password:hashpassword
        });
        await newUser.save();
        return newUser;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
}

export const getAllUser = async({userId}) => {
    try {
        const users = await userModel.find({_id:{$ne:userId}});
        return users;
    } catch (error) {
        throw new Error('Error fetching users: ' + error.message);
    }
}