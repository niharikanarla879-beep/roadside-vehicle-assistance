const express = require('express');
const router = express.Router();
const Mechanic = require('../models/Mechanic');
const User = require('../models/User');

router.get('/dashboard', async (req, res) => {

    try {

        const mechanics = await Mechanic.find({
            isApproved: false
        });
        console.log(mechanics);
        res.render('adminDashboard', {
            mechanics
        });

    } catch (error) {

        console.log(error);

        res.send("Admin Dashboard Error");

    }

});
router.post('/mechanic/approve/:id', async (req, res) => {

    try {

        await Mechanic.findByIdAndUpdate(req.params.id, {
            isApproved: true
        });

        res.redirect('/api/admin/dashboard');

    } catch (error) {

        console.log(error);

        res.send('Approval Error');

    }

});

module.exports = router;