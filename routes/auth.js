const express = require('express');
const User = require('../models/users');
const {register , login , contact , getContects , getUser , verifyOtp} = require('../controller/UserController');
require('dotenv').config();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../uploader/imageUploader');


const router = express.Router();

// ✅ Register
router.post('/register', upload.single('profile'), register);


// ✅ Login
router.post('/login', login );

// ✅ Add Contact (Protected)
router.post('/contacts', authMiddleware, contact);

// ✅ Get All Contacts (Protected)
router.get('/contacts', authMiddleware, getContects);


// ✅ Get user data (protected)
router.get('/me', authMiddleware, getUser);

// verify otp
router.post('/verify-otp', verifyOtp )


module.exports = router;
