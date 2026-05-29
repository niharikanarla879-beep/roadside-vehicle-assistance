const Booking = require('../models/Booking');
const Mechanic = require('../models/Mechanic');
const Request = require('../models/Request');
// Get mechanic profile
exports.getProfile = async (req, res) => {
    try {
        const mechanic = await Mechanic.findById(req.user.id).select('-password');
        res.status(200).json(mechanic);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get all bookings assigned to mechanic
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ mechanic: req.user.id })
            .populate('user', 'name phone location')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Accept a booking
exports.acceptBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.mechanic.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.status = 'Accepted';
        await booking.save();

        res.status(200).json({ message: 'Booking accepted!', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Start service (Ongoing)
exports.startService = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.mechanic.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (booking.status !== 'Accepted') {
            return res.status(400).json({ message: 'Booking must be accepted first' });
        }

        booking.status = 'Ongoing';
        await booking.save();

        res.status(200).json({ message: 'Service started!', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Complete a booking
exports.completeBooking = async (req, res) => {
    try {
        const { totalAmount } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.mechanic.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (booking.status !== 'Ongoing') {
            return res.status(400).json({ message: 'Service must be ongoing first' });
        }

        booking.status = 'Completed';
        booking.totalAmount = totalAmount;
        await booking.save();

        // Make mechanic available again
        await Mechanic.findByIdAndUpdate(req.user.id, { isAvailable: true });

        res.status(200).json({ message: 'Service completed!', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Update availability
exports.updateAvailability = async (req, res) => {
    try {
        const { isAvailable } = req.body;

        await Mechanic.findByIdAndUpdate(req.user.id, { isAvailable });

        res.status(200).json({ 
            message: `You are now ${isAvailable ? 'Available' : 'Unavailable'}` 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Update mechanic profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, specialization, location } = req.body;

        const mechanic = await Mechanic.findByIdAndUpdate(
            req.user.id,
            { name, phone, specialization, location },
            { new: true }
        ).select('-password');

        res.status(200).json({ message: 'Profile updated!', mechanic });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.mechanicDashboard = async (req, res) => {
    try {

        const requests = await Request.find();

        const totalRequests = requests.length;

        const completedRequests = requests.filter(
            r => r.status === "Completed"
        ).length;

        res.render("mechanicDashboard", {
            requests,
            totalRequests,
            completedRequests
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

exports.completeService = async (req, res) => {

    try {

        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).send("Request not found");
        }

        request.status = "Completed";

        request.totalAmount = req.body.totalAmount;

        await request.save();

        res.redirect("/mechanic-dashboard");

    } catch (error) {

        console.log(error);

        res.status(500).send("Server Error");

    }

};