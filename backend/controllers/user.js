var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
var User = require("../models/user.js")

exports.signin = async (req, res) => {
    const {email, password} = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if(!existingUser){
            res.status(404).json({message : "User does not exist"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid Credentials"});
        }

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn:"1h"});

        res.status(200).json({result: existingUser, token});
    } catch (error) {
        res.status(500).json({ message : "Something went wrong"});
    }
}

exports.signup = async (req, res) => {
    const {email, password, confirmPassword, firstName, lastName, } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if(existingUser){
            res.status(404).json({message : "User already exists"});
        }
        if(password != confirmPassword){
            res.status(404).json({message : "Passwords don't match"});
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await User.create({email, password:hashedPassword, name : `${firstName} ${lastName}`});
        const token = jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn:"1h"});
        res.status(200).json({result, token});
    } catch (error) {
        res.status(500).json({ message : "Something went wrong"});
        console.log(error);
    }
}

exports.verify = async (req, res) => {
    const userId = req.userId;
    try {
        res.status(200).json({userId});
    } catch (error) {
        res.status(500).json({ message : "Login again. JWT invalid or expired"});
        console.log(error);
    }
}