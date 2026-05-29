const methodOverride = require('method-override');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Request = require('./models/Request');
const User = require('./models/User');
const app = express();


app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// MongoDB Connection

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected Successfully");
})
.catch((err) => {
    console.log(err);
});


// Routes

const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const mechanicRoutes = require('./routes/mechanicRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);

app.use('/api/request', requestRoutes);

app.use("/api/mechanic", mechanicRoutes);

app.use('/api/admin', adminRoutes);


// Pages

app.get("/logout", (req, res) => {

    res.redirect("/login");

});

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/user-dashboard', async (req, res) => {

    try {

        const requests = await Request.find().sort({ createdAt: -1 });

        const mechanics = await User.find({ role: 'mechanic' });

        res.render('userDashboard', {
            requests,
            mechanics
        });

    } catch (error) {

        console.log(error);

        res.send("Error loading dashboard");

    }

});

//mechanic-dashboard

app.get('/api/mechanic/mechanic-dashboard', async (req, res) => {

    try {

        const requests = await Request.find().sort({ createdAt: -1 });

        res.render('mechanicDashboard', {
            requests
        });

    } catch (error) {

        console.log(error);

        res.send("Error loading mechanic dashboard");

    }

});

// Start Server

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

