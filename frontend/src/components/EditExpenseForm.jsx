// EditExpenseForm.js
import React, { useState, useEffect } from 'react';

const EditExpenseForm = ({ initialData, onSave }) => {
    const [expenseData, setExpenseData] = useState({
        date: '',
        reason: '',
        expense: '',
        description: '',
        ...initialData
    });

    useEffect(() => {
        setExpenseData({ ...initialData });
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(expenseData);
    };

    return (
        <form onSubmit={handleSubmit} className='mt-1'>
            <h1 className="text-xl font-bold text-center">Edit</h1>
            <div>
                <label className='font-bold text-md '>Date</label>
                <input type="date" name="date" className='border-2 mb-2 pl-2 py-2  w-full text black' value={expenseData.date} onChange={handleChange} />
            </div>
            <div>
                <label className='font-bold text-md '>Reason</label>
                <input type="text" name="reason" className='border-2 mb-2 pl-2 py-2  w-full text black' value={expenseData.reason} onChange={handleChange} />
            </div>
            <div>
                <label className='font-bold text-md '>Expense</label>
                <input type="number" name="expense" className='border-2 mb-2 pl-2 py-2  w-full text black' value={expenseData.expense} onChange={handleChange} />
            </div>
            <div>
                <label className='font-bold text-md '>Description</label>
                <input type="text" name="description" className='border-2 mb-2 pl-2 py-2  w-full text black' value={expenseData.description} onChange={handleChange} />
            </div>
            <div className="flex justify-end ">
                <button type="submit" className=' bg-blue-600 text-white rounded-lg py-1.5 px-1.5'>Save</button>
            </div>
        </form>
    );
};

export default EditExpenseForm;
