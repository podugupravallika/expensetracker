const User = require('../models/User');

exports.addExpense = async (req, res) => {
    const { userId, date, month, salary, expenseReason, expenseAmount, description } = req.body;

    try {
        const user = await User.findById(userId);
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
            user.monthlyData.push({ month, data: [newEntry], totalBalance: newEntry.balance });
        }

        user.totalBalance = user.monthlyData.reduce((acc, monthData) => acc + monthData.totalBalance, 0);

        await user.save();

        res.status(201).json(newEntry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
