import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [user, setUser] = useState(null);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            console.log('Retrieved username from localStorage:', username);
            if (!username) {
                console.error('Username is not found in localStorage.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/api/auth/user/username/${username}`);
                setUser(response.data);
                console.log('Fetched user data:', response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, [username]);

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleImageUpload = async (e) => {
        if (!user) {
            console.error('User is invalid.');
            return;
        }

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('userId', user._id);

        try {
            const response = await axios.post('http://localhost:3000/api/auth/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUploadedImage(response.data.image);
            console.log('Uploaded image response:', response.data);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleLogout = async () => {
        if (!user) {
            console.error('User is invalid.');
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/auth/logout', {
                userId: user._id,
                logoutTime: new Date()
            });
            

            localStorage.removeItem('username');
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="bg-gray-200 dark:bg-gray-700 py-4">
            <div className="container mx-auto flex justify-between">
                <div>
                    <h1 className="text-3xl pl-8 text-white font-cursive">Kharcha Tracker</h1>
                </div>
                <div className="flex items-center justify-center pr-5 space-x-3">
                    <div className="">
                        <Link to="/home" className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            Home
                        </Link>
                    </div>
                    <div className="">
                        <Link to="/statistics" className="ml-4 text-lg font-bold text-gray-800 dark:text-gray-200">
                            Statistics
                        </Link>
                    </div>
                    {/* <div className="">
                        <Link to="/contact" className="ml-4 text-lg font-bold text-gray-800 dark:text-gray-200">
                            Contact
                        </Link>
                    </div> */}
                    <div className="py-2 px-4 text-lg font-bold text-gray-800 dark:text-gray-200">
                        <a href="#" onClick={handleLogout}>
                            Logout
                        </a>
                    </div>
                    <div className="">
                        <img
                            src={'https://avatar.iran.liara.run/public/8'}
                            alt="User Avatar"
                            className="rounded-full object-cover w-10 h-10 mr-8"
                            onClick={handleDropdownToggle}
                        />
                    </div>
                </div>
                {/* <div className="flex items-center relative">
                    <img
                        src={uploadedImage ? `http://localhost:3000/${setUploadedImage}` : 'https://avatar.iran.liara.run/public/8'}
                        alt="User Avatar"
                        className="rounded-full object-cover w-10 h-10 mr-8"
                        onClick={handleDropdownToggle}
                    />
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-48 w-48 bg-white dark:bg-gray-800 rounded shadow-md z-10">
                            <ul className="list-none mb-0">
                                <li className="py-2 px-4 text-white font-semibold hover:text-black hover:bg-gray-100 dark:hover:bg-gray-200">
                                    <input
                                        type="file"
                                        id="image-upload"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('image-upload').click();
                                    }}>
                                        Upload Image
                                    </a>
                                </li>
                                <li className="py-2 px-4 text-white font-semibold hover:text-black hover:bg-gray-100 dark:hover:bg-gray-200">
                                    <a href="#" onClick={handleLogout}>
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div> */}
            </div>
        </nav>
    );
};

export default Navbar;
