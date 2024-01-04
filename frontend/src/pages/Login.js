import React, { useState } from 'react';
import bgimg from '../images/loginbg.jpg';
import { useNavigate } from 'react-router-dom';

// ... (previous imports and code)

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:4000/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    SeatNumber: username,
                    PNR: password,
                }),
            });

            const data = await response.json();

            console.log("test1")
            console.log(data.user.SeatNumber)
            console.log("test1")

            if (data.success) {
                // On successful login, navigate to /home
                navigate('/home', { state: { seatNumber: data.user.SeatNumber } });
            } else {
                // Handle login failure, display an error message, etc.
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            // Handle fetch error or other issues
            console.error('Error:', error);
        }

        // Clear the form fields
        setUsername('');
        setPassword('');
    };



    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${bgimg})` }}
        >
            <div className="max-w-md w-full md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto bg-white p-6 rounded-md shadow-md">
                <div className="mt-4 md:mt-0 md:ml-6">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                                Seat Number:
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={handleUsernameChange}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                                PNR:
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                                onSubmit={handleSubmit}
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default Login;
