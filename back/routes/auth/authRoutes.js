const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
require('dotenv').config();
const multer = require('multer');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

// Utility function to handle errors
const handleError = (res, error, message, statusCode = 500) => {
    console.error(error);
    res.status(statusCode).json({ message });
};



// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Get user details by username
router.get('/user/username/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new user
router.post('/user', async (req, res) => {
    const { username, firstName, lastName, email, password, role } = req.body;
    try {
        const newUser = new User({ username, firstName, lastName, email, password, role });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user details
router.put('/user/:id', async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, email, password, role },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a user
router.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Upload profile image
router.post('/upload-image', upload.single('image'), async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.image = req.file.path;
        await user.save();
        res.json({ image: req.file.path });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete profile image
router.delete('/delete-image/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.image = null;
        await user.save();
        res.json({ message: 'Image deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// Register
router.post('/register', async (req, res) => {
    const { username, firstName, lastName, email, password } = req.body;

    try {
        // Validate email format
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            monthlyData: [], // Initialize monthlyData as an empty array for new users
            totalBalance: 0, // Initialize totalBalance as 0 for new users
            role: email.endsWith('@admin.com') ? 'admin' : 'user'
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        handleError(res, error, 'Something went wrong');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Add login time to loginTimes array
        user.loginTimes.push({ loginTime: new Date() });
        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        res.status(200).json({ result: user, token });
    } catch (error) {
        handleError(res, error, 'Something went wrong');
    }
});

// Logout
router.post('/logout', async (req, res) => {
    const { userId, logoutTime } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the last login entry and set the logout time
        const lastLogin = user.loginTimes[user.loginTimes.length - 1];
        if (lastLogin) {
            lastLogin.logoutTime = logoutTime;
        }

        await user.save();

        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        handleError(res, error, 'Something went wrong');
    }
});

// Check if user exists
router.get('/checkuser', async (req, res) => {
    const { email } = req.query;

    try {
        const existingUser = await User.findOne({ email });
        res.status(200).json({ exists: !!existingUser });
    } catch (error) {
        handleError(res, error, 'Something went wrong');
    }
});

module.exports = router;
