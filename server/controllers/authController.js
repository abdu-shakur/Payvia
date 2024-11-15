const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')


const register = asyncHandler(async(req, res) => {
    const { name, email, password, username, phoneNumber } = req.body
    if (!name || !email || !password || !username || !phoneNumber) {
        res.status(400)
         throw new Error('Enter all field');
         
    }
    const userExists = await User.findOne( {email} )
    if (userExists) {
        res.status(400)
        throw new Error('User already exist')
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword =await bcrypt.hash(password, salt)

    const user = await User.create({name, email, username, phoneNumber, password: hashedPassword})
    if (user){
        res.status(200).json({id: user._id, name: user.name, email: user.email})
    }else{
        res.status(400)
        throw new Error("Invalid credencials");
        
    }
})

const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email})
    const passwordConfirm = await bcrypt.compare(password,user.password)
    if (user && passwordConfirm){
        console.log('Login successful')
        res.status(200).json({_id: user.id, name: user.name, email: user.email, token: generateJWTtoken(user._id, user.name)})
    }else{
        res.status(400)
        throw new Error("Invalid data");
        
    }
    
    res.status(200).json({message: 'Logged In Successfully'})
})
const getUser = asyncHandler(async(req, res) => {
    const { _id, name, email } = await User.findById(req.user.id)
        res.status(200).json({ id: _id, name, email })
})

const generateJWTtoken = (id,name) => jwt.sign({id,name}, process.env.JWT_SECRET, {expiresIn: '1d'})
module.exports = { register, login, getUser }