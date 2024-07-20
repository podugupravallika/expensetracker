import React, { useState, useEffect } from 'react';
import ExpenseForm from './Expenseform';
import EditExpenseForm from './EditExpenseForm';
import Modal from './Modal';
import './Home.css'; // Import CSS file for styling
import Navbar from './Navbar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaTrash, FaEdit } from 'react-icons/fa';

const Home = () => {
  const [monthlyData, setMonthlyData] = useState({});
  const [totalBalance, setTotalBalance] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [currentMonth, setCurrentMonth] = useState('');
  const username = localStorage.getItem('username'); // Replace with the actual username

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/monthlydata/${username}`);
        const data = response.data;

        // Transform the fetched data into the required format
        const formattedData = {};
        data.forEach(monthData => {
          formattedData[monthData.month] = monthData.data;
        });

        setMonthlyData(formattedData);
        calculateTotalBalance(formattedData);
      } catch (error) {
        console.error('Error fetching monthly data:', error);
      }
    };

    fetchMonthlyData();
  }, [username]);

  const addExpense = async (expense) => {
    try {
      const response = await axios.post('http://localhost:3000/api/monthlydata/add-expense', { username, ...expense });
      const savedExpense = response.data;

      const updatedMonthlyData = { ...monthlyData };
      const { month } = savedExpense;
      if (updatedMonthlyData[month]) {
        updatedMonthlyData[month].push(savedExpense);
      } else {
        updatedMonthlyData[month] = [savedExpense];
      }

      setMonthlyData(updatedMonthlyData);
      calculateTotalBalance(updatedMonthlyData);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const editExpense = async (expense) => {
    try {
      const { month, _id, ...updatedData } = expense;
      const response = await axios.put(`http://localhost:3000/api/monthlydata/${username}/${month}/${_id}`, updatedData);
      const updatedExpense = response.data;

      const updatedMonthlyData = { ...monthlyData };
      const monthData = updatedMonthlyData[month];
      const expenseIndex = monthData.findIndex(e => e._id === _id);
      if (expenseIndex !== -1) {
        monthData[expenseIndex] = updatedExpense;
      }

      setMonthlyData(updatedMonthlyData);
      calculateTotalBalance(updatedMonthlyData);
      setIsEditModalOpen(false);

      Swal.fire({
        title: "Success!",
        text: "Expense has been updated.",
        icon: "success",
        confirmButtonText: "OK"
      });
    } catch (error) {
      console.error('Error editing expense:', error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while updating the expense.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const deleteExpense = async (month, expenseId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/api/monthlydata/${username}/${month}/${expenseId}`);

          const updatedMonthlyData = { ...monthlyData };
          updatedMonthlyData[month] = updatedMonthlyData[month].filter(expense => expense._id !== expenseId);

          setMonthlyData(updatedMonthlyData);
          calculateTotalBalance(updatedMonthlyData);

          Swal.fire({
            title: "Deleted!",
            text: "Expense has been deleted.",
            icon: "success",
            confirmButtonText: "OK"
          });
        } catch (error) {
          console.error('Error deleting expense:', error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting the expense.",
            icon: "error",
            confirmButtonText: "OK"
          });
        }
      }
    });
  };

  const calculateSaving = (month) => {
    const totalExpenses = monthlyData[month]?.reduce((acc, expense) => acc + expense.expense, 0) || 0;
    const totalSalary = monthlyData[month]?.[0]?.salary || 0;
    const savingAmount = totalSalary - totalExpenses;
    return savingAmount >= 0 ? savingAmount : 0;
  };

  const calculateTotalBalance = (data) => {
    let totalSaving = 0;
    Object.values(data).forEach(expenses => {
      const totalExpenses = expenses.reduce((acc, expense) => acc + expense.expense, 0);
      const totalSalary = expenses[0]?.salary || 0;
      totalSaving += totalSalary - totalExpenses;
    });
    setTotalBalance(totalSaving >= 0 ? totalSaving : 0);
  };

  const generateRandomColor = () => {
    const colors = ['#34568B', '#FF6F61', '#6B5B95', '#88B04B', '#C3447A', '#955251', '#B565A7', '#DD4124', '#009B77'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleEditClick = (month, expense) => {
    setCurrentMonth(month);
    setCurrentExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleEditSave = (updatedExpense) => {
    editExpense({ month: currentMonth, ...updatedExpense });
  };

  return (
    <>
      <Navbar />
      <div className='Home'>
        <div className="max-w-[1200px] mx-auto p-[20px] flex">
          <div className="mr-[20px]">
            <ExpenseForm addExpense={addExpense} />
          </div>
          <div className="flex-1 bg-[#f9f9f9] p-[20px] rounded-lg">
            <h2 className='text-3xl text-center mb-2 italic'>Month wise Expenses</h2>
            <div className={totalBalance < 10000 ? "blinker" : ""}>
              <h3 className='text-black text-lg mb-2'>Total Savings: <span className="text-md font-bold">₹ {totalBalance}</span></h3>
            </div>
            <hr className='text-black'/>
            <div className='overflow-y-auto max-h-[550px]'>
              {Object.entries(monthlyData).map(([month, expenses]) => (
                <div className='box overflow-x' key={month} style={{ backgroundColor: generateRandomColor() }}>
                  <div className='box-content relative '>
                    <h3 className='month  font-semibold'>{month}</h3>
                    <p className='mt-2 absolute right-2 top-2 text-lg font-semibold '>Salary: ₹ {expenses[0]?.salary || 0}</p>
                    <hr />
                    <table className='mt-2 overflow-y-auto max-h-[300px]'>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Expense Reason</th>
                          <th>Expense Amount</th>
                          <th>Description</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((expense, index) => (
                          <tr key={index}>
                            <td>{new Date(expense.date).toLocaleDateString()}</td>
                            <td>{expense.reason}</td>
                            <td>{expense.expense}</td>
                            <td>{expense.description}</td>
                            <td className='space-x-2'>
                              <button className='edit' onClick={() => handleEditClick(month, expense)}><FaEdit /></button>
                              <button onClick={() => deleteExpense(month, expense._id)}><FaTrash /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className='font-bold text-lg'>Saving Amount: ₹ {calculateSaving(month)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        {currentExpense && (
          <EditExpenseForm
            initialData={currentExpense}
            onSave={handleEditSave}
          />
        )}
      </Modal>
    </>
  );
};

export default Home;
