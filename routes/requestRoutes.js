const express = require('express');
const router = express.Router();

const Request = require('../models/Request');
router.get("/my-requests", async (req, res) => {

    const requests = await Request.find();

    res.render("myRequests", { requests });

});
router.post('/create', async (req, res) => {

    try {
        console.log(req.body);
        const {
            userName,
            vehicleType,
            problem,
            location
        } = req.body;

        await Request.create({
            userName,
            vehicleType,
            problem,
            location,
            status: 'Pending'
        });

        res.redirect('/user-dashboard');

    } catch (error) {

        console.log(error);
        res.send('Request Error');

    }

});

module.exports = router;