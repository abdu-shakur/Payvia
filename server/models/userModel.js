const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required']
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true
        },
        email: {
            type: String,
            lowercase: true,
            required: [true, 'Email is required'],
            unique: true
        }, 
        phoneNumber: {
            type: Number,
            required: [true, 'Phone number is required'],
            unique: true
        },
        password: {
            type: String,
            requried: [true, 'Password is required']
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        }
    }
)

module.exports = mongoose.model('User', userSchema)