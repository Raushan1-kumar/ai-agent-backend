import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength:[6,'Email must be at least of 6 character'],
        maxLength:[20, "Email can't be more than 20 character long"],
    },
    password:{
        type:String,
        select:false
    }
})


userSchema.statics.hashPassword = async function(password) {
    try {
        const hashedPassword = await bcrypt.hash(password,10);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};


userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw new Error('Error comparing password');
    }
};

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ email: this.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};



const Second = mongoose.model('Second', userSchema);

export default Second