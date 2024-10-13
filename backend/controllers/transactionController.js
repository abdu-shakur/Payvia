const asyncHandler = require('express-async-handler')


const InitiateTransaction = asyncHandler(async (req,res) => {
    res.status(200).json('Transaction Initiated Successfully')
})
const verifyTransaction = asyncHandler(async (req,res) => {
    res.status(200).json('Transaction verified successfully')
})
const getTransaction = asyncHandler(async(req,res) =>{
    res.status(200).json("Transaction gotten")
})
module.exports = {InitiateTransaction, verifyTransaction, getTransaction}