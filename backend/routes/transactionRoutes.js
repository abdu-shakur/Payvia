const express = require('express');
const router = express.Router();
const {InitiatePaystackTransaction,initiateLocalTransaction, verifyTransaction, getTransaction, transactionHistory} = require('../controllers/transactionController')
const {protect} = require('../middleware/authMiddleware')


router.post('/transaction/initiatePaystack',protect, InitiatePaystackTransaction)
router.post('/transaction/initiateLocal',protect, initiateLocalTransaction)
router.post('/transaction/verify',protect, verifyTransaction)
router.get('/transaction/:id', getTransaction)
router.get('/transactions',protect, transactionHistory)

module.exports=router
