const express = require('express');
const User = require('../../models/User');
const router = express.Router();

// Utility function to handle errors
const handleError = (res, error, message, statusCode = 500) => {
    console.error(error);
    res.status(statusCode).json({ message });
};

// Add a new monthly data entry
router.post('/add-expense', async (req, res) => {
    const { username, date, month, salary, expenseReason, expenseAmount, description } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newEntry = {
            date,
            reason: expenseReason,
            expense: expenseAmount,
            description,
            salary,
            balance: salary - expenseAmount,
        };

        const monthlyData = user.monthlyData.find(data => data.month === month);
        if (monthlyData) {
            monthlyData.data.push(newEntry);
            monthlyData.totalBalance = monthlyData.data.reduce((acc, dataItem) => acc + dataItem.balance, 0);
        } else {
            user.monthlyData.push({
                month,
                data: [newEntry],
                totalBalance: newEntry.balance
            });
        }

        user.totalBalance = user.monthlyData.reduce((acc, monthData) => acc + monthData.totalBalance, 0);

        await user.save();

        res.status(201).json(newEntry);
    } catch (error) {
        handleError(res, error, 'Something went wrong');
    }
});

// Get all expenses for a user and month
router.get('/expenses', async (req, res) => {
    const { username, month } = req.query;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const monthlyData = user.monthlyData.find(data => data.month === month);
        if (!monthlyData) {
            return res.status(404).json({ message: 'No data found for the specified month' });
        }

        res.status(200).json(monthlyData.data);
    } catch (error) {
        handleError(res, error, 'Something went wrong');
    }
});

// Update an expense entry
router.put('/update-expense', async (req, res) => {
    const { username, date, month, salary, expenseReason, expenseAmount, description } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const monthlyData = user.monthlyData.find(data => data.month === month);
        if (!monthlyData) {
            return res.status(404).json({ message: 'No data found for the specified month' });
        }

        const expenseIndex = monthlyData.data.findIndex(entry => new Date(entry.date).toISOString().split('T')[0] === date);
        if (expenseIndex === -1) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Update the expense entry
        monthlyData.data[expenseIndex] = {
            date,
            reason: expenseReason,
            expense: expenseAmount,
            description,
            salary,
            balance: salary - expenseAmount,
        };

        monthlyData.totalBalance = monthlyData.data.reduce((acc, dataItem) => acc + dataItem.balance, 0);
        user.totalBalance = user.monthlyData.reduce((acc, monthData) => acc + monthData.totalBalance, 0);

        await user.save();

        res.status(200).json(monthlyData.data[expenseIndex]);
    } catch (error) {
        handleError(res, error, 'Something went wrong');
    }
});

// Delete an expense entry
router.delete('/delete-expense', async (req, res) => {
    const { username, date, month } = req.query;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const monthlyData = user.monthlyData.find(data => data.month === month);
        if (!monthlyData) {
            return res.status(404).json({ message: 'No data found for the specified month' });
        }

        const expenseIndex = monthlyData.data.findIndex(entry => new Date(entry.date).toISOString().split('T')[0] === date);
        if (expenseIndex === -1) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Remove the expense entry
        monthlyData.data.splice(expenseIndex, 1);

        monthlyData.totalBalance = monthlyData.data.reduce((acc, dataItem) => acc + dataItem.balance, 0);
        user.totalBalance = user.monthlyData.reduce((acc, monthData) => acc + monthData.totalBalance, 0);

        await user.save();

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        handleError(res, error, 'Something went wrong');
    }
});

module.exports = router;
