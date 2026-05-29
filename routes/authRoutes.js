const express = require('express');
const router = express.Router();

const {
    registerUser,
    registerMechanic,
    loginUser,
    loginMechanic
} = require('../controllers/authController');

router.post('/register/user', registerUser);

router.post('/register/mechanic', registerMechanic);

router.post('/login/user', loginUser);

router.post('/login/mechanic', loginMechanic);

module.exports = router;