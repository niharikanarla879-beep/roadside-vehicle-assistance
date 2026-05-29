const User = require('../models/User');
const Mechanic = require('../models/Mechanic');
const Booking = require('../models/Booking');
const bcrypt = require('bcryptjs');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get all mechanics
exports.getAllMechanics = async (req, res) => {
    try {
        const mechanics = await Mechanic.find().select('-password');
        res.status(200).json(mechanics);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Approve mechanic
exports.approveMechanic = async (req, res) => {
    try {
        const mechanic = await Mechanic.findById(req.params.id);

        if (!mechanic) {
            return res.status(404).json({ message: 'Mechanic not found' });
        }

        mechanic.isApproved = true;
        await mechanic.save();

        res.status(200).json({ message: 'Mechanic approved successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Reject/Delete mechanic
exports.deleteMechanic = async (req, res) => {
    try {
        const mechanic = await Mechanic.findById(req.params.id);

        if (!mechanic) {
            return res.status(404).json({ message: 'Mechanic not found' });
        }

        await mechanic.deleteOne();

        res.status(200).json({ message: 'Mechanic deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.deleteOne();

        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name phone email')
            .populate('mechanic', 'name phone specialization')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalMechanics = await Mechanic.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const pendingMechanics = await Mechanic.countDocuments({ isApproved: false });
        const completedBookings = await Booking.countDocuments({ status: 'Completed' });
        const pendingBookings = await Booking.countDocuments({ status: 'Pending' });

        res.status(200).json({
            totalUsers,
            totalMechanics,
            totalBookings,
            pendingMechanics,
            completedBookings,
            pendingBookings
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Create admin account
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: 'admin'
        });

        res.status(201).json({ message: 'Admin created successfully!', admin });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};