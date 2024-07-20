const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});

// Routes
const authRoutes = require('./routes/auth/authRoutes');
const monthlyDataRoutes = require('./routes/monthlyData/monthlyDataRoutes');
const expenseRoutes = require('./routes/expense/expenseRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/monthlydata', monthlyDataRoutes);
app.use('/api/expense', expenseRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
