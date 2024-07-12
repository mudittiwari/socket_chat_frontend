import { useCallback, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import LoadingBar from './Loadingbar';
import { notifySuccess,notifyError } from './utils/Notification';
function Login() {
    const navigate = useNavigate();
    const [state, setState] = useState("Login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const jwt = localStorage.getItem('ayna_jwt');
        const user = localStorage.getItem('ayna_user');

        if (jwt && user) {
            navigate('/chat');
            return;
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (email.trim().length===0){
            notifyError("Please enter email");
            return;
        }
        if(password.trim().length===0){
            notifyError("Please enter password");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('https://charming-appliance-3966cb327a.strapiapp.com/api/auth/local/', {
                    'identifier':email,
                    'password':password
                });
            const { jwt, user } = response.data;
            localStorage.setItem('ayna_jwt', jwt);
            localStorage.setItem('ayna_user', JSON.stringify(user));
            console.log(localStorage.getItem('ayna_jwt'))
            setLoading(false);
            navigate('/chat')
        } catch (error) {
            notifyError("Login failed. Please try again.");
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (username.trim().length===0) {
            notifyError("Please enter username");
            return;
        }
        if (email.trim().length===0){
            notifyError("Please enter email");
            return;
        }
        if(password.trim().length===0){
            notifyError("Please enter password");
            return;
        }
        if(password.trim().length<8){
            notifyError("Minimum length of the password should be 8");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('https://charming-appliance-3966cb327a.strapiapp.com/api/auth/local/register', {
                    'username':username,
                    'email':email,
                    'password':password
                });
            setLoading(false);
            notifySuccess("Signup successful. Please login.");
            setState("Login");
            setUsername("");
            setEmail("");
            setPassword("");
        } catch (error) {
            console.error(error);
            notifyError("Signup failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <LoadingBar />}
            <Toaster />
            <div className="flex justify-center items-center h-screen" style={{ "backgroundColor": '#67539f' }}>
                <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-8 shadow-lg">
                    {state === "Login" ? (
                        <div>
                            <h2 className="text-2xl text-white mb-5 w-full text-center">Login</h2>
                            <div className="mb-4">
                                <label className="block text-white mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 rounded bg-gray-300 text-gray-800 focus:bg-white focus:outline-none"
                                    type="email"
                                    id="email"
                                    value={email}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className="w-full px-3 py-2 rounded bg-gray-300 text-gray-800 focus:bg-white focus:outline-none"
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <button
                                className="w-full mb-2 bg-purple-800 hover:bg-purple-700 text-white py-2 px-4 rounded focus:outline-none"
                                type="submit"
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                            <button
                                className="w-full bg-purple-800 hover:bg-purple-700 text-white py-2 px-4 rounded focus:outline-none"
                                type="button"
                                onClick={() => setState("Signup")}
                            >
                                Signup
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-2xl text-white mb-5 w-full text-center">Signup</h2>
                            <div className="mb-4">
                                <label className="block text-white mb-2" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-3 py-2 rounded bg-gray-300 text-gray-800 focus:bg-white focus:outline-none"
                                    type="text"
                                    id="username"
                                    value={username}
                                    placeholder="Enter your username"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 rounded bg-gray-300 text-gray-800 focus:bg-white focus:outline-none"
                                    type="email"
                                    id="email"
                                    value={email}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className="w-full px-3 py-2 rounded bg-gray-300 text-gray-800 focus:bg-white focus:outline-none"
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <button
                                className="w-full mb-2 bg-purple-800 hover:bg-purple-700 text-white py-2 px-4 rounded focus:outline-none"
                                type="submit"
                                onClick={handleSignup}
                            >
                                Signup
                            </button>
                            <button
                                className="w-full bg-purple-800 hover:bg-purple-700 text-white py-2 px-4 rounded focus:outline-none"
                                type="button"
                                onClick={() => setState("Login")}
                            >
                                Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Login;
