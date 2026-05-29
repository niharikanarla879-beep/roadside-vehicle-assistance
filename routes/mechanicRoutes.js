const express = require('express');
const router = express.Router();
const Request = require("../models/Request");
const {
    getProfile,
    getMyBookings,
    acceptBooking,
    startService,
    completeBooking,
    updateAvailability,
    updateProfile
} = require('../controllers/mechanicController');
const { protect, isMechanic } = require('../middleware/auth');
const {
  mechanicDashboard,} = require('../controllers/mechanicController');
router.get('/profile', protect, isMechanic, getProfile);
router.get('/bookings', protect, isMechanic, getMyBookings);

router.put('/profile', protect, isMechanic, updateProfile);
router.get('/mechanic-dashboard', mechanicDashboard);


//accept Route

router.post("/accept-booking/:id",async (req, res) => {

    await Request.findByIdAndUpdate(req.params.id, {
        $set: {
            status: "Accepted",
            mechanicName:'YOUR_MECHANIC_NAME',
            mechanicPhone: 'YOUR_PHONE'
        }
    });

    res.redirect("/api/mechanic/mechanic-dashboard");

});


//start Route

router.post("/start-service/:id", async (req, res) => {

    await Request.findByIdAndUpdate(req.params.id, {
        $set: {
            status: "Ongoing"
        }
    });

    res.redirect("/api/mechanic/mechanic-dashboard");

});


//complete Route

router.post("/complete-service/:id", async (req, res) => {

    await Request.findByIdAndUpdate(req.params.id, {
        $set: {
            status: "Completed",
            paymentStatus: "Pending",
            totalAmount: req.body.totalAmount
        }
    });

    res.redirect("/api/mechanic/mechanic-dashboard");

});


//payment Route


router.post('/payment/:id', async (req, res) => {

    try {

        await Request.findByIdAndUpdate(req.params.id, {
            paymentStatus: 'Paid'
        });

        res.redirect('/api/mechanic/mechanic-dashboard');

    } catch (error) {

        console.log(error);
        res.send('Payment Error');

    }

});


module.exports = router;