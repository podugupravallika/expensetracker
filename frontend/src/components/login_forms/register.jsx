import React, { useState } from 'react';
import Lottie from 'react-lottie';
import axios from 'axios';
import Register_anim from '../../assets/register.json';

const Register = ({ handleToggle }) => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: Register_anim,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    // const validateForm = () => {
    //     const errors = {};
    //     if (!username) errors.username = 'Username is required';
    //     if (!firstName) errors.firstName = 'First name is required';
    //     if (!lastName) errors.lastName = 'Last name is required';
    //     if (!email) {
    //         errors.email = 'Email is required';
    //     } else if (!/\S+@\S+\.\S+/.test(email)) {
    //         errors.email = 'Email is invalid';
    //     }
    //     if (!password) {
    //         errors.password = 'Password is required';
    //     } else if (password.length < 6) {
    //         errors.password = 'Password must be at least 6 characters';
    //     }
    //     if (password !== confirmPassword) {
    //         errors.confirmPassword = 'Passwords do not match';
    //     }
    //     return errors;
    // };
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
        if (!username) errors.username = 'Username is required';
        if (!firstName) errors.firstName = 'First name is required';
        if (!lastName) errors.lastName = 'Last name is required';
        return errors;
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length === 0) {
            try {
                const existingUserResponse = await axios.get(`http://localhost:3000/api/auth/checkuser`, {
                    params: { email },
                });
                if (existingUserResponse.data.exists) {
                    alert('User already exists');
                    // Clear the input fields
                    setUsername('');
                    setFirstName('');
                    setLastName('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    // Toggle to login side
                    handleToggle();
                    return;
                }
                const response = await axios.post('http://localhost:3000/api/auth/register', {
                    username,
                    firstName,
                    lastName,
                    email,
                    password,
                });
                console.log(response.data);

                // Show success alert
                alert('Registration successful!');

                // Clear the input fields
                setUsername('');
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');

                // Toggle to login side
                handleToggle();
            } catch (error) {
                console.error('Registration error:', error.response.data.message);
                alert('Registration failed. Please try again.');
            }
        } else {
            setErrors(formErrors);
        }
    };

    return (
        <section className="h-screen container">
            <div className="container mx-auto p-10">
                <div className="flex h-full flex-wrap items-center justify-center text-gray-800 dark:text-gray-200">
                    <div className="w-full max-w-4xl">
                        <div className="block rounded-lg bg-white shadow-lg dark:bg-gray-800">
                            <div className="lg:flex lg:flex-wrap">
                                <div
                                    className="flex items-center justify-center w-full lg:w-6/12 rounded-b-lg rounded-t-lg lg:rounded-tr-none lg:rounded-br-none"
                                    style={{ background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)' }}
                                >
                                    <div className="px-4 py-6 lg:px-20 lg:py-20 text-center text-white md:mx-6 md:p-12">
                                        <div className="text-center mb-4">
                                            <Lottie options={defaultOptions} height={400} width={400} />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <p className="mb-4 text-center text-5xl font-semibold mb-8">Register</p>
                                        <div className="relative mb-4">
                                            <input
                                                type="text"
                                                className="block w-full rounded border bg-transparent px-3 py-2 leading-6 outline-none transition-all duration-200 ease-linear focus:text-primary"
                                                placeholder="Username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                                        </div>
                                        <div className="relative mb-4">
                                            <input
                                                type="text"
                                                className="block w-full rounded border bg-transparent px-3 py-2 leading-6 outline-none transition-all duration-200 ease-linear focus:text-primary"
                                                placeholder="First Name"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                        </div>
                                        <div className="relative mb-4">
                                            <input
                                                type="text"
                                                className="block w-full rounded border bg-transparent px-3 py-2 leading-6 outline-none transition-all duration-200 ease-linear focus:text-primary"
                                                placeholder="Last Name"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                        </div>
                                        <div className="relative mb-4">
                                            <input
                                                type="email"
                                                className="block w-full rounded border bg-transparent px-3 py-2 leading-6 outline-none transition-all duration-200 ease-linear focus:text-primary"
                                                placeholder="Email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>
                                        <div className="relative mb-4">
                                            <input
                                                type="password"
                                                className="block w-full rounded border bg-transparent px-3 py-2 leading-6 outline-none transition-all duration-200 ease-linear focus:text-primary"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                        </div>
                                        <div className="relative mb-4">
                                            <input
                                                type="password"
                                                className="block w-full rounded border bg-transparent px-3 py-2 leading-6 outline-none transition-all duration-200 ease-linear focus:text-primary"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                                        </div>
                                        <div className="mb-12 pb-1 pt-1 text-center">
                                            <button
                                                className="mb-3 inline-block w-full rounded border border-transparent hover:border hover:border-white px-6 py-2 text-md font-medium uppercase leading-normal text-white shadow-dark-3 transition duration-150 ease-in-out hover:shadow-dark-2 focus:shadow-dark-2 focus:outline-none focus:ring-0 active:shadow-dark-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                                                type="submit"
                                                style={{ background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)' }}
                                            >
                                                Register
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="mb-0">Already have an account?</p>
                                            <button
                                                type="button"
                                                className="inline-block rounded border-2 border-danger px-6 py-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-danger-50/50 hover:text-danger-600 focus:border-danger-600 focus:bg-danger-50/50 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-rose-950 dark:focus:bg-rose-950"
                                                onClick={handleToggle}
                                            >
                                                Login
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
