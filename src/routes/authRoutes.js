const express = require('express');


const {singup , login } = require('../controllers/authController');


const router = express.Router();


// User Singup
router.post('/signup', singup);


// User Login
router.post('/login', login);


module.exports = router;