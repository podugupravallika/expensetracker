// Statistics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale);

const Statistics = () => {
    const [monthlyData, setMonthlyData] = useState({});
    const [username, setUsername] = useState(localStorage.getItem('username'));

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
            } catch (error) {
                console.error('Error fetching monthly data:', error);
            }
        };

        fetchMonthlyData();
    }, [username]);

    const calculateSaving = (month) => {
        const totalExpenses = monthlyData[month]?.reduce((acc, expense) => acc + expense.expense, 0) || 0;
        const totalSalary = monthlyData[month]?.[0]?.salary || 0;
        const savingAmount = totalSalary - totalExpenses;
        return savingAmount >= 0 ? savingAmount : 0;
    };

    // Prepare data for Doughnut Chart
    const doughnutData = {
        labels: Object.keys(monthlyData),
        datasets: [
            {
                label: 'Savings by Month',
                data: Object.keys(monthlyData).map(month => calculateSaving(month)),
                backgroundColor: Object.keys(monthlyData).map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`), // Random colors
                borderWidth: 1,
            },
        ],
    };

    // Prepare data for Bar Chart
    const barData = {
        labels: Object.keys(monthlyData),
        datasets: [
            {
                label: 'Total Expenses',
                data: Object.keys(monthlyData).map(month => monthlyData[month].reduce((acc, expense) => acc + expense.expense, 0)),
                backgroundColor: '#4CAF50',
                borderColor: '#388E3C',
                borderWidth: 1,
            },
            {
                label: 'Salary',
                data: Object.keys(monthlyData).map(month => monthlyData[month][0]?.salary || 0),
                backgroundColor: '#FF5722',
                borderColor: '#E64A19',
                borderWidth: 1,
            },
        ],
    };

    // Prepare data for Line Chart (Expenses)
    const lineData = {
        labels: Object.keys(monthlyData),
        datasets: [
            {
                label: 'Monthly Expenses',
                data: Object.keys(monthlyData).map(month => monthlyData[month].reduce((acc, expense) => acc + expense.expense, 0)),
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                fill: true,
                tension: 0.1,
            },
        ],
    };

    return (
        <>
            <Navbar />
            <div className="p-6">
                <h1 className="text-3xl font-bold text-center mb-8">Monthly Financial Dashboard</h1>

                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="w-full md:w-1/3 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Savings Overview</h2>
                        <div className="flex justify-center">
                            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Expenses and Salary</h2>
                        <div className="flex justify-center">
                            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Monthly Expenses</h2>
                        <div className="flex justify-center">
                            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(monthlyData).map(([month, expenses]) => (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4" key={month}>
                            <h2 className="text-xl font-semibold mb-2">{month}</h2>
                            <p className="text-gray-700"><strong>Salary:</strong>     <span className="text-md font-bold">₹</span> {expenses[0]?.salary || 0}</p>
                            <p className="text-gray-700"><strong>Total Expenses:</strong>     <span className="text-md font-bold">₹</span> {expenses.reduce((acc, expense) => acc + expense.expense, 0)}</p>
                            <p className="text-gray-700"><strong>Saving Amount:</strong>     <span className="text-md font-bold">₹</span> {calculateSaving(month)}</p>
                            <ul className="mt-4 space-y-2">
                                {expenses.map((expense, index) => (
                                    <li className="border-t border-gray-200 pt-2" key={index}>
                                        <p className="text-gray-600"><strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}</p>
                                        <p className="text-gray-600"><strong>Reason:</strong> {expense.reason}</p>
                                        <p className="text-gray-600"><strong>Amount:</strong>     <span className="text-md font-bold">₹</span> {expense.expense}</p>
                                        <p className="text-gray-600"><strong>Description:</strong> {expense.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Statistics;
