const express = require('express');
const router = express.Router();
const {InitiateTransaction, verifyTransaction, getTransaction} = require('../controllers/transactionController')
const {protect} = require('../middleware/authMiddleware')


router.post('/transaction/initiate', InitiateTransaction)
router.post('/transaction/verify', verifyTransaction)
router.get('/transaction/:id', getTransaction)

module.exports=router
