const User = require('../models/User');
const Mechanic = require('../models/Mechanic');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register User
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, location } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            location
        });

      res.redirect('/user-dashboard');
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Register Mechanic
exports.registerMechanic = async (req, res) => {
    try {
        const { name, email, password, phone, specialization, location } = req.body;

        const existingMechanic = await Mechanic.findOne({ email });
        if (existingMechanic) {
            return res.status(400).json({ message: 'Mechanic already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const mechanic = await Mechanic.create({
            name,
            email,
            password: hashedPassword,
            phone,
            specialization,
            location
        });

        res.redirect('/login');
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        return res.redirect('/user-dashboard');
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Login Mechanic
exports.loginMechanic = async (req, res) => {
    try {
        const { email, password } = req.body;

        const mechanic = await Mechanic.findOne({ email });
        if (!mechanic) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, mechanic.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!mechanic.isApproved) {
            return res.send(`
    <script>
        alert('Admin not approved yet!');
        window.location.href = '/login';
    </script>
`);
        }

       return res.redirect('/api/mechanic/mechanic-dashboard')
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};