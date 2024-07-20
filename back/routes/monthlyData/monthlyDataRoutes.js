const express = require('express');
const User = require('../../models/User');
const router = express.Router();

// Utility function to handle errors
const handleError = (res, error, message, statusCode = 500) => {
    console.error(error);
    res.status(statusCode).json({ message });
};

// Fetch all monthly data for a user by username
router.get('/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select('monthlyData');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.monthlyData);
    } catch (error) {
        handleError(res, error, 'Something went wrong');
    }
});

// Update a specific monthly data entry by username
router.put('/:username/:month/:entryId', async (req, res) => {
    const { username, month, entryId } = req.params;
    const { date, reason, expense, description, salary } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const monthlyData = user.monthlyData.find(data => data.month === month);
        if (!monthlyData) {
            return res.status(404).json({ message: 'Monthly data not found' });
        }

        const entryIndex = monthlyData.data.findIndex(entry => entry._id.toString() === entryId);
        if (entryIndex === -1) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        monthlyData.data[entryIndex] = { ...monthlyData.data[entryIndex], date, reason, expense, description, salary, balance: salary - expense };
        monthlyData.totalBalance = monthlyData.data.reduce((acc, dataItem) => acc + dataItem.balance, 0);

        user.totalBalance = user.monthlyData.reduce((acc, monthData) => acc + monthData.totalBalance, 0);

        await user.save();

        res.status(200).json(monthlyData.data[entryIndex]);
    } catch (error) {
        handleError(res, error, 'Something went wrong');
    }
});

// Add a new monthly data entry by username
router.post('/', async (req, res) => {
    const { username, month, date, reason, expense, description, salary } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newEntry = {
            date,
            reason,
            expense,
            description,
            salary,
            balance: salary - expense,
        };

        const monthlyData = user.monthlyData.find(data => data.month === month);
        if (monthlyData) {
            monthlyData.data.push(newEntry);
            monthlyData.totalBalance = monthlyData.data.reduce((acc, dataItem) => acc + dataItem.balance, 0);
        } else {
            user.monthlyData.push({ month, data: [newEntry], totalBalance: newEntry.balance });
        }

        user.totalBalance = user.monthlyData.reduce((acc, monthData) => acc + monthData.totalBalance, 0);

        await user.save();

        res.status(201).json(newEntry);
    } catch (error) {
        handleError(res, error, 'Something went wrong');
    }
});

// Delete a specific monthly data entry by username
router.delete('/:username/:month/:entryId', async (req, res) => {
    const { username, month, entryId } = req.params;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const monthlyData = user.monthlyData.find(data => data.month === month);
        if (!monthlyData) {
            return res.status(404).json({ message: 'Monthly data not found' });
        }

        monthlyData.data = monthlyData.data.filter(entry => entry._id.toString() !== entryId);
        monthlyData.totalBalance = monthlyData.data.reduce((acc, dataItem) => acc + dataItem.balance, 0);

        user.totalBalance = user.monthlyData.reduce((acc, monthData) => acc + monthData.totalBalance, 0);

        await user.save();

        res.status(200).json({ message: 'Monthly data entry deleted successfully' });
    } catch (error) {
        handleError(res, error, 'Something went wrong');
    }
});

module.exports = router;
