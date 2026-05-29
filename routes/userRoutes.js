const express = require('express');
const router = express.Router();

const {
    getAvailableMechanics,
    createBooking,
    getMyBookings,
    cancelBooking,
    rateMechanic,
    getProfile
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');

router.get('/mechanics', protect, getAvailableMechanics);

router.post('/booking', protect, createBooking);

router.get('/bookings', protect, getMyBookings);

router.put('/booking/cancel/:id', protect, cancelBooking);

router.put('/booking/rate/:id', protect, rateMechanic);

router.get('/profile', protect, getProfile);

module.exports = router;