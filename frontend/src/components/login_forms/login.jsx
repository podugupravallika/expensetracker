import React, { useState } from 'react';
import Lottie from 'react-lottie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router for navigation
import Login_anim from '../../assets/login.json';

const Login = ({ handleToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // useNavigate hook for navigation

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Login_anim,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password) {
      errors.password = 'Password is required';
    } else if (!passwordRegex.test(password)) {
      errors.password = 'Password must be at least 6 characters, and include at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
        console.log('Login response:', response.data); // Log the response data
        // Handle successful login
        alert('Login successful!');
        // Store username in localStorage
        localStorage.setItem('username', response.data.result.username);
        console.log('Stored username in localStorage:', response.data.result.username); // Log the stored username
        // Navigate to home page
        navigate('/home');
      } catch (error) {
        console.error('Login error:', error.response?.data?.message);
        alert('Login failed. Please check your credentials and try again.');
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <section className="h-screen ">
        <div className="container mx-auto p-10">
          <div className="w-full max-w-4xl">
            <div className="block rounded-lg bg-white shadow-lg dark:bg-gray-800">
              <div className="lg:flex lg:flex-wrap">
                <div className="w-full lg:w-6/12 px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
                  <div className="text-center">
                    <Lottie options={defaultOptions} height={300} width={300} />
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="mb-4">Please login to your account</p>
                    <div className="relative mb-4">
                      <input
                        type="email"
                        className="block w-full rounded border bg-transparent px-3 py-2 leading-6 outline-none transition-all duration-200 ease-linear focus:text-primary"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </div>
                    <div className="relative mb-4">
                      <input
                        type="password"
                        className="block w-full rounded border bg-transparent px-3 py-2 leading-6 outline-none transition-all duration-200 ease-linear focus:text-primary"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                    </div>
                    <div className="mb-12 pb-1 pt-1 text-center">
                      <button
                        className="mb-3 inline-block w-full rounded border border-transparent hover:border hover:border-white px-6 py-2 text-md font-medium uppercase leading-normal text-white shadow-dark-3 transition duration-150 ease-in-out hover:shadow-dark-2 focus:shadow-dark-2 focus:outline-none focus:ring-0 active:shadow-dark-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                        type="submit"
                        style={{ background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)' }}
                      >
                        Log in
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="mb-0">Don't have an account?</p>
                      <button
                        type="button"
                        className="inline-block rounded border-2 border-danger px-6 py-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-danger-50/50 hover:text-danger-600 focus:border-danger-600 focus:bg-danger-50/50 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-rose-950 dark:focus:bg-rose-950"
                        onClick={handleToggle}
                      >
                        Register
                      </button>
                    </div>
                  </form>
                </div>
                <div
                  className="flex items-center justify-center w-full lg:w-6/12 rounded-b-lg lg:rounded-e-lg lg:rounded-bl-none"
                  style={{ background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)' }}
                >
                  <div className="px-4 py-6 text-center text-white md:mx-6 md:p-12">
                    <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold font-cursive">Kharcha Calculator</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default Login;
