const Booking = require('../models/Booking');
const Mechanic = require('../models/Mechanic');
const User = require('../models/User');

// Get all available mechanics
exports.getAvailableMechanics = async (req, res) => {
    try {
        const mechanics = await Mechanic.find({  
            "isApproved": true,
            "isAvailable": true

        });
        res.status(200).json(mechanics);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Create a booking
exports.createBooking = async (req, res) => {
    try {
        const { mechanicId, serviceType, location, description } = req.body;

        const mechanic = await Mechanic.findById(mechanicId);
        if (!mechanic || !mechanic.isAvailable) {
            return res.status(400).json({ message: 'Mechanic not available' });
        }

        const booking = await Booking.create({
            user: req.user.id,
            mechanic: mechanicId,

            userName: req.user.name,
            vehicleType: serviceType,

            serviceType,
            location,
            description
        });

        // Mark mechanic as unavailable
        mechanic.isAvailable = false;
        await mechanic.save();

        res.status(201).json({ 
            message: 'Booking created successfully!', 
            booking 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get user's bookings
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('mechanic', 'name phone specialization location rating')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (booking.status === 'Completed') {
            return res.status(400).json({ message: 'Cannot cancel completed booking' });
        }

        booking.status = 'Cancelled';
        await booking.save();

        // Make mechanic available again
        await Mechanic.findByIdAndUpdate(booking.mechanic, { isAvailable: true });

        res.status(200).json({ message: 'Booking cancelled successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Rate a mechanic
exports.rateMechanic = async (req, res) => {
    try {
        const { rating } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status !== 'Completed') {
            return res.status(400).json({ message: 'Can only rate completed bookings' });
        }

        const mechanic = await Mechanic.findById(booking.mechanic);
        mechanic.rating = rating;
        await mechanic.save();

        res.status(200).json({ message: 'Mechanic rated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};