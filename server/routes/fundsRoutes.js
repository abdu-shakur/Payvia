const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const { withdrawFunds, depositFunds, sendFunds, walletBalance } = require('../controllers/fundsController')

router.post('/deposit', depositFunds)
router.post('/withdraw', withdrawFunds)
router.post('/send', sendFunds)
router.get('/balance',protect, walletBalance)


module.exports = router