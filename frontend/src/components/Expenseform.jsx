import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExpenseForm = () => {
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [salary, setSalary] = useState('');
  const [expenseReason, setExpenseReason] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [description, setDescription] = useState('');

  // Retrieve username from local storage
  const username = localStorage.getItem('username');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const expenseData = {
      username, // Add username to expense data
      date,
      month,
      salary: parseFloat(salary),
      expenseReason,
      expenseAmount: parseFloat(expenseAmount),
      description
    };

    try {
      const response = await axios.post('http://localhost:3000/api/expense/add-expense', expenseData);
      console.log(response.data); // Handle success response
      toast.success('Expense added successfully!');
    } catch (error) {
      console.error(error); // Handle error
      toast.error('Failed to add expense. Please try again.');
    }

    // Reset form fields
    setDate('');
    setMonth('');
    setSalary('');
    setExpenseReason('');
    setExpenseAmount('');
    setDescription('');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col space-y-3'>
        <div className="">
          <label className='mb-2 text-lg font-semibold' htmlFor="date">Date:</label>
          <input className='w-full mb-0 py-2 border rounded-lg pl-1' type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required /><br />
        </div>
        <div className="">
          <label className='mb-2 text-lg font-semibold' htmlFor="month">Month:</label>
          <select className='w-full mb-0 py-2 border rounded-lg pl-1' id="month" value={month} onChange={(e) => setMonth(e.target.value)} required>
            <option value="" disabled>Select Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select><br />
        </div>
        <div className="">
          <label className='mb-2 text-lg font-semibold' htmlFor="salary">Salary:</label>
          <input className='w-full mb-0 py-2 border rounded-lg pl-1' type="number" id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} required /><br />
        </div>
        <div className="">
          <label className='mb-2 text-lg font-semibold' htmlFor="expenseReason">Expense Reason:</label>
          <input className='w-full mb-0 py-2 border rounded-lg pl-1' type="text" id="expenseReason" value={expenseReason} onChange={(e) => setExpenseReason(e.target.value)} required /><br />
        </div>
        <div className="">
          <label className='mb-2 text-lg font-semibold' htmlFor="expenseAmount">Expense Amount:</label>
          <input className='w-full mb-0 py-2 border rounded-lg pl-1' type="number" id="expenseAmount" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} required /><br />
        </div>
        <div className="">
          <label className='mb-2 text-lg font-semibold' htmlFor="description">Description:</label>
          <textarea className='w-full mb-0 py-2 border rounded-lg pl-1' id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" cols="50"></textarea><br />
        </div>
        <button type="submit" className='bg-blue-500 font-semibold text-white px-4 py-2 rounded-md shadow-md transform transition-transform duration-100 ease-in-out hover:scale-105 active:scale-95'>Add Expense</button>
      </form>
      <ToastContainer />
    </>
  );
};

export default ExpenseForm;
