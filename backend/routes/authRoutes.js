const express = require('express');
const router = express.Router();
const {login, register, getUser} = require('../controllers/authController')
const {protect} = require('../middleware/authMiddleware')



router.post('/', register)
router.post('/login', login)
router.get('/getUser',protect, getUser)



module.exports=router
