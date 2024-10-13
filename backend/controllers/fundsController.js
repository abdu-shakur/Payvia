const asyncHandler = require('express-async-handler')
const fundsModel = require('../models/fundsModel')


const depositFunds=asyncHandler(async (req,res) => {
    res.status(200).json('deposit successful')
})
const withdrawFunds=asyncHandler(async (req,res) => {
    res.status(200).json('Withdrawn successfully')
})
const sendFunds=asyncHandler(async (req,res) => {
    res.status(200).json('Sent successfully')
})
const walletBalance=asyncHandler(async (req,res) => {
    //const {currency, value} = req.body
    const userId = req.user.id;
    let userFunds = await fundsModel.findOne({userId});
    if (!userFunds) {
        userFunds = await fundsModel.create({userId: req.user._id})
        // res.status(404).json({ message: 'User not Found' })
    }
    res.status(200).json({
        currency: userFunds.balance.currency, value: userFunds.balance.value
    })
})

module.exports = {depositFunds, sendFunds, withdrawFunds, walletBalance}